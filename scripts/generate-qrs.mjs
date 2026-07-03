#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import QRCode from "qrcode";

const root = process.cwd();
const dataPath = path.join(root, "src", "data", "guide.json");
const publicDir = path.join(root, "public");
const guide = JSON.parse(await fs.readFile(dataPath, "utf8"));
const siteUrl = guide.meta?.siteUrl;

if (!siteUrl) {
  throw new Error("Missing meta.siteUrl in guide.json");
}

const notes = guide.cities.flatMap((city) => city.places.flatMap((place) => place.notes.map((note) => ({ ...note, place: place.name }))));
const seen = new Set();

for (const note of notes) {
  if (!note.url || !note.qr) {
    throw new Error(`Missing url or qr for note "${note.title}" at "${note.place}"`);
  }

  const outputPath = path.join(publicDir, note.qr.replace(/^\//, ""));
  if (seen.has(outputPath)) continue;
  seen.add(outputPath);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await QRCode.toFile(outputPath, new URL(note.url, siteUrl).toString(), {
    type: "svg",
    margin: 1,
    color: {
      dark: "#172426",
      light: "#ffffff"
    }
  });
}

console.log(`Generated ${seen.size} QR SVG files.`);
