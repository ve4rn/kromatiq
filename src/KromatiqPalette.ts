import type { Kromatiq } from "./Kromatiq.js";
import { KromatiqRoleColorSequence } from "./KromatiqRoleColorSequence.js";
import type {
  ColorInput,
  PaletteDefinition,
} from "./types.js";
import { stableEntries } from "./utils/object.js";
import { suggestClosest } from "./utils/suggest.js";

export class KromatiqPalette {
  readonly #owner: Kromatiq;
  readonly #name: string;
  readonly #definition: PaletteDefinition;

  constructor(owner: Kromatiq, name: string, definition: PaletteDefinition) {
    this.#owner = owner;
    this.#name = name;
    this.#definition = { ...definition };
  }

  get name(): string {
    return this.#name;
  }

  color(name: string) {
    const value = this.#definition[name];
    if (value === undefined) {
      const suggestion = suggestClosest(name, Object.keys(this.#definition));
      const message = suggestion
        ? `Unknown palette color "${name}" in "${this.#name}". Did you mean "${suggestion}"?`
        : `Unknown palette color "${name}" in "${this.#name}".`;
      throw new Error(message);
    }

    return this.#owner.color(value);
  }

  values() {
    return stableEntries(this.#definition).map(([, value]) => this.#owner.color(value));
  }

  entries() {
    return stableEntries(this.#definition).map(([name, value]) => [
      name,
      this.#owner.color(value),
    ] as const);
  }

  gradient() {
    const values = stableEntries(this.#definition).map(([, value]) => value);
    if (values.length < 2) {
      throw new Error(
        `Palette "${this.#name}" needs at least two colors to build a gradient.`,
      );
    }

    return this.#owner.gradient(...values);
  }

  gradientSteps(steps: number) {
    return this.gradient().steps(steps);
  }

  role(index = 0) {
    return new KromatiqRoleColorSequence(this.#owner, this).at(index);
  }

  toRecord(): Record<string, ColorInput> {
    return { ...this.#definition };
  }
}
