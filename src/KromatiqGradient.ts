import type { Kromatiq } from "./Kromatiq.js";
import { KromatiqColor } from "./KromatiqColor.js";
import type { ColorInput, GradientMode } from "./types.js";

export class KromatiqGradient {
  readonly #owner: Kromatiq;
  readonly #colors: readonly KromatiqColor[];
  readonly #mode: GradientMode;

  constructor(owner: Kromatiq, colors: readonly ColorInput[], mode: GradientMode = "oklch") {
    if (colors.length < 2) {
      throw new Error("A gradient needs at least two colors.");
    }

    this.#owner = owner;
    this.#colors = colors.map((color) => owner.color(color));
    this.#mode = mode;
  }

  mode(mode: GradientMode): KromatiqGradient {
    return new KromatiqGradient(this.#owner, this.#colors, mode);
  }

  at(ratio: number): KromatiqColor {
    if (!Number.isFinite(ratio)) {
      throw new Error(`Gradient ratio must be a finite number, received ${ratio}.`);
    }

    const clamped = Math.min(1, Math.max(0, ratio));
    const first = this.#colors[0];
    const last = this.#colors[this.#colors.length - 1];

    if (clamped === 0) {
      return first!;
    }

    if (clamped === 1) {
      return last!;
    }

    const scaled = clamped * (this.#colors.length - 1);
    const index = Math.floor(scaled);
    const localRatio = scaled - index;
    const left = this.#colors[index];
    const right = this.#colors[index + 1];
    return left!.mix(right!, localRatio * 100, this.#mode);
  }

  steps(count: number): KromatiqColor[] {
    if (!Number.isInteger(count) || count <= 0) {
      throw new Error(`Gradient steps must be a positive integer, received ${count}.`);
    }

    const size = count;
    if (size === 1) {
      return [this.at(0)];
    }

    return Array.from({ length: size }, (_, index) =>
      this.at(index / (size - 1)),
    );
  }

  toHexSteps(count: number): string[] {
    return this.steps(count).map((color) => color.hex);
  }

  toIntSteps(count: number): number[] {
    return this.steps(count).map((color) => color.int);
  }

  toDiscordRole() {
    const first = this.#colors[0];
    const last = this.#colors[this.#colors.length - 1];
    return this.#owner.roleColors(
      first!,
      last!,
    );
  }
}
