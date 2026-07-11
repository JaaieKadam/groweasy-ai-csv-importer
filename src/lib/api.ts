const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

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
  crm_status: string;
  crm_note: string;
  data_source: string;
  possession_time: string;
  description: string;
}

export interface SkippedRecord {
  row: number;
  reason: string;
}

export interface CsvUploadResponse {
  success: boolean;
  message: string;
  file: {
    originalName: string;
    size: number;
  };
  result: {
    summary: {
      totalRecords: number;
      imported: number;
      skipped: number;
    };
    records: CrmRecord[];
    skipped: SkippedRecord[];
  };
}

export async function uploadCsvFile(
  file: File,
): Promise<CsvUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/api/import`, {
    method: "POST",
    body: formData,
  });

  const data = (await response.json()) as
    | CsvUploadResponse
    | { success: false; message?: string };

  if (!response.ok) {
    throw new Error(
      "message" in data && data.message
        ? data.message
        : "Failed to process the CSV file.",
    );
  }

  return data as CsvUploadResponse;
}