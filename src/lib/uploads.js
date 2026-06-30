import { mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

export async function saveImages(files) {
  const dir = path.join(process.cwd(), "public/images");
  await mkdir(dir, { recursive: true });

  const paths = [];
  for (const file of files) {
    const bytes = Buffer.from(await file.arrayBuffer());
    const base = path.parse(file.name).name;
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}-${base}.webp`;
    await sharp(bytes).webp({ quality: 80 }).toFile(path.join(dir, filename));
    paths.push(`/images/${filename}`); // ← เก็บอันนี้ลง DB
  }
  return paths;
}
