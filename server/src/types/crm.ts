import type {
  CrmStatus,
  DataSource,
} from "../schemas/server/src/crm.schema.js";

export interface CrmRecord {
  created_at: string;
  name: string;
  email: string;
  country_code: string;
  mobile_without_country_code: string;
  company: string;
  city: string;
  state: string;
  country: string;
  lead_owner: string;
  crm_status: CrmStatus | "";
  crm_note: string;
  data_source: DataSource | "";
  possession_time: string;
  description: string;
}

export interface SkippedRecord {
  row: number;
  reason: string;
}

export interface ImportResult {
  records: CrmRecord[];
  skipped: SkippedRecord[];
  summary: {
    totalRecords: number;
    imported: number;
    skipped: number;
  };
}