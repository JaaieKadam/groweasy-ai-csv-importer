import type { AiCrmRecord } from "../schemas/server/src/crm.schema.js";
import type {
  CrmRecord,
  ImportResult,
  SkippedRecord,
} from "../types/crm.js";

function cleanSingleLine(value: string): string {
  return value
    .replace(/\r\n/g, "\\n")
    .replace(/\r/g, "\\n")
    .replace(/\n/g, "\\n")
    .trim();
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeCountryCode(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const digits = trimmed.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  return `+${digits}`;
}

function normalizeMobile(value: string): string {
  return value.replace(/\D/g, "");
}

function normalizeCreatedAt(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const timestamp = Date.parse(trimmed);

  if (Number.isNaN(timestamp)) {
    return "";
  }

  return new Date(timestamp).toISOString();
}

export function normalizeAiRecord(
  record: AiCrmRecord,
): CrmRecord {
  return {
    created_at: normalizeCreatedAt(record.created_at),
    name: cleanSingleLine(record.name),
    email: normalizeEmail(record.email),
    country_code: normalizeCountryCode(record.country_code),
    mobile_without_country_code: normalizeMobile(
      record.mobile_without_country_code,
    ),
    company: cleanSingleLine(record.company),
    city: cleanSingleLine(record.city),
    state: cleanSingleLine(record.state),
    country: cleanSingleLine(record.country),
    lead_owner: normalizeEmail(record.lead_owner),
    crm_status: record.crm_status,
    crm_note: cleanSingleLine(record.crm_note),
    data_source: record.data_source,
    possession_time: cleanSingleLine(record.possession_time),
    description: cleanSingleLine(record.description),
  };
}

export function buildImportResult(
  aiRecords: AiCrmRecord[],
  totalInputRecords: number,
): ImportResult {
  const records: CrmRecord[] = [];
  const skipped: SkippedRecord[] = [];

  for (const aiRecord of aiRecords) {
    const normalized = normalizeAiRecord(aiRecord);

    if (
      !normalized.email &&
      !normalized.mobile_without_country_code
    ) {
      skipped.push({
        row: aiRecord._row_id,
        reason: "Record contains neither an email nor a mobile number.",
      });

      continue;
    }

    records.push(normalized);
  }

  return {
    records,
    skipped,
    summary: {
      totalRecords: totalInputRecords,
      imported: records.length,
      skipped: skipped.length,
    },
  };
}