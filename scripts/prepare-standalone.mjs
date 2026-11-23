// `output: "standalone"` leaves static files out; copy them so .next/standalone is the whole deployable.
import { cpSync, existsSync, rmSync } from "node:fs";

const target = ".next/standalone";
if (!existsSync(`${target}/server.js`)) {
  console.error("No standalone server found. Run `next build` first.");
  process.exit(1);
}
for (const [from, to] of [["public", `${target}/public`], [".next/static", `${target}/.next/static`]]) {
  rmSync(to, { recursive: true, force: true });
  cpSync(from, to, { recursive: true });
}
console.log(`Standalone server is ready in ${target}`);
