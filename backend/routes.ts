import { Router, Request, Response } from "express";
import { db } from "./server";
import extensionRoutes from "./extensions";
const router = Router();

// Test route
router.get("/welcome", (req: Request, res: Response) => {
  res.json({ message: "Backend çalışıyor! 🎉" });
});
router.get("/db-test", async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS test"); // basit test sorgusu
    res.json({ success: true, result: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "DB connection failed" });
  }
});
router.use("/extensions", extensionRoutes);
export default router;
