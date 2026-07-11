import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import multer from "multer";

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error(error);

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      res.status(413).json({
        success: false,
        message: "The CSV file must be 5 MB or smaller.",
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: `File upload failed: ${error.message}`,
    });
    return;
  }

  const message =
    error instanceof Error
      ? error.message
      : "An unexpected server error occurred.";

  res.status(500).json({
    success: false,
    message,
  });
};