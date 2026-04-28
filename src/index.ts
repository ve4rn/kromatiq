import { kromatiq } from "./defaults.js";
import type {
  ColorInput,
  DiscordRoleColors,
  PaletteInput,
  RoleColorHelper,
  RoleSequenceInput,
  RoleSequenceOptions,
  TailwindInput,
} from "./types.js";

export { KromatiqColor } from "./KromatiqColor.js";
export { KromatiqGradient } from "./KromatiqGradient.js";
export { KromatiqPalette } from "./KromatiqPalette.js";
export { KromatiqRoleColorSequence } from "./KromatiqRoleColorSequence.js";
export { Kromatiq } from "./Kromatiq.js";
export { kromatiq } from "./defaults.js";
export type {
  ColorInput,
  DiscordRoleColors,
  DiscordRoleColorsInput,
  GradientMode,
  KromatiqOptions,
  KnownDiscordColorName,
  LiteralUnion,
  OKLab,
  OKLCH,
  PaletteInput,
  PaletteName,
  PaletteDefinition,
  RGB,
  RoleColorHelper,
  RoleColorSequenceInput,
  RoleColorSequenceOptions,
  RoleColorSequenceResult,
  RoleSequenceInput,
  RoleSequenceOptions,
  RoleSequenceResult,
  TailwindInput,
} from "./types.js";

export const color = kromatiq.color.bind(kromatiq);
export const tailwind = (input: TailwindInput) => kromatiq.tailwind(input);
export const hex = kromatiq.hex.bind(kromatiq);
export const int = kromatiq.int.bind(kromatiq);
export const gradient = kromatiq.gradient.bind(kromatiq);
export const palette = (name: PaletteInput) => kromatiq.palette(name);
export const roleSequence = (
  input: RoleSequenceInput,
  options?: RoleSequenceOptions,
) => kromatiq.roleSequence(input, options);

const roleColorBound = ((from: ColorInput, to?: ColorInput): DiscordRoleColors =>
  to === undefined ? kromatiq.roleColors(from) : kromatiq.roleColors(from, to)) as RoleColorHelper;

roleColorBound.holographic = () => kromatiq.holographicRoleColors();

export const roleColor = roleColorBound;
