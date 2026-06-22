import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Tell Next.js to not parse the body, as multer will handle it
export const config = {
  api: {
    bodyParser: false,
  },
};

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'custom');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'custom-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return new Promise((resolve, reject) => {
    upload.single('designImage')(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err);
        res.status(500).json({ error: 'Upload failed', details: err.message });
        return reject(err);
      }
      
      if (!req.file) {
        res.status(400).json({ error: 'No image file uploaded' });
        return resolve();
      }

      // Extract text fields
      const { shirtSize, screenSize, color } = req.body;

      // Public URL to access the uploaded file
      const imageUrl = `/uploads/custom/${req.file.filename}`;

      res.status(200).json({
        message: 'Upload successful',
        imageUrl: imageUrl,
        details: { shirtSize, screenSize, color }
      });
      resolve();
    });
  });
}
