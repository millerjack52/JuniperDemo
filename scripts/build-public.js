/**
 * Assembles ./public for Vercel (Output Directory: public).
 * Keeps repo root HTML/assets for local dev; production build copies them in.
 */
const { cpSync, mkdirSync, rmSync, existsSync } = require("fs");
const { execSync } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");
const pub = path.join(root, "public");

if (existsSync(pub)) {
  rmSync(pub, { recursive: true });
}
mkdirSync(path.join(pub, "dist"), { recursive: true });

execSync(
  "npx tailwindcss -i ./src/input.css -o ./public/dist/styles.css --minify",
  { stdio: "inherit", cwd: root, env: process.env }
);

for (const file of ["index.html", "room.html"]) {
  cpSync(path.join(root, file), path.join(pub, file));
}
for (const dir of ["images", "fonts", "js"]) {
  const src = path.join(root, dir);
  if (existsSync(src)) {
    cpSync(src, path.join(pub, dir), { recursive: true });
  }
}
