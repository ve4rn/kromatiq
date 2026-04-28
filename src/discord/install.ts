import { Kromatiq } from "../Kromatiq.js";
import { KromatiqColor } from "../KromatiqColor.js";
import { kromatiq as defaultKromatiq } from "../defaults.js";
import type {
  ColorInput,
  DiscordRoleColors,
  DiscordRoleColorsInput,
} from "../types.js";
import { isRgb } from "../utils/color.js";

type EmbedBuilderLike = {
  setColor(color: unknown): unknown;
};

type RoleLike = {
  setColors(colors: unknown, reason?: string): unknown;
};

type ContainerBuilderLike = {
  setAccentColor(color: unknown): unknown;
};

type Constructor<T> = {
  prototype: T;
};

const EMBED_PATCH = Symbol.for("kromatiq.embed.patch");
const ROLE_PATCH = Symbol.for("kromatiq.role.patch");
const CONTAINER_PATCH = Symbol.for("kromatiq.container.patch");

export type InstallKromatiqDiscordOptions = {
  EmbedBuilder?: Constructor<EmbedBuilderLike>;
  Role?: Constructor<RoleLike>;
  ContainerBuilder?: Constructor<ContainerBuilderLike>;
  kromatiq?: Kromatiq;
};

type RoleColorInputLike =
  | ColorInput
  | readonly [ColorInput, ColorInput]
  | DiscordRoleColors
  | DiscordRoleColorsInput;

function isResolvableColor(input: unknown): input is ColorInput {
  return (
    typeof input === "string" ||
    typeof input === "number" ||
    input instanceof KromatiqColor ||
    isRgb(input)
  );
}

function isRoleColorsInput(input: unknown): input is DiscordRoleColorsInput {
  return typeof input === "object" && input !== null && "primaryColor" in input;
}

function isResolvedRoleColors(input: unknown): input is DiscordRoleColors {
  return typeof input === "object" && input !== null && "primaryColor" in input;
}

function normalizeRoleColors(kromatiq: Kromatiq, input: RoleColorInputLike): DiscordRoleColors {
  if (Array.isArray(input)) {
    if (input.length !== 2) {
      throw new Error("Role color tuples must contain exactly two colors.");
    }

    return kromatiq.roleColors(input[0], input[1]);
  }

  if (isResolvableColor(input)) {
    return kromatiq.roleColors(input);
  }

  if (isRoleColorsInput(input)) {
    const result: DiscordRoleColors = {
      primaryColor: kromatiq.int(input.primaryColor),
    };

    if (input.secondaryColor !== undefined) {
      result.secondaryColor = kromatiq.int(input.secondaryColor);
    }

    if (input.tertiaryColor !== undefined) {
      result.tertiaryColor = kromatiq.int(input.tertiaryColor);
    }

    return result;
  }

  if (isResolvedRoleColors(input)) {
    return input;
  }

  throw new Error("Unsupported Discord role colors input.");
}

export function installKromatiqEmbedColors(options: InstallKromatiqDiscordOptions): void {
  const EmbedBuilder = options.EmbedBuilder;
  const kromatiq = options.kromatiq ?? defaultKromatiq;

  if (!EmbedBuilder || (EmbedBuilder.prototype as Record<PropertyKey, unknown>)[EMBED_PATCH]) {
    return;
  }

  const original = EmbedBuilder.prototype.setColor;

  EmbedBuilder.prototype.setColor = function setColor(color: unknown) {
    if (isResolvableColor(color)) {
      return original.call(this, kromatiq.int(color));
    }

    return original.call(this, color);
  };

  (EmbedBuilder.prototype as Record<PropertyKey, unknown>)[EMBED_PATCH] = true;
}

export function installKromatiqRoleColors(options: InstallKromatiqDiscordOptions): void {
  const Role = options.Role;
  const kromatiq = options.kromatiq ?? defaultKromatiq;

  if (!Role || (Role.prototype as Record<PropertyKey, unknown>)[ROLE_PATCH]) {
    return;
  }

  const original = Role.prototype.setColors;

  Role.prototype.setColors = function setColors(colors: unknown, reason?: string) {
    return original.call(this, normalizeRoleColors(kromatiq, colors as RoleColorInputLike), reason);
  };

  (Role.prototype as Record<PropertyKey, unknown>)[ROLE_PATCH] = true;
}

export function installKromatiqContainerColors(options: InstallKromatiqDiscordOptions): void {
  const ContainerBuilder = options.ContainerBuilder;
  const kromatiq = options.kromatiq ?? defaultKromatiq;

  if (
    !ContainerBuilder ||
    (ContainerBuilder.prototype as Record<PropertyKey, unknown>)[CONTAINER_PATCH]
  ) {
    return;
  }

  const original = ContainerBuilder.prototype.setAccentColor;

  ContainerBuilder.prototype.setAccentColor = function setAccentColor(color: unknown) {
    if (isResolvableColor(color)) {
      return original.call(this, kromatiq.int(color));
    }

    return original.call(this, color);
  };

  (ContainerBuilder.prototype as Record<PropertyKey, unknown>)[CONTAINER_PATCH] = true;
}

export function installKromatiqDiscord(options: InstallKromatiqDiscordOptions): void {
  installKromatiqEmbedColors(options);
  installKromatiqRoleColors(options);
  installKromatiqContainerColors(options);
}

export function kromatiqEmbed<T extends EmbedBuilderLike>(
  embed: T,
  kromatiq = defaultKromatiq,
): T {
  const original = embed.setColor.bind(embed);
  embed.setColor = ((color: unknown) =>
    original(isResolvableColor(color) ? kromatiq.int(color) : color)) as T["setColor"];
  return embed;
}

export function kromatiqRole<T extends RoleLike>(role: T, kromatiq = defaultKromatiq): T {
  const original = role.setColors.bind(role);
  role.setColors = ((colors: unknown, reason?: string) =>
    original(normalizeRoleColors(kromatiq, colors as RoleColorInputLike), reason)) as T["setColors"];
  return role;
}

export function kromatiqContainer<T extends ContainerBuilderLike>(
  container: T,
  kromatiq = defaultKromatiq,
): T {
  const original = container.setAccentColor.bind(container);
  container.setAccentColor = ((color: unknown) =>
    original(isResolvableColor(color) ? kromatiq.int(color) : color)) as T["setAccentColor"];
  return container;
}
