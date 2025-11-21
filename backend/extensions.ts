import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "./server";

const router = express.Router();
const upload = multer({ dest: "uploads/" });
router.post(
  "/upload",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "imageCategory", maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    try {
      if (!req.files)
        return res.status(400).json({ error: "No files uploaded" });

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const savedPaths: Record<string, string> = {};

      for (const key of ["image1", "image2", "image3", "imageCategory"]) {
        const file = files[key]?.[0];
        if (!file) continue;

        const ext = path.extname(file.originalname);
        const newName = `${Date.now()}_${key}${ext}`;
        const targetDir = path.join(__dirname, "../public/images");
        if (!fs.existsSync(targetDir))
          fs.mkdirSync(targetDir, { recursive: true });
        const targetPath = path.join(targetDir, newName);
        fs.renameSync(file.path, targetPath);

        savedPaths[key] = `/images/${newName}`;
      }

      res.json({ message: "Uploaded all images", paths: savedPaths });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);
interface AddExtensionBody {
  name: string;
  category: string;
  features?: Record<string, any>;
  link?: string;
  images: {
    image1: string;
    image2: string;
    image3: string;
    imageCategory: string;
  };
}

router.post("/add", async (req: Request, res: Response) => {
  try {
    const { name, category, features, link, images } =
      req.body as AddExtensionBody;
    if (!name || !category || !images)
      return res.status(400).json({ error: "Missing required feilds" });
    const [result] = await db.query(
      `
            INSERT INTO extensions
             (name, category, features, link, image1,image2,image3,imageCategory)
             VALUES (?,?,?,?,?,?,?,?)`,
      [
        name,
        category,
        features ? JSON.stringify(features) : null,
        link || null,
        images.image1,
        images.image2,
        images.image3,
        images.imageCategory,
      ]
    );
    res.json({
      message: "Extension added successfully",
      id: (result as any).insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add extension" });
  }
});

export default router
