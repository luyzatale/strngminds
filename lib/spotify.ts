/**
 * The episode list for /podcast, read from Spotify rather than kept by hand.
 *
 * Spotify's public pages are client-rendered and their embed for a *show* only
 * ever returns the newest episode, so there is no list to read without an
 * account — and the anonymous token endpoint the web player uses answers 400
 * with "usage of this endpoint is not permitted under the Spotify Developer
 * Terms". The sanctioned route is the Web API under the client-credentials
 * grant, which needs an app registered at developer.spotify.com and two
 * environment variables:
 *
 *   SPOTIFY_CLIENT_ID
 *   SPOTIFY_CLIENT_SECRET
 *
 * Without them — and if Spotify is ever down or slow — the page falls back to
 * FALLBACK_EPISODES below, so it always renders something.
 *
 * This module is server-only: it is imported by a server component and reads a
 * secret. Never import it from a file carrying "use client".
 */

export const SHOW_ID = "1RiUyEr5E585brB4cuq2X9";
export const SHOW_URL = `https://open.spotify.com/show/${SHOW_ID}`;

/**
 * Episodes are territory-scoped, and the client-credentials grant carries no
 * user, so a market has to be named or Spotify returns an empty list.
 */
const MARKET = process.env.SPOTIFY_MARKET ?? "NL";

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API = "https://api.spotify.com/v1";

export type Episode = {
  id: string;
  /** Two digits, as displayed: "04". */
  n: string;
  title: string;
  /** ISO date; the list is sorted on this, newest first. */
  releaseDate: string;
};

type RawEpisode = {
  id: string | null;
  name: string;
  release_date: string;
};

type EpisodePage = {
  items: (RawEpisode | null)[];
  next: string | null;
};

/**
 * The five episodes as they stood on 2026-08-13, titles and dates as Spotify
 * gives them. Used only when the API is unconfigured or unreachable — a new
 * episode does not need adding here, which is the whole point of the fetch
 * below.
 */
const FALLBACK_EPISODES: RawEpisode[] = [
  { id: "1RLEE0XgqnYvuyGADbQYGe", name: "5 | How to cultivate a STRNG MIND", release_date: "2026-08-07" },
  { id: "5Mgr3vhGIlLLqNT1RnKzem", name: "4 | Self-Sabotage: why we do it & how to stop it", release_date: "2025-07-06" },
  { id: "5w8OF4hncsDqMFzaUWvJDa", name: "3 | Becoming your Higher Self", release_date: "2025-07-03" },
  { id: "0phFg9T4kohROnXpifWita", name: "2 | Soul-led Leadership: Leading from inner power, not performance", release_date: "2025-06-15" },
  { id: "3IyLgdt0pEysei6csJL5m2", name: "1 | Ego vs Soul - Who is leading your life ?", release_date: "2025-06-07" },
];

/**
 * Titles on this show are numbered by hand, as "5 | How to cultivate a STRNG
 * MIND". The number belongs in its own column on the page, so it is split off
 * here; an episode published without one — a trailer, a bonus — keeps its full
 * title and takes its number from its position in the list instead.
 */
const NUMBERED = /^\s*(\d{1,3})\s*[|.:–—-]\s*(.+)$/;

function normalise(raw: RawEpisode[]): Episode[] {
  // Newest first. The API documents this as the default order rather than
  // guaranteeing it, and the order is what the page promises, so sort anyway.
  const sorted = [...raw].sort((a, b) =>
    b.release_date.localeCompare(a.release_date),
  );

  return sorted.map((item, i) => {
    const match = item.name.match(NUMBERED);
    // No prefix to read: count down from the top, so the newest is highest.
    const n = match ? Number(match[1]) : sorted.length - i;
    return {
      id: item.id as string,
      n: String(n).padStart(2, "0"),
      title: (match ? match[2] : item.name).trim(),
      releaseDate: item.release_date,
    };
  });
}

/**
 * Tokens last an hour. This module-level cache is per server instance, which
 * is all it needs to be — a cold instance simply asks for a new one.
 */
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getToken(): Promise<string | null> {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) return null;

  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
    // Next never puts a POST in the fetch cache, so this always runs; the
    // module-level cache above is what stops it running more than hourly.
  });
  if (!res.ok) throw new Error(`Spotify token: ${res.status}`);

  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: json.access_token,
    // a minute of headroom, so a token cannot expire mid-request
    expiresAt: Date.now() + (json.expires_in - 60) * 1000,
  };
  return cachedToken.value;
}

/**
 * Every episode of the show, newest first.
 *
 * Called from a page with `revalidate` set, so this runs once per window and
 * the result is served from the route cache in between.
 */
export async function getEpisodes(): Promise<Episode[]> {
  try {
    const token = await getToken();
    if (!token) return normalise(FALLBACK_EPISODES);

    const collected: RawEpisode[] = [];
    let url: string | null =
      `${API}/shows/${SHOW_ID}/episodes?market=${MARKET}&limit=50`;

    // The show is short today, but the API pages at 50 and there is no reason
    // for this to quietly truncate on the day it isn't.
    while (url) {
      const res: Response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        // Matches the page's own revalidate window. `no-store` here would opt
        // the whole route into rendering per request, and the point of this
        // module is one round trip per window, not one per visitor.
        next: { revalidate: 900 },
      });
      if (!res.ok) throw new Error(`Spotify episodes: ${res.status}`);

      const page = (await res.json()) as EpisodePage;
      for (const item of page.items) {
        // Spotify pads pages with nulls for items unavailable in the market.
        if (item?.id) collected.push(item);
      }
      url = page.next;
    }

    if (collected.length === 0) throw new Error("Spotify returned no episodes");
    return normalise(collected);
  } catch (error) {
    console.error("[spotify] falling back to the built-in episode list:", error);
    return normalise(FALLBACK_EPISODES);
  }
}