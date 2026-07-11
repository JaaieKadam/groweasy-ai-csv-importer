"use client";

import {
  CheckCircle2,
  FileSpreadsheet,
  RotateCcw,
  XCircle,
} from "lucide-react";

import { VirtualizedCrmTable } from "@/components/virtualized-crm-table";
import type { CsvUploadResponse } from "@/lib/api";

interface ImportResultsProps {
  data: CsvUploadResponse;
  onReset: () => void;
}

export function ImportResults({
  data,
  onReset,
}: ImportResultsProps) {
  const { records, skipped, summary } = data.result;

  return (
    <div className="w-full max-w-7xl overflow-hidden rounded-2xl bg-white shadow-2xl">
      <div className="border-b border-zinc-200 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-zinc-950">
              Import Results
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              AI processing completed for {data.file.originalName}.
            </p>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100"
          >
            <RotateCcw className="h-4 w-4" />
            Import another CSV
          </button>
        </div>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <FileSpreadsheet className="h-4 w-4" />
            Total records
          </div>

          <p className="mt-2 text-2xl font-bold text-zinc-950">
            {summary.totalRecords.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 text-sm text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Successfully imported
          </div>

          <p className="mt-2 text-2xl font-bold text-emerald-900">
            {summary.imported.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 text-sm text-red-700">
            <XCircle className="h-4 w-4" />
            Skipped
          </div>

          <p className="mt-2 text-2xl font-bold text-red-900">
            {summary.skipped.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6">
        <h2 className="mb-3 text-base font-semibold text-zinc-950">
          Successfully Parsed Records
        </h2>

        {records.length > 0 ? (
          <VirtualizedCrmTable records={records} />
        ) : (
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500">
            No valid CRM records were imported.
          </div>
        )}

        {skipped.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-base font-semibold text-zinc-950">
              Skipped Records
            </h2>

            <div className="overflow-hidden rounded-xl border border-red-200">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] text-left text-sm">
                  <thead className="bg-red-50">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-red-900">
                        Original row
                      </th>

                      <th className="px-4 py-3 font-semibold text-red-900">
                        Reason
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {skipped.map((record) => (
                      <tr
                        key={record.row}
                        className="border-t border-red-100"
                      >
                        <td className="px-4 py-3 text-zinc-700">
                          {record.row}
                        </td>

                        <td className="px-4 py-3 text-zinc-700">
                          {record.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}