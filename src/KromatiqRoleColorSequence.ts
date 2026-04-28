import type { Kromatiq } from "./Kromatiq.js";
import { KromatiqColor } from "./KromatiqColor.js";
import { KromatiqPalette } from "./KromatiqPalette.js";
import type {
  ColorInput,
  DiscordRoleColors,
  RoleSequenceInput,
  RoleSequenceOptions,
} from "./types.js";

export type RoleLike = {
  setColors(colors: DiscordRoleColors, reason?: string): unknown;
};

export class KromatiqRoleColorSequence {
  readonly #owner: Kromatiq;
  readonly #palette: KromatiqPalette | undefined;
  readonly #sourceColors: readonly ColorInput[];
  readonly #gradient: boolean;
  readonly #steps: number | undefined;
  readonly #wrap: boolean;
  #cursor = 0;

  constructor(
    owner: Kromatiq,
    input: RoleSequenceInput,
    options: RoleSequenceOptions = {},
  ) {
    this.#owner = owner;
    this.#gradient = options.gradient ?? true;
    this.#steps = this.#normalizeSteps(options.steps);
    this.#wrap = options.wrap ?? true;

    if (Array.isArray(input)) {
      if (input.length === 0) {
        throw new Error("A role sequence array must contain at least one color.");
      }

      this.#sourceColors = [...input];
      return;
    }

    if (typeof input === "string") {
      const palette = owner.palette(input);
      this.#palette = palette;
      this.#sourceColors = palette.values();
      return;
    }

    const palette = input as KromatiqPalette;
    this.#palette = palette;
    this.#sourceColors = palette.values();
  }

  get gradient(): boolean {
    return this.#gradient;
  }

  at(index: number): DiscordRoleColors {
    if (!Number.isInteger(index) || index < 0) {
      throw new Error(`Role sequence index must be a non-negative integer, received ${index}.`);
    }

    const targetIndex = index;

    if (this.#gradient) {
      const colors = this.#colorsForRoles(targetIndex + 1);
      const primary = colors[targetIndex];
      const secondary = colors[targetIndex + 1];

      if (!primary) {
        throw new Error("Unable to resolve a primary color for this role sequence.");
      }

      if (!secondary) {
        return this.#owner.roleColors(primary);
      }

      return this.#owner.roleColors(primary, secondary);
    }

    const colors = this.#colorsForRoles(targetIndex + 1);
    const primary = colors[targetIndex];

    if (!primary) {
      throw new Error("Unable to resolve a primary color for this role sequence.");
    }

    return this.#owner.roleColors(primary);
  }

  next(): DiscordRoleColors {
    const value = this.at(this.#cursor);
    this.#cursor += 1;
    return value;
  }

  random(): DiscordRoleColors {
    const maxIndex = Math.max(0, this.#roleCapacity() - 1);
    const index = Math.floor(Math.random() * (maxIndex + 1));
    return this.at(index);
  }

  list(count: number): DiscordRoleColors[] {
    if (!Number.isInteger(count) || count < 0) {
      throw new Error(`Role sequence count must be a non-negative integer, received ${count}.`);
    }

    const size = count;
    return Array.from({ length: size }, (_, index) => this.at(index));
  }

  async applyTo(roles: readonly RoleLike[], reason?: string): Promise<void> {
    if (!Array.isArray(roles)) {
      throw new Error("roleSequence.applyTo(...) expects an array of role-like objects.");
    }

    const size = roles.length;
    const colors = this.#listForApply(size);

    for (const [index, role] of roles.entries()) {
      if (!role || typeof role.setColors !== "function") {
        throw new Error(
          `roleSequence.applyTo(...) expected item ${index} to expose setColors(colors, reason?).`,
        );
      }

      await role.setColors(colors[index]!, reason);
    }
  }

  #listForApply(count: number): DiscordRoleColors[] {
    const size = count;
    return Array.from({ length: size }, (_, index) => this.at(index));
  }

  #roleCapacity(): number {
    if (this.#gradient) {
      const baseCount = this.#steps ?? this.#sourceColors.length;
      return Math.max(1, baseCount - 1);
    }

    return Math.max(1, this.#steps ?? this.#sourceColors.length);
  }

  #colorsForRoles(roleCount: number): KromatiqColor[] {
    const sourceCount = this.#sourceColors.length;

    if (sourceCount === 0) {
      throw new Error("A role color sequence needs at least one color.");
    }

    if (sourceCount === 1) {
      return [this.#owner.color(this.#sourceColors[0]!)];
    }

    if (this.#gradient) {
      const requiredColors = roleCount + 1;
      const directColors = this.#steps === undefined && sourceCount >= requiredColors;

      if (directColors) {
        return this.#windowedColors(requiredColors);
      }

      const steps = Math.max(requiredColors, this.#steps ?? requiredColors);
      return this.#owner.gradient(...this.#sourceColors).steps(steps);
    }

    if (this.#steps === undefined && sourceCount >= roleCount) {
      return this.#windowedColors(roleCount);
    }

    const steps = Math.max(roleCount, this.#steps ?? roleCount);
    return this.#owner.gradient(...this.#sourceColors).steps(steps);
  }

  #windowedColors(count: number): KromatiqColor[] {
    const sourceCount = this.#sourceColors.length;
    const colors: KromatiqColor[] = [];

    for (let index = 0; index < count; index += 1) {
      if (this.#wrap) {
        colors.push(this.#owner.color(this.#sourceColors[index % sourceCount]!));
        continue;
      }

      const boundedIndex = Math.min(index, sourceCount - 1);
      colors.push(this.#owner.color(this.#sourceColors[boundedIndex]!));
    }

    return colors;
  }

  #normalizeSteps(steps: number | undefined): number | undefined {
    if (steps === undefined) {
      return undefined;
    }

    if (!Number.isInteger(steps) || steps <= 0) {
      throw new Error(`Role sequence steps must be a positive integer, received ${steps}.`);
    }

    return steps;
  }
}
