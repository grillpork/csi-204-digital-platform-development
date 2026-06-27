import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('designImage');
    const shirtSize = formData.get('shirtSize');
    const screenSize = formData.get('screenSize');
    const color = formData.get('color');

    if (!file) {
      return NextResponse.json({ error: 'No image file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'custom');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Configure storage name (same as original multer format)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    
    // Safely get extension (multer used path.extname(file.originalname))
    const ext = path.extname(file.name || 'image.png');
    const filename = `custom-${uniqueSuffix}${ext}`;
    const filePath = path.join(uploadDir, filename);

    // Write file to public/uploads/custom
    await fs.promises.writeFile(filePath, buffer);

    const imageUrl = `/uploads/custom/${filename}`;

    return NextResponse.json({
      message: 'Upload successful',
      imageUrl: imageUrl,
      details: { shirtSize, screenSize, color }
    }, { status: 200 });

  } catch (err) {
    console.error("Next.js App Router Upload error:", err);
    return NextResponse.json({ error: 'Upload failed', details: err.message }, { status: 500 });
  }
}
