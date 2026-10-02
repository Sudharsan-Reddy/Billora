import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, "..");
const standaloneDir = path.join(rootDir, ".next", "standalone");

if (fs.existsSync(standaloneDir)) {
  const publicSrc = path.join(rootDir, "public");
  const publicDest = path.join(standaloneDir, "public");
  if (fs.existsSync(publicSrc)) {
    fs.cpSync(publicSrc, publicDest, { recursive: true, force: true });
    console.log("[standalone] Copied public/ to .next/standalone/public");
  }

  const staticSrc = path.join(rootDir, ".next", "static");
  const staticDest = path.join(standaloneDir, ".next", "static");
  if (fs.existsSync(staticSrc)) {
    fs.cpSync(staticSrc, staticDest, { recursive: true, force: true });
    console.log("[standalone] Copied .next/static/ to .next/standalone/.next/static");
  }

  console.log("✅ Standalone bundle is ready with full Tailwind CSS and static assets.");
}
