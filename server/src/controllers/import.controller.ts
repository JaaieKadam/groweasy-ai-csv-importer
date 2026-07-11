import type { NextFunction, Request, Response } from "express";

import { geminiProvider } from "../providers/gemini.provider.js";
import { processRecordsInBatches } from "../services/ai-processing.service.js";
import {
  addRowIds,
  parseCsvBuffer,
} from "../services/csv.service.js";
import { buildImportResult } from "../services/normalization.service.js";

export async function importCsv(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No CSV file was uploaded.",
      });
      return;
    }

    const parsedCsv = parseCsvBuffer(req.file.buffer);
    const indexedRows = addRowIds(parsedCsv.rows);

    const extractedRecords =
      await processRecordsInBatches(
        indexedRows,
        geminiProvider,
      );

    const importResult = buildImportResult(
      extractedRecords,
      parsedCsv.totalRows,
    );

    res.status(200).json({
      success: true,
      message: "CSV processed successfully using AI.",
      file: {
        originalName: req.file.originalname,
        size: req.file.size,
      },
      result: importResult,
    });
  } catch (error) {
    next(error);
  }
}