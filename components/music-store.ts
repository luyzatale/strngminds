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
    cb: (e: { data: { isPaused: boolean; position?: number } }) => void,
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

/** Last playhead position the embed reported, in milliseconds. */
let position = 0;
let watchdog = 0;
let startedAt = 0;

export const musicStore = {
  controller: null as MusicController | null,

  get: () => state,
  /** Same object every time, so the server render is stable. */
  getServer: () => initial,

  /** Told by the player on every update. Deliberately not React state. */
  reportPosition(ms: number) {
    position = ms;
  },

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
   * Always from the top.
   *
   * `play()` and `togglePlay()` resume wherever the embed left its playhead,
   * and Spotify remembers that between visits. `playFromStart()` is the right
   * command and goes first — but the embed does not always honour it, so this
   * then watches the position the embed reports back: if the track is further
   * along than the time since the press, it plainly did not rewind, and we
   * seek to zero ourselves. Watching the real playhead is the only way to be
   * certain, because which command wins varies by device and by session.
   */
  playFromTop() {
    const c = this.controller;
    if (!c) return;

    position = 0;
    startedAt = Date.now();

    if (typeof c.playFromStart === "function") c.playFromStart();
    else c.play();
    c.seek?.(0);

    if (watchdog) window.clearInterval(watchdog);
    watchdog = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      if (elapsed > 5000) {
        window.clearInterval(watchdog);
        watchdog = 0;
        return;
      }
      if (state.playing && position > elapsed + 1200) {
        c.seek?.(0);
        position = 0;
      }
    }, 400);
  },

  pause() {
    if (watchdog) {
      window.clearInterval(watchdog);
      watchdog = 0;
    }
    this.controller?.pause();
  },

  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};
