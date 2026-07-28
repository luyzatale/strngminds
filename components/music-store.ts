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

  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};
