import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectDirectory = path.dirname(fileURLToPath(import.meta.url));
const outputDirectory = path.join(projectDirectory, "dist");

await rm(outputDirectory, { force: true, recursive: true });
await mkdir(outputDirectory, { recursive: true });

for (const file of ["index.html", "styles.css", "script.js"]) {
  await cp(path.join(projectDirectory, file), path.join(outputDirectory, file));
}

const publicPhotos = [
  "bench-720.webp",
  "bench-1440.webp",
  "calibration-540.webp",
  "calibration-1080.webp",
  "impact-rig-540.webp",
  "impact-rig-1080.webp",
  "profile-share.jpg",
  "portrait-540.webp",
  "portrait-1080.webp",
  "specimens-540.webp",
  "specimens-1080.webp",
];

await mkdir(path.join(outputDirectory, "photos"), { recursive: true });
for (const photo of publicPhotos) {
  await cp(path.join(projectDirectory, "photos", photo), path.join(outputDirectory, "photos", photo));
}

console.log("Built the static website in dist/.");
