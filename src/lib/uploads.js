import { uploadImage } from "@/lib/storage";

export async function saveImages(files) {
  const paths = [];
  for (const file of files) {
    paths.push((await uploadImage(file, "products")).url);
  }
  return paths;
}
