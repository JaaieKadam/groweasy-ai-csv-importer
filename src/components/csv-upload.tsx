"use client";

import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileSpreadsheet, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { parseCsvFile } from "@/lib/csv";
import type { ParsedCsv } from "@/types/csv";

interface CsvUploadProps {
  onFileParsed: (data: ParsedCsv) => void;
}

export function CsvUpload({ onFileParsed }: CsvUploadProps) {
  const [isParsing, setIsParsing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setIsParsing(true);

      try {
        const parsed = await parseCsvFile(file);
        onFileParsed(parsed);
        toast.success(
          `${parsed.totalRows.toLocaleString()} records loaded successfully.`,
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong while reading the CSV file.";

        toast.error(message);
      } finally {
        setIsParsing(false);
      }
    },
    [onFileParsed],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (file) {
        void handleFile(file);
      }
    },
    [handleFile],
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    fileRejections,
  } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024,
    disabled: isParsing,
  });

  const handleNativeFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      void handleFile(file);
    }

    event.target.value = "";
  };

  const rejectedMessage =
    fileRejections.length > 0
      ? "Please select a valid CSV file that is 5 MB or smaller."
      : null;

  return (
    <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-950">
            Import Leads via CSV
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Upload a CSV file to bulk import leads into your system.
          </p>
        </div>

        <button
          type="button"
          aria-label="Close import dialog"
          className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div
        {...getRootProps()}
        className={[
          "flex min-h-80 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition",
          isDragActive
            ? "border-teal-600 bg-teal-50"
            : "border-zinc-300 bg-white hover:border-teal-500 hover:bg-teal-50/40",
          isParsing ? "pointer-events-none opacity-60" : "",
        ].join(" ")}
      >
        <input {...getInputProps()} />

        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm">
          <Upload className="h-7 w-7 text-teal-700" />
        </div>

        <h2 className="text-lg font-semibold text-zinc-950">
          {isParsing
            ? "Reading your CSV..."
            : isDragActive
              ? "Drop your CSV file here"
              : "Drop your CSV file here"}
        </h2>

        {!isParsing && (
          <p className="mt-1 text-sm text-zinc-500">
            or click to browse files
          </p>
        )}

        <div className="mt-5 flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-zinc-600">
          <FileSpreadsheet className="h-4 w-4" />
          Supported file: .csv (max 5 MB)
        </div>

        <p className="mt-5 max-w-lg text-xs leading-5 text-zinc-400">
          Column names do not need to follow a fixed format. Your data will be
          previewed before any AI processing begins.
        </p>
      </div>

      {rejectedMessage && (
        <p className="mt-3 text-sm text-red-600">{rejectedMessage}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleNativeFileChange}
      />

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          className="rounded-xl border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={isParsing}
          onClick={() => inputRef.current?.click()}
          className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isParsing ? "Reading File..." : "Choose File"}
        </button>
      </div>
    </div>
  );
}