// Build-time certificate manifest generator (Node, fs only — no deps).
// Reads /public/Certs and writes the manifest so the UI is driven by what's
// ACTUALLY on disk — no hand-typed paths, so no file can be missed.
//
// URL is ROOT-ABSOLUTE "/Certs/<encoded>" because the files live in
// public/Certs/ and Vite serves public/ at the site root. The filename part is
// URL-encoded so "+", "," and "." in names resolve correctly.
//
// Writes two identical files:
//   - src/data/certImages.generated.json  (the name requested by the task)
//   - src/data/certImages.json            (the name the UI already imports)
// Runs automatically via the "predev" / "prebuild" npm scripts.
import { readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CERTS_DIR_NAME = "Certs"; // exact on-disk casing (case-sensitive on Linux/Vercel)
const CERTS_DISK = join(ROOT, "public", CERTS_DIR_NAME);
const OUT_GENERATED = join(ROOT, "src", "data", "certImages.generated.json");
const OUT_LEGACY = join(ROOT, "src", "data", "certImages.json");

const IMG_RE = /\.(jpe?g|png|webp)$/i;

const run = () => {
    if (!existsSync(CERTS_DISK)) {
        console.warn(`[cert-manifest] folder not found: ${CERTS_DISK} — writing empty manifest.`);
        const empty = { dir: CERTS_DIR_NAME, count: 0, files: [] };
        mkdirSync(dirname(OUT_LEGACY), { recursive: true });
        writeFileSync(OUT_GENERATED, JSON.stringify([], null, 2) + "\n");
        writeFileSync(OUT_LEGACY, JSON.stringify(empty, null, 2) + "\n");
        return;
    }

    const files = readdirSync(CERTS_DISK)
        .filter((name) => IMG_RE.test(name))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const entries = files.map((file) => {
        const stem = file.replace(IMG_RE, "");
        // Root-absolute, correct "/Certs/" casing.
        // Use encodeURI (NOT encodeURIComponent): in a URL PATH, "+" and ","
        // are legal literal characters and both the browser and static hosts
        // (Vite dev + Vercel) resolve them correctly. encodeURIComponent would
        // turn "+"→"%2B" and ","→"%2C", which Vite's dev static server fails to
        // match (it serves the SPA index.html fallback instead). encodeURI still
        // encodes spaces and other unsafe chars if any ever appear.
        const url = `/${CERTS_DIR_NAME}/${encodeURI(file)}`;
        return { file, stem, url };
    });

    mkdirSync(dirname(OUT_LEGACY), { recursive: true });
    // Task-requested shape: a flat array.
    writeFileSync(OUT_GENERATED, JSON.stringify(entries, null, 2) + "\n");
    // Legacy shape the UI imports: { dir, count, files }.
    writeFileSync(OUT_LEGACY, JSON.stringify({ dir: CERTS_DIR_NAME, count: entries.length, files: entries }, null, 2) + "\n");
    console.log(`[cert-manifest] wrote ${entries.length} entries -> /${CERTS_DIR_NAME}/*`);
};

run();
