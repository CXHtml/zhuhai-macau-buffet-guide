#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const MAX_BYTES = 150_000;
const imageDir = path.join(process.cwd(), "public", "assets", "images");
const allowedExtensions = new Set([".avif", ".jpg", ".jpeg", ".png", ".webp"]);
const failures = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return [fullPath];
  });
}

for (const filePath of walk(imageDir)) {
  if (!allowedExtensions.has(path.extname(filePath).toLowerCase())) continue;
  const size = fs.statSync(filePath).size;
  if (size > MAX_BYTES) {
    failures.push(`${path.relative(process.cwd(), filePath)} is ${size} bytes`);
  }
}

if (failures.length > 0) {
  console.error(`Images must be <= ${MAX_BYTES} bytes:`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`All page images are <= ${MAX_BYTES} bytes.`);
