import { KromatiqColor } from "./KromatiqColor.js";
import { KromatiqGradient } from "./KromatiqGradient.js";
import { KromatiqPalette } from "./KromatiqPalette.js";
import { KromatiqRoleColorSequence } from "./KromatiqRoleColorSequence.js";
import {
  DISCORD_COLORS,
  DISCORD_HOLOGRAPHIC_ROLE_COLORS,
} from "./data/discord.js";
import { DEFAULT_COLORS, DEFAULT_PALETTES } from "./data/palettes.js";
import { DEFAULT_TAILWIND_COLORS } from "./data/tailwind.js";
import { flattenPalettes } from "./resolve/flattenPalettes.js";
import type {
  ColorInput,
  DiscordRoleColors,
  KromatiqOptions,
  PaletteDefinition,
  PaletteInput,
  RoleSequenceInput,
  RoleSequenceOptions,
  TailwindInput,
  RGB,
} from "./types.js";
import {
  intToRgb,
  isRgb,
  normalizeRgb,
  parseHexColor,
  rgbToHex,
  rgbToInt,
  validateColorInt,
} from "./utils/color.js";
import { suggestClosest } from "./utils/suggest.js";

export class Kromatiq {
  readonly #customColors = new Map<string, ColorInput>();
  readonly #discordColors = new Map<string, number>(Object.entries(DISCORD_COLORS));
  readonly #tailwindColors = new Map<string, ColorInput>();
  readonly #palettes = new Map<string, PaletteDefinition>();
  #flattenedPaletteColors = new Map<string, { owner: string; value: ColorInput }>();

  constructor(options: KromatiqOptions = {}) {
    this.registerColors(DEFAULT_COLORS);
    this.registerPalettes(DEFAULT_PALETTES);
    this.registerTailwindColors(DEFAULT_TAILWIND_COLORS);
    this.configure(options);
  }

  configure(options: KromatiqOptions): this {
    if (options.colors) {
      this.registerColors(options.colors);
    }

    if (options.tailwindColors) {
      this.registerTailwindColors(options.tailwindColors);
    }

    if (options.palettes) {
      this.registerPalettes(options.palettes);
    }

    return this;
  }

  registerColor(name: string, value: ColorInput): this {
    this.#setColor(this.#customColors, name, value, "custom colors");
    return this;
  }

  registerColors(colors: Record<string, ColorInput>): this {
    for (const [name, value] of Object.entries(colors)) {
      this.registerColor(name, value);
    }

    return this;
  }

  registerTailwindColors(colors: Record<string, ColorInput>): this {
    for (const [name, value] of Object.entries(colors)) {
      this.#setColor(this.#tailwindColors, name, value, "tailwind colors");
    }

    return this;
  }

  registerPalette(name: string, palette: PaletteDefinition): this {
    const normalizedName = this.#normalizeName(name, "palette");

    if (this.#palettes.has(normalizedName)) {
      throw new Error(`Palette "${normalizedName}" is already registered.`);
    }

    const entries = Object.entries(palette);
    if (entries.length === 0) {
      throw new Error(`Palette "${normalizedName}" must contain at least one color.`);
    }

    const normalizedPalette: PaletteDefinition = {};
    for (const [colorName, value] of entries) {
      const normalizedColorName = this.#normalizeName(colorName, `palette color in "${normalizedName}"`);
      if (value === undefined) {
        throw new Error(
          `Palette "${normalizedName}" contains "${normalizedColorName}" without a color value.`,
        );
      }

      normalizedPalette[normalizedColorName] = value;
    }

    this.#palettes.set(normalizedName, normalizedPalette);
    this.#refreshFlattenedPaletteColors();
    return this;
  }

  registerPalettes(palettes: Record<string, PaletteDefinition>): this {
    for (const [name, palette] of Object.entries(palettes)) {
      this.registerPalette(name, palette);
    }

    return this;
  }

  resolve(input: ColorInput): number {
    if (input instanceof KromatiqColor) {
      return input.int;
    }

    if (typeof input === "number") {
      validateColorInt(input);
      return input;
    }

    if (isRgb(input)) {
      return rgbToInt(normalizeRgb(input));
    }

    return this.#resolveString(input, new Set<string>());
  }

  color(input: ColorInput): KromatiqColor {
    return new KromatiqColor(this, this.rgb(input));
  }

  tailwind(input: TailwindInput): KromatiqColor {
    return this.color(input as unknown as ColorInput);
  }

  hex(input: ColorInput): string {
    return rgbToHex(this.rgb(input));
  }

  int(input: ColorInput): number {
    return this.resolve(input);
  }

  rgb(input: ColorInput): RGB {
    return intToRgb(this.resolve(input));
  }

  roleColors(input: ColorInput): DiscordRoleColors;
  roleColors(from: ColorInput, to: ColorInput): DiscordRoleColors;
  roleColors(from: ColorInput, to?: ColorInput): DiscordRoleColors {
    if (to === undefined) {
      return {
        primaryColor: this.int(from),
      };
    }

    return {
      primaryColor: this.int(from),
      secondaryColor: this.int(to),
    };
  }

  holographicRoleColors(): DiscordRoleColors {
    return { ...DISCORD_HOLOGRAPHIC_ROLE_COLORS };
  }

  gradient(...colors: readonly ColorInput[]): KromatiqGradient {
    if (colors.length < 2) {
      throw new Error(
        `A gradient needs at least two colors, received ${colors.length}.`,
      );
    }

    return new KromatiqGradient(this, colors);
  }

  palette(name: PaletteInput): KromatiqPalette {
    const normalizedName = this.#normalizeName(name, "palette");
    const palette = this.#palettes.get(normalizedName);
    if (!palette) {
      const suggestion = suggestClosest(normalizedName, [...this.#palettes.keys()]);
      const message = suggestion
        ? `Unknown palette "${normalizedName}". Did you mean "${suggestion}"?`
        : `Unknown palette "${normalizedName}".`;
      throw new Error(message);
    }

    return new KromatiqPalette(this, normalizedName, palette);
  }

  roleSequence(
    input: RoleSequenceInput,
    options: RoleSequenceOptions = {},
  ): KromatiqRoleColorSequence {
    return new KromatiqRoleColorSequence(this, input, options);
  }

  #setColor(target: Map<string, ColorInput>, name: string, value: ColorInput, label: string) {
    const normalizedName = this.#normalizeName(name, "color");
    const includeTailwindConflicts = target === this.#tailwindColors;

    if (
      target.has(normalizedName) ||
      this.#discordColors.has(normalizedName) ||
      this.#flattenedPaletteColors.has(normalizedName) ||
      (includeTailwindConflicts && this.#tailwindColors.has(normalizedName))
    ) {
      throw new Error(`Color "${normalizedName}" is already registered in ${label}.`);
    }

    target.set(normalizedName, value);
  }

  #refreshFlattenedPaletteColors() {
    this.#flattenedPaletteColors = flattenPalettes(this.#palettes);

    for (const name of this.#flattenedPaletteColors.keys()) {
      if (this.#customColors.has(name) || this.#discordColors.has(name)) {
        throw new Error(
          `Palette color "${name}" collides with an existing registered color. Rename it to keep direct resolution safe.`,
        );
      }
    }
  }

  #resolveString(input: string, stack: Set<string>): number {
    const normalizedInput = this.#normalizeName(input, "color");

    if (stack.has(normalizedInput)) {
      const chain = [...stack, normalizedInput].join(" -> ");
      throw new Error(`Circular color reference detected: ${chain}.`);
    }

    if (this.#customColors.has(normalizedInput)) {
      stack.add(normalizedInput);
      const value = this.#customColors.get(normalizedInput);
      if (value === undefined) {
        throw new Error(`Color "${normalizedInput}" disappeared during resolution.`);
      }

      return this.resolve(value);
    }

    if (this.#flattenedPaletteColors.has(normalizedInput)) {
      stack.add(normalizedInput);
      const entry = this.#flattenedPaletteColors.get(normalizedInput);
      if (!entry) {
        throw new Error(`Palette color "${normalizedInput}" disappeared during resolution.`);
      }

      return this.resolve(entry.value);
    }

    const discord = this.#discordColors.get(normalizedInput);
    if (discord !== undefined) {
      return discord;
    }

    if (this.#tailwindColors.has(normalizedInput)) {
      stack.add(normalizedInput);
      const value = this.#tailwindColors.get(normalizedInput);
      if (value === undefined) {
        throw new Error(`Tailwind color "${normalizedInput}" disappeared during resolution.`);
      }

      return this.resolve(value);
    }

    if (normalizedInput.startsWith("#")) {
      return parseHexColor(normalizedInput);
    }

    const suggestion = suggestClosest(normalizedInput, this.#availableNames());
    const message = suggestion
      ? `Unknown color "${normalizedInput}". Did you mean "${suggestion}"?`
      : `Unknown color "${normalizedInput}".`;
    throw new Error(message);
  }

  #availableNames(): readonly string[] {
    return [
      ...this.#customColors.keys(),
      ...this.#discordColors.keys(),
      ...this.#tailwindColors.keys(),
      ...this.#flattenedPaletteColors.keys(),
    ];
  }

  #normalizeName(value: string, label: string): string {
    const normalized = value.trim();
    if (!normalized) {
      throw new Error(`Invalid ${label} name: received an empty string.`);
    }

    return normalized;
  }
}
