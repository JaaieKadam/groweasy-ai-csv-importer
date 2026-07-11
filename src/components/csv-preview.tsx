"use client";

import {
  FileSpreadsheet,
  LoaderCircle,
  Sparkles,
  X,
} from "lucide-react";

import type { ParsedCsv } from "@/types/csv";

interface CsvPreviewProps {
  data: ParsedCsv;
  onReset: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function CsvPreview({
  data,
  onReset,
  onConfirm,
  isSubmitting,
}: CsvPreviewProps) {
  const previewRows = data.rows.slice(0, 100);

  const fileSize =
    data.file.size < 1024 * 1024
      ? `${(data.file.size / 1024).toFixed(1)} KB`
      : `${(data.file.size / (1024 * 1024)).toFixed(2)} MB`;

  return (
    <div className="relative w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">
      {isSubmitting && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/90 p-6 backdrop-blur-sm">
          <div
            role="status"
            aria-live="polite"
            className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-xl"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50">
              <LoaderCircle className="h-7 w-7 animate-spin text-orange-500" />
            </div>

            <div className="mt-5 flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-orange-500" />
              <h2 className="text-lg font-semibold text-zinc-950">
                Processing with AI
              </h2>
            </div>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Gemini is mapping your CSV records into the GrowEasy CRM
              format. Please keep this page open.
            </p>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-zinc-100">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-orange-500" />
            </div>

            <p className="mt-3 text-xs text-zinc-400">
              Processing time depends on the number of records and AI
              availability.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between gap-4 border-b border-zinc-200 p-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-950">
            Preview CSV Data
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Review your uploaded data before starting AI processing.
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          disabled={isSubmitting}
          aria-label="Close preview"
          className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-6">
        <div className="mb-5 flex flex-col gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-50">
              <FileSpreadsheet className="h-5 w-5 text-teal-700" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-zinc-900">
                {data.file.name}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">
                {fileSize} · {data.totalRows.toLocaleString()} records ·{" "}
                {data.headers.length.toLocaleString()} columns
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onReset}
            disabled={isSubmitting}
            className="shrink-0 text-sm font-medium text-teal-700 transition hover:text-teal-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Choose another file
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-200">
          <div className="max-h-[430px] overflow-auto">
            <table className="min-w-max w-full border-collapse text-left text-sm">
              <thead className="sticky top-0 z-10 bg-zinc-100">
                <tr>
                  <th className="whitespace-nowrap border-b border-r border-zinc-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-600">
                    Row
                  </th>

                  {data.headers.map((header, index) => (
                    <th
                      key={`${header}-${index}`}
                      className="whitespace-nowrap border-b border-r border-zinc-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-600 last:border-r-0"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {previewRows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50"
                  >
                    <td className="whitespace-nowrap border-r border-zinc-100 px-4 py-3 text-xs text-zinc-400">
                      {rowIndex + 1}
                    </td>

                    {data.headers.map((header, columnIndex) => (
                      <td
                        key={`${header}-${columnIndex}`}
                        title={row[header] ?? ""}
                        className="max-w-72 truncate whitespace-nowrap border-r border-zinc-100 px-4 py-3 text-zinc-700 last:border-r-0"
                      >
                        {row[header]?.trim() || (
                          <span className="text-zinc-300">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-1 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {previewRows.length.toLocaleString()} of{" "}
            {data.totalRows.toLocaleString()} records
          </p>

          {data.totalRows > previewRows.length && (
            <p>
              Preview limited to the first{" "}
              {previewRows.length.toLocaleString()} records.
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 bg-zinc-50 p-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onReset}
          disabled={isSubmitting}
          className="rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          )}

          {isSubmitting
            ? "Processing with AI..."
            : "Confirm Import"}
        </button>
      </div>
    </div>
  );
}