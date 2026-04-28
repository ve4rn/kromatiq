import type { RGB } from "../types.js";

import { clamp } from "./clamp.js";

export function clampChannel(value: number): number {
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid RGB channel: ${value}`);
  }

  return clamp(Math.round(value), 0, 255);
}

export function isRgb(input: unknown): input is RGB {
  if (typeof input !== "object" || input === null) {
    return false;
  }

  const value = input as Partial<RGB>;
  return (
    typeof value.r === "number" &&
    typeof value.g === "number" &&
    typeof value.b === "number"
  );
}

export function normalizeRgb(input: RGB): RGB {
  return {
    r: clampChannel(input.r),
    g: clampChannel(input.g),
    b: clampChannel(input.b),
  };
}

export function rgbToInt(input: RGB): number {
  const rgb = normalizeRgb(input);
  return (rgb.r << 16) + (rgb.g << 8) + rgb.b;
}

export function intToRgb(input: number): RGB {
  validateColorInt(input);

  return {
    r: (input >> 16) & 0xff,
    g: (input >> 8) & 0xff,
    b: input & 0xff,
  };
}

export function validateColorInt(input: number): void {
  if (!Number.isInteger(input) || input < 0 || input > 0xffffff) {
    throw new Error(`Invalid color int: ${input}`);
  }
}

export function rgbToHex(input: RGB): string {
  return `#${rgbToInt(input).toString(16).padStart(6, "0").toUpperCase()}`;
}

export function parseHexColor(input: string): number {
  const value = input.trim().replace(/^#/, "");

  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(value)) {
    throw new Error(`Invalid hex color: ${input}`);
  }

  const hex =
    value.length === 3
      ? value
          .split("")
          .map((char) => char + char)
          .join("")
      : value;

  return Number.parseInt(hex, 16);
}
