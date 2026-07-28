import { Ambient } from "@/lib/ambient";

/**
 * The background sound is synthesised in the browser rather than embedded, so
 * there is no player to command and nothing to load. This exists only so the
 * control in the corner can drive it and follow its state.
 */

export type MusicState = {
  ready: boolean;
  playing: boolean;
  failed: boolean;
};

/** Nothing to wait for: the sound is built the moment it is asked for. */
const initial: MusicState = { ready: true, playing: false, failed: false };

let state: MusicState = initial;
const listeners = new Set<() => void>();
let engine: Ambient | null = null;
let busy = false;

function commit(patch: Partial<MusicState>) {
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
}

export const musicStore = {
  get: () => state,
  /** Same object every time, so the server render is stable. */
  getServer: () => initial,

  set: commit,

  async play() {
    if (busy) return;
    busy = true;
    try {
      engine ??= new Ambient();
      await engine.start();
      commit({ playing: true, failed: false });
    } catch {
      commit({ failed: true });
    } finally {
      busy = false;
    }
  },

  pause() {
    engine?.pause();
    commit({ playing: false });
  },

  toggle() {
    if (state.playing) this.pause();
    else void this.play();
  },

  /** Tear it down and build it again, so the slow drift begins afresh. */
  async restart() {
    if (busy) return;
    busy = true;
    try {
      engine ??= new Ambient();
      await engine.restart();
      commit({ playing: true, failed: false });
    } catch {
      commit({ failed: true });
    } finally {
      busy = false;
    }
  },

  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};
