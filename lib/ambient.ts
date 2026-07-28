/**
 * The background sound, synthesised in the browser.
 *
 * There is no file and no third party here: a handful of oscillators, a slow
 * filter, and a reverb built from noise. That removes every problem the
 * Spotify embed brought with it — no cross-origin player to command, no
 * position it remembers between visits, no thirty-second preview, no session
 * to sign into. It starts at the beginning because there is no elsewhere to
 * start from, and it never ends.
 *
 * Voiced as a drone in A: a low root, its fifth and octave, and far above
 * them the occasional struck note from the pentatonic scale — instrumental,
 * unhurried, and quiet enough to sit under a page rather than on top of it.
 */

const ROOT = 55; // A1

/** A minor pentatonic, three octaves up, for the struck notes. */
const CHIMES = [440, 523.25, 587.33, 659.25, 783.99, 880];

type Layer = {
  osc: OscillatorNode;
  gain: GainNode;
  pan: StereoPannerNode;
};

export class Ambient {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private wet: ConvolverNode | null = null;
  private layers: Layer[] = [];
  private movers: OscillatorNode[] = [];
  private chimeTimer = 0;

  /** Quiet enough to sit under a page. */
  private readonly level = 0.16;

  get running() {
    return this.ctx !== null && this.ctx.state === "running";
  }

  async start() {
    if (this.ctx) {
      await this.ctx.resume();
      this.fade(this.level, 3);
      return;
    }

    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) throw new Error("no web audio");

    const ctx = new Ctor();
    this.ctx = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    this.master = master;

    // a room, made of decaying noise
    const wet = ctx.createConvolver();
    wet.buffer = impulse(ctx, 3.2);
    const wetGain = ctx.createGain();
    wetGain.gain.value = 0.55;
    wet.connect(wetGain).connect(master);
    this.wet = wet;

    // the drone: root, fifth, octave, and a twelfth above that
    const shelf = ctx.createBiquadFilter();
    shelf.type = "lowpass";
    shelf.frequency.value = 760;
    shelf.Q.value = 0.6;
    shelf.connect(master);
    shelf.connect(wet);

    const voices: [number, number, OscillatorType][] = [
      [ROOT, 0.3, "sine"],
      [ROOT * 1.5, 0.2, "sine"],
      [ROOT * 2, 0.15, "triangle"],
      [ROOT * 3, 0.06, "sine"],
    ];

    voices.forEach(([freq, level, type], i) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      gain.gain.value = level;

      const pan = ctx.createStereoPanner();
      pan.pan.value = i % 2 ? 0.25 : -0.25;

      osc.connect(gain).connect(pan).connect(shelf);
      osc.start();
      this.layers.push({ osc, gain, pan });

      // each voice drifts a few cents against the others, on its own clock
      this.move(osc.detune, 5 + i * 2, 0.02 + i * 0.011);
      // and wanders slowly across the stereo field
      this.move(pan.pan, 0.35, 0.013 + i * 0.007);
    });

    // the filter opens and closes over roughly a minute
    this.move(shelf.frequency, 280, 0.017);

    // and the whole thing breathes
    this.move(master.gain, this.level * 0.22, 0.024);

    await ctx.resume();
    this.fade(this.level, 6);
    this.scheduleChime();
  }

  pause() {
    if (!this.ctx) return;
    this.fade(0, 1.4);
    window.clearTimeout(this.chimeTimer);
    const ctx = this.ctx;
    window.setTimeout(() => {
      if (this.ctx === ctx) void ctx.suspend();
    }, 1500);
  }

  /** Stop everything and build it again, so the drift starts over. */
  async restart() {
    await this.dispose();
    await this.start();
  }

  async dispose() {
    window.clearTimeout(this.chimeTimer);
    const ctx = this.ctx;
    if (!ctx) return;
    this.fade(0, 0.4);
    await new Promise((r) => window.setTimeout(r, 450));
    this.layers.forEach((l) => l.osc.stop());
    this.movers.forEach((m) => m.stop());
    this.layers = [];
    this.movers = [];
    this.master = null;
    this.wet = null;
    this.ctx = null;
    await ctx.close();
  }

  /** A slow sine on any parameter: the only thing that keeps this alive. */
  private move(param: AudioParam, depth: number, hz: number) {
    if (!this.ctx) return;
    const lfo = this.ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = hz;
    const amount = this.ctx.createGain();
    amount.gain.value = depth;
    lfo.connect(amount).connect(param);
    lfo.start();
    this.movers.push(lfo);
  }

  private fade(to: number, seconds: number) {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    const g = this.master.gain;
    g.cancelScheduledValues(now);
    g.setValueAtTime(Math.max(g.value, 0.0001), now);
    g.linearRampToValueAtTime(to, now + seconds);
  }

  /** A struck note now and then, never on the beat. */
  private scheduleChime() {
    this.chimeTimer = window.setTimeout(
      () => {
        this.strike();
        this.scheduleChime();
      },
      9000 + Math.random() * 12000,
    );
  }

  private strike() {
    const ctx = this.ctx;
    if (!ctx || !this.master || !this.wet) return;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = CHIMES[Math.floor(Math.random() * CHIMES.length)];

    const gain = ctx.createGain();
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.4 - 0.7;

    const now = ctx.currentTime;
    const life = 5 + Math.random() * 4;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.055, now + 0.9);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + life);

    osc.connect(gain).connect(pan);
    pan.connect(this.master);
    pan.connect(this.wet);
    osc.start(now);
    osc.stop(now + life + 0.2);
  }
}

/** Decaying noise, which is all a small reverb needs to be. */
function impulse(ctx: AudioContext, seconds: number) {
  const rate = ctx.sampleRate;
  const length = Math.floor(rate * seconds);
  const buffer = ctx.createBuffer(2, length, rate);

  for (let c = 0; c < 2; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < length; i++) {
      const decay = Math.pow(1 - i / length, 2.6);
      data[i] = (Math.random() * 2 - 1) * decay;
    }
  }
  return buffer;
}
