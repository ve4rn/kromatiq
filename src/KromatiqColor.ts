import {
  contrastRatio as contrastRatioValue,
  fitToRgbGamut,
  interpolateColor,
  oklchToRgb,
  rgbToOklch,
} from "./color-space/index.js";
import type { Kromatiq } from "./Kromatiq.js";
import type { ColorInput, GradientMode, OKLCH, RGB } from "./types.js";
import { clamp } from "./utils/clamp.js";
import { rgbToHex, rgbToInt } from "./utils/color.js";

export class KromatiqColor {
  readonly #owner: Kromatiq;
  readonly #rgb: RGB;

  constructor(owner: Kromatiq, rgb: RGB) {
    this.#owner = owner;
    this.#rgb = owner.rgb(rgb);
  }

  get int(): number {
    return rgbToInt(this.#rgb);
  }

  get hex(): string {
    return rgbToHex(this.#rgb);
  }

  get css(): string {
    return this.hex;
  }

  get oklch(): OKLCH {
    return rgbToOklch(this.#rgb);
  }

  lighten(amount = 10): KromatiqColor {
    return this.#transform((oklch) => ({
      ...oklch,
      l: clamp(oklch.l + amount / 100, 0, 1),
    }));
  }

  darken(amount = 10): KromatiqColor {
    return this.#transform((oklch) => ({
      ...oklch,
      l: clamp(oklch.l - amount / 100, 0, 1),
    }));
  }

  saturate(amount = 10): KromatiqColor {
    const factor = 1 + Math.max(0, amount) / 100;

    return this.#transform((oklch) => ({
      ...oklch,
      c: Math.max(0, oklch.c * factor),
    }));
  }

  desaturate(amount = 10): KromatiqColor {
    const factor = 1 - clamp(amount / 100, 0, 1);

    return this.#transform((oklch) => ({
      ...oklch,
      c: Math.max(0, oklch.c * factor),
    }));
  }

  rotateHue(degrees: number): KromatiqColor {
    return this.#transform((oklch) => ({
      ...oklch,
      h: ((oklch.h + degrees) % 360 + 360) % 360,
    }));
  }

  mix(target: ColorInput, amount = 50, mode: GradientMode = "oklch"): KromatiqColor {
    return new KromatiqColor(
      this.#owner,
      interpolateColor(this.#rgb, this.#owner.rgb(target), clamp(amount / 100, 0, 1), mode),
    );
  }

  contrastRatio(background: ColorInput): number {
    return contrastRatioValue(this.#rgb, this.#owner.rgb(background));
  }

  toString(): string {
    return this.hex;
  }

  [Symbol.toPrimitive](hint: string): string | number {
    if (hint === "number") {
      return this.int;
    }

    return this.hex;
  }

  #transform(modifier: (oklch: OKLCH) => OKLCH): KromatiqColor {
    const next = fitToRgbGamut(modifier(this.oklch));
    return new KromatiqColor(this.#owner, oklchToRgb(next));
  }
}
