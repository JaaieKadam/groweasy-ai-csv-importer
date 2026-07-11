"use client";

import { useState } from "react";
import { toast } from "sonner";

import { CsvPreview } from "@/components/csv-preview";
import { CsvUpload } from "@/components/csv-upload";
import { ImportResults } from "@/components/import-results";
import {
  uploadCsvFile,
  type CsvUploadResponse,
} from "@/lib/api";
import type { ParsedCsv } from "@/types/csv";

type ImportStep =
  | "upload"
  | "preview"
  | "results";

export default function Home() {
  const [step, setStep] =
    useState<ImportStep>("upload");

  const [parsedCsv, setParsedCsv] =
    useState<ParsedCsv | null>(null);

  const [importResult, setImportResult] =
    useState<CsvUploadResponse | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleFileParsed = (data: ParsedCsv) => {
    setParsedCsv(data);
    setImportResult(null);
    setStep("preview");
  };

  const handleReset = () => {
    if (isSubmitting) {
      return;
    }

    setParsedCsv(null);
    setImportResult(null);
    setStep("upload");
  };

  const handleConfirm = async () => {
    if (!parsedCsv || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response =
        await uploadCsvFile(parsedCsv.file);

      setImportResult(response);
      setStep("results");

      toast.success(
        `Imported ${response.result.summary.imported.toLocaleString()} records. ${response.result.summary.skipped.toLocaleString()} skipped.`,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while processing the CSV.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 transition-colors dark:bg-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center">
        {step === "upload" && (
          <CsvUpload
            onFileParsed={handleFileParsed}
          />
        )}

        {step === "preview" &&
          parsedCsv && (
            <CsvPreview
              data={parsedCsv}
              onReset={handleReset}
              onConfirm={handleConfirm}
              isSubmitting={isSubmitting}
            />
          )}

        {step === "results" &&
          importResult && (
            <ImportResults
              data={importResult}
              onReset={handleReset}
            />
          )}
      </div>
    </main>
  );
}