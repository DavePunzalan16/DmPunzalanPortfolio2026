// Build-time certificate manifest generator (Node, fs only — no deps).
// Reads /public/Certs and writes src/data/certImages.json so the UI is driven
// by what's ACTUALLY on disk — no file can ever be silently missed.
//
// Runs automatically via the "predev" / "prebuild" npm scripts.
import { readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CERTS_DIR_NAME = "Certs"; // exact on-disk casing (case-sensitive on Linux/Vercel)
const CERTS_DISK = join(ROOT, "public", CERTS_DIR_NAME);
const OUT = join(ROOT, "src", "data", "certImages.json");

const IMG_RE = /\.(jpe?g|png|webp)$/i;

const run = () => {
    if (!existsSync(CERTS_DISK)) {
        console.warn(`[cert-manifest] folder not found: ${CERTS_DISK} — writing empty manifest.`);
        writeFileSync(OUT, JSON.stringify({ dir: CERTS_DIR_NAME, files: [] }, null, 2));
        return;
    }

    const files = readdirSync(CERTS_DISK)
        .filter((name) => IMG_RE.test(name))
        .sort((a, b) => a.localeCompare(b));

    const entries = files.map((file) => {
        const stem = file.replace(IMG_RE, "");
        // URL-encode the filename part only; keep the correct "/Certs/" casing.
        const url = `assets/${CERTS_DIR_NAME}/${encodeURIComponent(file)}`;
        return { file, stem, url };
    });

    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, JSON.stringify({ dir: CERTS_DIR_NAME, count: entries.length, files: entries }, null, 2) + "\n");
    console.log(`[cert-manifest] wrote ${entries.length} entries -> ${OUT}`);
};

run();
