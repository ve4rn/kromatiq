import type { PaletteDefinition } from "../types.js";

export function flattenPalettes(
  palettes: ReadonlyMap<string, PaletteDefinition>,
): Map<string, { owner: string; value: PaletteDefinition[string] }> {
  const result = new Map<string, { owner: string; value: PaletteDefinition[string] }>();

  for (const [paletteName, palette] of palettes) {
    for (const [colorName, value] of Object.entries(palette)) {
      const existing = result.get(colorName);

      if (existing) {
        throw new Error(
          `Duplicate color name "${colorName}" found in "${existing.owner}" and "${paletteName}". Rename one of them to keep direct names safe.`,
        );
      }

      result.set(colorName, {
        owner: paletteName,
        value,
      });
    }
  }

  return result;
}
