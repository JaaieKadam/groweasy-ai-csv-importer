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
  crm_status:
    | "GOOD_LEAD_FOLLOW_UP"
    | "DID_NOT_CONNECT"
    | "BAD_LEAD"
    | "SALE_DONE"
    | "";
  crm_note: string;
  data_source:
    | "leads_on_demand"
    | "meridian_tower"
    | "eden_park"
    | "varah_swamy"
    | "sarjapur_plots"
    | "";
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

export interface CsvUploadResponse {
  success: boolean;
  message: string;
  file: {
    originalName: string;
    size: number;
  };
  result: ImportResult;
}

export async function uploadCsvFile(
  file: File,
): Promise<CsvUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    "http://localhost:4000/api/import",
    {
      method: "POST",
      body: formData,
    },
  );

  const data = (await response.json()) as
    | CsvUploadResponse
    | {
        success: false;
        message?: string;
      };

  if (!response.ok) {
    throw new Error(
      "message" in data && data.message
        ? data.message
        : "Failed to process the CSV file.",
    );
  }

  return data as CsvUploadResponse;
}