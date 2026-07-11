import Papa from "papaparse";

export type RawCsvRow = Record<string, string>;

export interface ParsedCsvData {
  headers: string[];
  rows: RawCsvRow[];
  totalRows: number;
}
export interface IndexedCsvRow extends RawCsvRow {
  _row_id: string;
}

export function parseCsvBuffer(buffer: Buffer): ParsedCsvData {
  const csvText = buffer.toString("utf-8").replace(/^\uFEFF/, "");

  const result = Papa.parse<RawCsvRow>(csvText, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (header) => header.trim(),
  });

  if (result.errors.length > 0) {
    const fatalError = result.errors.find(
      (error) => error.type === "Quotes" || error.type === "Delimiter",
    );

    if (fatalError) {
      throw new Error(
        `CSV parsing failed near row ${fatalError.row ?? "unknown"}: ${fatalError.message}`,
      );
    }
  }

  const headers = result.meta.fields?.filter(
    (header) => header.trim().length > 0,
  );

  if (!headers || headers.length === 0) {
    throw new Error("The CSV file does not contain valid column headers.");
  }

  if (result.data.length === 0) {
    throw new Error("The CSV file does not contain any data rows.");
  }

  return {
    headers,
    rows: result.data,
    totalRows: result.data.length,
  };
}

export function addRowIds(
  rows: RawCsvRow[],
): IndexedCsvRow[] {
  return rows.map((row, index) => ({
    ...row,
    _row_id: String(index + 1),
  }));
}