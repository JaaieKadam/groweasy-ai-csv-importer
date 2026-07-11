export type CsvRow = Record<string, string>;

export interface ParsedCsv {
  file: File;
  headers: string[];
  rows: CsvRow[];
  totalRows: number;
}