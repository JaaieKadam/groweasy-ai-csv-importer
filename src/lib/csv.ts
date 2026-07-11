import Papa from "papaparse";

import type { CsvRow, ParsedCsv } from "@/types/csv";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB;
const CHUNK_SIZE = 256 * 1024; // 256 KB;

export function parseCsvFile(
  file: File,
): Promise<ParsedCsv> {
  return new Promise((resolve, reject) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      reject(
        new Error("Please upload a valid CSV file."),
      );
      return;
    }

    if (file.size === 0) {
      reject(
        new Error("The selected CSV file is empty."),
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      reject(
        new Error(
          "The CSV file must be 5 MB or smaller.",
        ),
      );
      return;
    }

    const rows: CsvRow[] = [];
    let headers: string[] | null = null;
    let hasRejected = false;

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: "greedy",
      chunkSize: CHUNK_SIZE,

      transformHeader: (header) =>
        header.trim(),

      chunk: (results, parser) => {
        if (hasRejected) {
          parser.abort();
          return;
        }

        if (!headers) {
          const parsedHeaders =
            results.meta.fields?.filter(
              (header) =>
                header.trim().length > 0,
            );

          if (
            !parsedHeaders ||
            parsedHeaders.length === 0
          ) {
            hasRejected = true;
            parser.abort();

            reject(
              new Error(
                "The CSV file does not contain valid column headers.",
              ),
            );

            return;
          }

          const duplicateHeaders =
            parsedHeaders.filter(
              (header, index) =>
                parsedHeaders.indexOf(header) !==
                index,
            );

          if (duplicateHeaders.length > 0) {
            hasRejected = true;
            parser.abort();

            reject(
              new Error(
                `Duplicate column headers found: ${[
                  ...new Set(duplicateHeaders),
                ].join(", ")}`,
              ),
            );

            return;
          }

          headers = parsedHeaders;
        }

        rows.push(...results.data);
      },

      complete: () => {
        if (hasRejected) {
          return;
        }

        if (!headers || headers.length === 0) {
          reject(
            new Error(
              "The CSV file does not contain valid column headers.",
            ),
          );
          return;
        }

        if (rows.length === 0) {
          reject(
            new Error(
              "The CSV file does not contain any data rows.",
            ),
          );
          return;
        }

        resolve({
          file,
          headers,
          rows,
          totalRows: rows.length,
        });
      },

      error: () => {
        if (!hasRejected) {
          reject(
            new Error(
              "The CSV file could not be parsed.",
            ),
          );
        }
      },
    });
  });
}