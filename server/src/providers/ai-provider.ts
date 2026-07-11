import type { AiCrmRecord } from "../schemas/server/src/crm.schema.js";
import type { IndexedCsvRow } from "../services/csv.service.js";

export interface AiProvider {
  extractBatch(
    records: IndexedCsvRow[],
  ): Promise<AiCrmRecord[]>;
}