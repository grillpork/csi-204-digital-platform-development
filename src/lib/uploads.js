import { writeFile } from "fs/promises";
import path from "path";

export async function saveImages(files) {
  const paths = [];
  for (const file of files) {
    const bytes = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
    await writeFile(path.join(process.cwd(), "public/images", filename), bytes);
    paths.push(`/images/${filename}`); // ← เก็บอันนี้ลง DB
  }
  return paths;
}
