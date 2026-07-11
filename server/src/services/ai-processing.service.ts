import { env } from "../config/env.js";
import type { AiProvider } from "../providers/ai-provider.js";
import type { AiCrmRecord } from "../schemas/server/src/crm.schema.js";
import type { IndexedCsvRow } from "./csv.service.js";

function splitIntoBatches(
  records: IndexedCsvRow[],
  batchSize: number,
): IndexedCsvRow[][] {
  const batches: IndexedCsvRow[][] = [];

  for (let index = 0; index < records.length; index += batchSize) {
    batches.push(records.slice(index, index + batchSize));
  }

  return batches;
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(resolve, milliseconds),
  );
}

async function processBatchWithRetry(
  provider: AiProvider,
  batch: IndexedCsvRow[],
  batchNumber: number,
): Promise<AiCrmRecord[]> {
  let lastError: unknown;

  for (
    let attempt = 0;
    attempt <= env.AI_MAX_RETRIES;
    attempt += 1
  ) {
    try {
      return await provider.extractBatch(batch);
    } catch (error) {
      lastError = error;

      if (attempt === env.AI_MAX_RETRIES) {
        break;
      }

      const delayMs = 1000 * 2 ** attempt;

      console.warn(
        `AI batch ${batchNumber} failed. Retrying in ${delayMs}ms...`,
      );

      await sleep(delayMs);
    }
  }

  throw new Error(
    `AI processing failed for batch ${batchNumber}.`,
    {
      cause: lastError,
    },
  );
}

export async function processRecordsInBatches(
  records: IndexedCsvRow[],
  provider: AiProvider,
): Promise<AiCrmRecord[]> {
  const batches = splitIntoBatches(
    records,
    env.AI_BATCH_SIZE,
  );

  const extractedRecords: AiCrmRecord[] = [];

  for (
    let index = 0;
    index < batches.length;
    index += 1
  ) {
    const batch = batches[index];

    if (!batch) {
      continue;
    }

    console.log(
      `Processing AI batch ${index + 1}/${batches.length} (${batch.length} records)`,
    );

    const batchResult = await processBatchWithRetry(
      provider,
      batch,
      index + 1,
    );

    extractedRecords.push(...batchResult);
  }

  return extractedRecords;
}