import { z } from "zod";

export const CRM_STATUSES = [
  "GOOD_LEAD_FOLLOW_UP",
  "DID_NOT_CONNECT",
  "BAD_LEAD",
  "SALE_DONE",
] as const;

export const DATA_SOURCES = [
  "leads_on_demand",
  "meridian_tower",
  "eden_park",
  "varah_swamy",
  "sarjapur_plots",
] as const;

const nullableString = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => {
    if (typeof value !== "string") {
      return "";
    }

    return value.trim();
  });

export const aiCrmRecordSchema = z.object({
  _row_id: z.coerce.number().int().positive(),

  created_at: nullableString,
  name: nullableString,
  email: nullableString,
  country_code: nullableString,
  mobile_without_country_code: nullableString,
  company: nullableString,
  city: nullableString,
  state: nullableString,
  country: nullableString,
  lead_owner: nullableString,

  crm_status: z
    .union([z.enum(CRM_STATUSES), z.literal(""), z.null(), z.undefined()])
    .transform((value) => value ?? ""),

  crm_note: nullableString,

  data_source: z
    .union([z.enum(DATA_SOURCES), z.literal(""), z.null(), z.undefined()])
    .transform((value) => value ?? ""),

  possession_time: nullableString,
  description: nullableString,
});

export const aiCrmBatchSchema = z.array(aiCrmRecordSchema);

export type AiCrmRecord = z.infer<typeof aiCrmRecordSchema>;
export type CrmStatus = (typeof CRM_STATUSES)[number];
export type DataSource = (typeof DATA_SOURCES)[number];