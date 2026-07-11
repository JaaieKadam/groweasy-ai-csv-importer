import { Router } from "express";
import multer from "multer";

import { importCsv } from "../controllers/import.controller.js";

const router = Router();

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },

  fileFilter: (_req, file, callback) => {
    const hasCsvExtension = file.originalname
      .toLowerCase()
      .endsWith(".csv");

    const allowedMimeTypes = [
      "text/csv",
      "application/csv",
      "application/vnd.ms-excel",
      "text/plain",
    ];

    const hasAllowedMimeType =
      allowedMimeTypes.includes(file.mimetype) ||
      file.mimetype === "application/octet-stream";

    if (!hasCsvExtension || !hasAllowedMimeType) {
      callback(new Error("Only valid CSV files are allowed."));
      return;
    }

    callback(null, true);
  },
});

router.post("/", upload.single("file"), importCsv);

export default router;