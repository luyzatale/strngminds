/**
 * The background track has to outlive a page change, so the player is mounted
 * once in the root layout and the button that drives it lives in the bar.
 * They meet here rather than through a context, because the player must not
 * re-render every consumer each time playback ticks.
 */

export type MusicController = {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  /** Spotify's own rewind-and-play; the name has no "At" on it. */
  playFromStart?: () => void;
  seek?: (seconds: number) => void;
  destroy?: () => void;
  addListener: (
    event: string,
    cb: (e: { data: { isPaused: boolean } }) => void,
  ) => void;
};

export type MusicState = {
  ready: boolean;
  playing: boolean;
  failed: boolean;
};

const initial: MusicState = { ready: false, playing: false, failed: false };

let state: MusicState = initial;
const listeners = new Set<() => void>();

export const musicStore = {
  controller: null as MusicController | null,

  get: () => state,
  /** Same object every time, so the server render is stable. */
  getServer: () => initial,

  set(patch: Partial<MusicState>) {
    const next = { ...state, ...patch };
    if (
      next.ready === state.ready &&
      next.playing === state.playing &&
      next.failed === state.failed
    ) {
      return;
    }
    state = next;
    listeners.forEach((fn) => fn());
  },

  /**
   * Always from the top. `play()` and `togglePlay()` both resume wherever the
   * embed left its playhead, and Spotify remembers that between visits — so
   * every route into playback goes through here instead.
   */
  playFromTop() {
    const c = this.controller;
    if (!c) return;
    if (typeof c.playFromStart === "function") c.playFromStart();
    else {
      c.seek?.(0);
      c.play();
    }
  },

  pause() {
    this.controller?.pause();
  },

  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};
