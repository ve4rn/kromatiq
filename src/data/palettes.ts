const RAW_DEFAULT_PALETTES = {
  sunset: {
    midnightInk: 0x03071e,
    nightBordeaux: 0x370617,
    blackCherry: 0x6a040f,
    oxblood: 0x9d0208,
    crimsonRed: 0xd00000,
    vermilion: 0xdc2f02,
    burntOrange: 0xe85d04,
    deepOrange: 0xf48c06,
    goldenOrange: 0xfaa307,
    amberGold: 0xffba08,
  },
  ocean: {
    deepNavy: 0x03045e,
    royalBlue: 0x023e8a,
    oceanBlue: 0x0077b6,
    azureBlue: 0x0096c7,
    lagoonBlue: 0x00b4d8,
    cyanSky: 0x48cae4,
    iceBlue: 0x90e0ef,
    paleSky: 0xade8f4,
    frostCyan: 0xcaf0f8,
  },
  sea: {
    trenchNavy: 0x0d1b2a,
    midnightBlue: 0x1b263b,
    stormBlue: 0x415a77,
    mistBlue: 0x778da9,
    pearlMist: 0xe0e1dd,
  },
  garden: {
    pineTeal: 0x344e41,
    hunterGreen: 0x3a5a40,
    fernGreen: 0x588157,
    sageGreen: 0xa3b18a,
    stoneMist: 0xdad7cd,
  },
  nightFall: {
    voidViolet: 0x10002b,
    deepAmethyst: 0x240046,
    indigoInk: 0x3c096c,
    velvetIndigo: 0x5a189a,
    royalViolet: 0x7b2cbf,
    lavender: 0x9d4edd,
    electricLavender: 0xc77dff,
    softMauve: 0xe0aaff,
  },
  fiesta: {
    solarGold: 0xffbe0b,
    blazeOrange: 0xfb5607,
    neonMagenta: 0xff006e,
    vividViolet: 0x8338ec,
    vividBlue: 0x3a86ff,
  },
  mellow: {
    petalFrost: 0xffd6ef,
    airyMauve: 0xe7c6ff,
    dreamyLilac: 0xc8b6ff,
    periwinkleMist: 0xb8c0ff,
    skyLull: 0xbbd0ff,
  },
  sun: {
    ember: 0xff7b00,
    blaze: 0xff8800,
    flame: 0xff9500,
    amber: 0xffa200,
    tangerine: 0xffaa00,
    marigold: 0xffb700,
    saffron: 0xffc300,
    honey: 0xffd000,
    gold: 0xffdd00,
    lemon: 0xffea00,
  },
  crimson: {
    bloodRoot: 0x641220,
    darkRed: 0x6e1423,
    deepRed: 0x85182a,
    richRed: 0xa11d33,
    trueRed: 0xa71e34,
    warmRed: 0xb21e35,
    vividRed: 0xbd1f36,
    brightRed: 0xc71f37,
    neonRed: 0xda1e37,
    flareRed: 0xe01e37,
  },
  cherry: {
    darkCherry: 0x590d22,
    bloodCherry: 0x800f2f,
    deepCherry: 0xa4133c,
    wildCherry: 0xc9184a,
    cherryBlaze: 0xff4d6d,
    cherryBloom: 0xff758f,
    cherryBlush: 0xff8fa3,
    softCherry: 0xffb3c1,
    cherryCream: 0xffccd5,
    cherryMist: 0xfff0f3,
  },
  green: {
    pineRoot: 0x004b23,
    deepForest: 0x006400,
    wildForest: 0x007200,
    trueGreen: 0x008000,
    freshLeaf: 0x38b000,
    springLeaf: 0x70e000,
    limeBloom: 0x9ef01a,
    neonLime: 0xccff33,
  },
  blue: {
    darkAbyss: 0x012a4a,
    deepOcean: 0x013a63,
    wildOcean: 0x01497c,
    trueBlue: 0x014f86,
    blueWave: 0x2a6f97,
    blueCurrent: 0x2c7da0,
    blueFlow: 0x468faf,
    blueMist: 0x61a5c2,
    blueFoam: 0x89c2d9,
    blueSky: 0xa9d6e5,
  },
  serenity: {
    frost: 0xedf2fb,
    paleMist: 0xe2eafc,
    airyBlue: 0xd7e3fc,
    skyWhisper: 0xccdbfd,
    lightSky: 0xc1d3fe,
    softCloud: 0xb6ccfe,
    blueHaze: 0xabc4ff,
  },
  eclipse: {
    moltenCore: 0xff6d00,
    moltenRise: 0xff7900,
    moltenGlow: 0xff8500,
    solarFlare: 0xff9100,
    sunburst: 0xff9e00,
    eclipseVoid: 0x240046,
    shadowGrape: 0x3c096c,
    arcanePulse: 0x5a189a,
    violetSurge: 0x7b2cbf,
    plasmaViolet: 0x9d4edd,
  },
  floral: {
    coralBloom: 0xf92a82,
    coralPetal: 0xed7b84,
    softPeach: 0xf5dbcb,
    fadedSand: 0xd6d5b3,
    mossLight: 0x7eb77f,
  },
  vibrant: {
    blueCore: 0x006ba6,
    blueSurge: 0x0496ff,
    solarBurst: 0xffbc42,
    magentaStrike: 0xd81159,
    violetDrive: 0x8f2d56,
  },
  sand: {
    paleStone: 0xedede9,
    softClay: 0xd6ccc2,
    warmSand: 0xf5ebe0,
    duneMist: 0xe3d5ca,
    desertSand: 0xd5bdaf,
  },
  dream: {
    duskRose: 0xe8a598,
    softCoral: 0xffb5a7,
    peachGlow: 0xfec5bb,
    blushVeil: 0xfcd5ce,
    silkRose: 0xfae1dd,
    palePetal: 0xf8edeb,
    warmHaze: 0xf9e5d8,
    goldenBlush: 0xf9dcc4,
    softApricot: 0xfcd2af,
    sunsetCream: 0xfec89a,
  },
  magic: {
    spellViolet: 0x826aed,
    arcLight: 0xc879ff,
    fairyPink: 0xffb7ff,
    aquaSpark: 0x3bf4fb,
    limeSpell: 0xcaff8a,
  },
  earth: {
    paleClay: 0xedc4b3,
    softTerracotta: 0xe6b8a2,
    warmDust: 0xdeab90,
    sunClay: 0xd69f7e,
    desertStone: 0xcd9777,
    canyonClay: 0xc38e70,
    dryEarth: 0xb07d62,
    ruggedSoil: 0x9d6b53,
    deepSoil: 0x8a5a44,
    burntEarth: 0x774936,
  },
} as const;

type RawDefaultPaletteMap = typeof RAW_DEFAULT_PALETTES;

type IsPaletteEntry<T> = T extends Record<string, number> ? true : false;

type ExtractFlatColorNames<T extends Record<string, unknown>> = {
  [Key in keyof T]: IsPaletteEntry<T[Key]> extends true ? never : Key;
}[keyof T] &
  string;

type ExtractPaletteNames<T extends Record<string, unknown>> = {
  [Key in keyof T]: IsPaletteEntry<T[Key]> extends true ? Key : never;
}[keyof T] &
  string;

function isPaletteDefinition(value: unknown): value is Record<string, number> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every((entry) => typeof entry === "number")
  );
}

const groupedPaletteEntries = Object.entries(RAW_DEFAULT_PALETTES).filter(
  ([, value]) => isPaletteDefinition(value),
);

const flatColorEntries = Object.entries(RAW_DEFAULT_PALETTES).filter(
  ([, value]) => typeof value === "number",
);

export const DEFAULT_PALETTES = Object.freeze(
  Object.fromEntries(groupedPaletteEntries),
) as {
  readonly [Key in ExtractPaletteNames<RawDefaultPaletteMap>]: Extract<
    RawDefaultPaletteMap[Key],
    Record<string, number>
  >;
};

export const DEFAULT_COLORS = Object.freeze(
  Object.fromEntries(flatColorEntries),
) as {
  readonly [Key in ExtractFlatColorNames<RawDefaultPaletteMap>]: Extract<
    RawDefaultPaletteMap[Key],
    number
  >;
};

type DefaultPalettesMap = typeof DEFAULT_PALETTES;

export type DefaultPaletteName = keyof DefaultPalettesMap;
export type DefaultPaletteColorName = {
  [Palette in keyof DefaultPalettesMap]: keyof DefaultPalettesMap[Palette];
}[keyof DefaultPalettesMap] &
  string;
export type DefaultFlatColorName = keyof typeof DEFAULT_COLORS & string;
