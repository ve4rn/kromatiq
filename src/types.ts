import type { KromatiqColor } from "./KromatiqColor.js";
import type { KromatiqPalette } from "./KromatiqPalette.js";
import type { KromatiqRoleColorSequence } from "./KromatiqRoleColorSequence.js";
import type { DiscordColorName } from "./data/discord.js";
import type {
  DefaultFlatColorName,
  DefaultPaletteColorName,
  DefaultPaletteName,
} from "./data/palettes.js";
import type { TailwindColorToken } from "./data/tailwind.js";

export type RGB = {
  r: number;
  g: number;
  b: number;
};

export type OKLab = {
  l: number;
  a: number;
  b: number;
};

export type OKLCH = {
  l: number;
  c: number;
  h: number;
};

export type GradientMode = "rgb" | "hsl" | "oklab" | "oklch";

export type EmbedColor = number;
export type ContainerAccentColor = number;

export type LiteralUnion<T extends string> = T | (string & Record<never, never>);
export type KnownDiscordColorName =
  | DiscordColorName
  | DefaultPaletteColorName
  | DefaultFlatColorName;
export type PaletteName = DefaultPaletteName;
export type TailwindInput = LiteralUnion<TailwindColorToken>;

export type DiscordRoleColors = {
  primaryColor: number;
  secondaryColor?: number;
  tertiaryColor?: number;
};

export type DiscordRoleColorsInput = {
  primaryColor: ColorInput;
  secondaryColor?: ColorInput;
  tertiaryColor?: ColorInput;
};

export type ColorInput =
  | LiteralUnion<KnownDiscordColorName>
  | number
  | RGB
  | KromatiqColor;

export type PaletteInput = LiteralUnion<PaletteName>;

export type PaletteDefinition = Record<string, ColorInput>;

export type KromatiqOptions = {
  colors?: Record<string, ColorInput>;
  palettes?: Record<string, PaletteDefinition>;
  tailwindColors?: Record<string, ColorInput>;
};

export type RoleColorHelper = {
  (input: ColorInput): DiscordRoleColors;
  (from: ColorInput, to: ColorInput): DiscordRoleColors;
  holographic(): DiscordRoleColors;
};
export type RoleColorsHelper = RoleColorHelper;

export type RoleColorSequenceInput =
  | KromatiqPalette
  | PaletteInput
  | readonly ColorInput[];

export type RoleColorSequenceOptions = {
  gradient?: boolean;
  steps?: number;
  wrap?: boolean;
};

export type RoleSequenceInput = RoleColorSequenceInput;
export type RoleSequenceOptions = RoleColorSequenceOptions;

export type RoleColorSequenceResult = KromatiqRoleColorSequence;
export type RoleSequenceResult = KromatiqRoleColorSequence;
