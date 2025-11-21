import express, { Request, Response } from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import router from "./routes";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// DB Pool
export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

app.use("/api", router);
app.use("/images", express.static("public/images"));
export default function startServer(): Promise<void> {
  return new Promise((resolve) => {
    app.listen(3001, () => {
      console.log("Backend running on port 3001");
      resolve();
    });
  });
}
