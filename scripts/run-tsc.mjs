import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const candidates = [
  join(process.cwd(), "node_modules", "typescript", "lib", "tsc.js"),
  join(process.env.APPDATA ?? "", "npm", "node_modules", "typescript", "lib", "tsc.js"),
  join(process.env.APPDATA ?? "", "npm", "node_modules", "vercel", "node_modules", "typescript", "lib", "tsc.js"),
  join(process.env.APPDATA ?? "", "npm", "node_modules", "@vue", "cli", "node_modules", "typescript", "lib", "tsc.js"),
];

const tscPath = candidates.find((candidate) => candidate && existsSync(candidate));

if (!tscPath) {
  console.error("Unable to find a TypeScript compiler. Install `typescript` locally or globally.");
  process.exit(1);
}

const result = spawnSync(process.execPath, [tscPath, ...process.argv.slice(2)], {
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 0);
