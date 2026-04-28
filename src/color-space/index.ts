import type { GradientMode, OKLab, OKLCH, RGB } from "../types.js";

import { clamp } from "../utils/clamp.js";
import { clampChannel, intToRgb, normalizeRgb, rgbToInt } from "../utils/color.js";

type LinearRGB = {
  r: number;
  g: number;
  b: number;
};

type HSL = {
  h: number;
  s: number;
  l: number;
};

function srgbToLinear(channel: number): number {
  if (channel <= 0.04045) {
    return channel / 12.92;
  }

  return ((channel + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(channel: number): number {
  if (channel <= 0.0031308) {
    return channel * 12.92;
  }

  return 1.055 * channel ** (1 / 2.4) - 0.055;
}

function roundHue(hue: number): number {
  const normalized = ((hue % 360) + 360) % 360;
  return normalized === 360 ? 0 : normalized;
}

function hueDelta(from: number, to: number): number {
  const delta = ((to - from + 540) % 360) - 180;
  return delta === -180 ? 180 : delta;
}

export function rgbToLinearRgb(rgb: RGB): LinearRGB {
  const normalized = normalizeRgb(rgb);
  return {
    r: srgbToLinear(normalized.r / 255),
    g: srgbToLinear(normalized.g / 255),
    b: srgbToLinear(normalized.b / 255),
  };
}

export function linearRgbToRgb(rgb: LinearRGB): RGB {
  return {
    r: clampChannel(clamp(Math.round(linearToSrgb(rgb.r) * 255), 0, 255)),
    g: clampChannel(clamp(Math.round(linearToSrgb(rgb.g) * 255), 0, 255)),
    b: clampChannel(clamp(Math.round(linearToSrgb(rgb.b) * 255), 0, 255)),
  };
}

export function rgbToOklab(rgb: RGB): OKLab {
  const linear = rgbToLinearRgb(rgb);

  const l = 0.4122214708 * linear.r + 0.5363325363 * linear.g + 0.0514459929 * linear.b;
  const m = 0.2119034982 * linear.r + 0.6806995451 * linear.g + 0.1073969566 * linear.b;
  const s = 0.0883024619 * linear.r + 0.2817188376 * linear.g + 0.6299787005 * linear.b;

  const lRoot = Math.cbrt(l);
  const mRoot = Math.cbrt(m);
  const sRoot = Math.cbrt(s);

  return {
    l: 0.2104542553 * lRoot + 0.793617785 * mRoot - 0.0040720468 * sRoot,
    a: 1.9779984951 * lRoot - 2.428592205 * mRoot + 0.4505937099 * sRoot,
    b: 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.808675766 * sRoot,
  };
}

export function oklabToRgb(oklab: OKLab): RGB {
  const lRoot = oklab.l + 0.3963377774 * oklab.a + 0.2158037573 * oklab.b;
  const mRoot = oklab.l - 0.1055613458 * oklab.a - 0.0638541728 * oklab.b;
  const sRoot = oklab.l - 0.0894841775 * oklab.a - 1.291485548 * oklab.b;

  const l = lRoot ** 3;
  const m = mRoot ** 3;
  const s = sRoot ** 3;

  return linearRgbToRgb({
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  });
}

export function oklabToOklch(oklab: OKLab): OKLCH {
  const c = Math.sqrt(oklab.a * oklab.a + oklab.b * oklab.b);
  const h = roundHue((Math.atan2(oklab.b, oklab.a) * 180) / Math.PI);

  return {
    l: oklab.l,
    c,
    h,
  };
}

export function oklchToOklab(oklch: OKLCH): OKLab {
  const radians = (oklch.h * Math.PI) / 180;
  return {
    l: oklch.l,
    a: Math.cos(radians) * oklch.c,
    b: Math.sin(radians) * oklch.c,
  };
}

export function rgbToOklch(rgb: RGB): OKLCH {
  return oklabToOklch(rgbToOklab(rgb));
}

export function oklchToRgb(oklch: OKLCH): RGB {
  return oklabToRgb(oklchToOklab(oklch));
}

export function clipRgb(rgb: RGB): RGB {
  return {
    r: clampChannel(rgb.r),
    g: clampChannel(rgb.g),
    b: clampChannel(rgb.b),
  };
}

export function isRgbInGamut(rgb: RGB): boolean {
  return [rgb.r, rgb.g, rgb.b].every((channel) => channel >= 0 && channel <= 255);
}

export function fitToRgbGamut(oklch: OKLCH): OKLCH {
  const initialRgb = oklchToRgb(oklch);
  if (isRgbInGamut(initialRgb)) {
    return {
      l: clamp(oklch.l, 0, 1),
      c: Math.max(0, oklch.c),
      h: roundHue(oklch.h),
    };
  }

  let low = 0;
  let high = Math.max(0, oklch.c);
  let best = {
    l: clamp(oklch.l, 0, 1),
    c: 0,
    h: roundHue(oklch.h),
  };

  for (let index = 0; index < 24; index += 1) {
    const mid = (low + high) / 2;
    const candidate = {
      l: clamp(oklch.l, 0, 1),
      c: mid,
      h: roundHue(oklch.h),
    };
    const rgb = oklchToRgb(candidate);

    if (isRgbInGamut(rgb)) {
      best = candidate;
      low = mid;
    } else {
      high = mid;
    }
  }

  return best;
}

function relativeLuminance(rgb: RGB): number {
  const linear = rgbToLinearRgb(rgb);
  return 0.2126 * linear.r + 0.7152 * linear.g + 0.0722 * linear.b;
}

export function contrastRatio(foreground: RGB, background: RGB): number {
  const fg = relativeLuminance(foreground);
  const bg = relativeLuminance(background);
  const brightest = Math.max(fg, bg);
  const darkest = Math.min(fg, bg);
  return (brightest + 0.05) / (darkest + 0.05);
}

export function bestTextColor(background: RGB): "#000000" | "#FFFFFF" {
  const black = contrastRatio({ r: 0, g: 0, b: 0 }, background);
  const white = contrastRatio({ r: 255, g: 255, b: 255 }, background);
  return black >= white ? "#000000" : "#FFFFFF";
}

function rgbToHsl(rgb: RGB): HSL {
  const normalized = normalizeRgb(rgb);
  const r = normalized.r / 255;
  const g = normalized.g / 255;
  const b = normalized.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;

  if (delta !== 0) {
    if (max === r) {
      hue = ((g - b) / delta) % 6;
    } else if (max === g) {
      hue = (b - r) / delta + 2;
    } else {
      hue = (r - g) / delta + 4;
    }
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return {
    h: roundHue(hue * 60),
    s,
    l,
  };
}

function hslToRgb(hsl: HSL): RGB {
  const c = (1 - Math.abs(2 * hsl.l - 1)) * hsl.s;
  const x = c * (1 - Math.abs(((hsl.h / 60) % 2) - 1));
  const m = hsl.l - c / 2;
  let rgb: LinearRGB = { r: 0, g: 0, b: 0 };

  if (hsl.h < 60) {
    rgb = { r: c, g: x, b: 0 };
  } else if (hsl.h < 120) {
    rgb = { r: x, g: c, b: 0 };
  } else if (hsl.h < 180) {
    rgb = { r: 0, g: c, b: x };
  } else if (hsl.h < 240) {
    rgb = { r: 0, g: x, b: c };
  } else if (hsl.h < 300) {
    rgb = { r: x, g: 0, b: c };
  } else {
    rgb = { r: c, g: 0, b: x };
  }

  return clipRgb({
    r: (rgb.r + m) * 255,
    g: (rgb.g + m) * 255,
    b: (rgb.b + m) * 255,
  });
}

export function interpolateRgb(from: RGB, to: RGB, ratio: number): RGB {
  const t = clamp(ratio, 0, 1);
  return {
    r: clampChannel(from.r + (to.r - from.r) * t),
    g: clampChannel(from.g + (to.g - from.g) * t),
    b: clampChannel(from.b + (to.b - from.b) * t),
  };
}

export function interpolateColor(
  from: RGB,
  to: RGB,
  ratio: number,
  mode: GradientMode,
): RGB {
  const t = clamp(ratio, 0, 1);

  if (mode === "rgb") {
    return interpolateRgb(from, to, t);
  }

  if (mode === "oklab") {
    const left = rgbToOklab(from);
    const right = rgbToOklab(to);
    return oklabToRgb({
      l: left.l + (right.l - left.l) * t,
      a: left.a + (right.a - left.a) * t,
      b: left.b + (right.b - left.b) * t,
    });
  }

  if (mode === "oklch") {
    const left = rgbToOklch(from);
    const right = rgbToOklch(to);
    const hue = roundHue(left.h + hueDelta(left.h, right.h) * t);
    return oklchToRgb(
      fitToRgbGamut({
        l: left.l + (right.l - left.l) * t,
        c: left.c + (right.c - left.c) * t,
        h: hue,
      }),
    );
  }

  const left = rgbToHsl(from);
  const right = rgbToHsl(to);
  const hue = roundHue(left.h + hueDelta(left.h, right.h) * t);
  return hslToRgb({
    h: hue,
    s: left.s + (right.s - left.s) * t,
    l: left.l + (right.l - left.l) * t,
  });
}

export function rgbFromUnknown(input: number | RGB): RGB {
  return typeof input === "number" ? intToRgb(input) : normalizeRgb(input);
}

export function areEqualRgb(left: RGB, right: RGB): boolean {
  return rgbToInt(left) === rgbToInt(right);
}
