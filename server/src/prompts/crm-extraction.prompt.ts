import type { IndexedCsvRow } from "../services/csv.service.js";

export function buildCrmExtractionPrompt(
  records: IndexedCsvRow[],
): string {
  return `
You are an expert CRM data extraction and normalization system.

Your task is to transform every input CSV record into the GrowEasy CRM schema.

The CSV may come from any source, including:
- Facebook lead exports
- Google Ads exports
- Excel spreadsheets
- real estate CRMs
- sales reports
- marketing agencies
- manually created spreadsheets

Column names are NOT fixed.

You must infer fields from:
- column names
- values
- context
- common abbreviations
- semantically equivalent labels
- combined fields containing multiple pieces of information

IMPORTANT RULES

1. PROCESS EVERY INPUT RECORD
Return exactly one output object for every input object.
Preserve the exact _row_id from the input.
Do not reorder records.
Do not omit a record even if it has no contact information.
Records without email and mobile will be skipped later by application code.

2. NEVER INVENT INFORMATION
Only extract information supported by the input record.
If a field cannot be determined, return an empty string "".

3. NAME
Map full-name fields to "name".
If first name and last name are separate, combine them in natural order.
Do not invent missing name parts.

4. EMAILS
If multiple email addresses exist:
- use the first email as "email"
- append additional email addresses to "crm_note"

5. MOBILE NUMBERS
If multiple phone/mobile numbers exist:
- use the first number as the primary mobile
- separate the country calling code when confidently identifiable
- put the calling code in "country_code"
- put the remaining primary number in "mobile_without_country_code"
- append additional phone numbers to "crm_note"

If a field contains both email and phone information, extract both.

6. CREATED DATE
Map lead creation, submission, registration, enquiry, or equivalent timestamps to "created_at".
Return a date/time string that JavaScript new Date(created_at) can parse.
If no reliable date exists, return "".

7. CRM STATUS
"crm_status" may ONLY be one of:
- GOOD_LEAD_FOLLOW_UP
- DID_NOT_CONNECT
- BAD_LEAD
- SALE_DONE
- ""

Map semantically equivalent statuses when the meaning is clear.

Examples:
- interested, highly interested, hot lead, follow up
  -> GOOD_LEAD_FOLLOW_UP
- no answer, unreachable, not connected, did not pick up
  -> DID_NOT_CONNECT
- not interested, invalid lead, bad lead
  -> BAD_LEAD
- sold, converted, deal closed, sale completed
  -> SALE_DONE

If the meaning is ambiguous, return "".

8. DATA SOURCE
"data_source" may ONLY be one of:
- leads_on_demand
- meridian_tower
- eden_park
- varah_swamy
- sarjapur_plots
- ""

Map obvious formatting variations to the corresponding allowed value.

Examples:
- "Eden Park" -> "eden_park"
- "Meridian Tower" -> "meridian_tower"
- "Sarjapur Plots" -> "sarjapur_plots"

If none match confidently, return "".

Do not put an arbitrary company, campaign, or source name into data_source.

9. CRM NOTES
Use "crm_note" for:
- remarks
- follow-up notes
- additional comments
- extra phone numbers
- extra email addresses
- useful information that does not fit another CRM field

Preserve useful existing notes.
Combine multiple note items concisely.

10. DESCRIPTION
Use "description" for general descriptive information about the lead, requirement, enquiry, or context when it is better treated as a description than an operational CRM note.

11. POSSESSION TIME
Use "possession_time" only when the input contains property possession or expected possession timing.

12. COMPANY
Do not confuse a lead's company with:
- campaign source
- project name
- data source

13. LEAD OWNER
Map salesperson, assigned agent, owner, representative, or equivalent fields to "lead_owner" only when they clearly identify the person responsible for the lead.

14. OUTPUT
Return only the structured data requested by the response schema.
Do not include explanations.
Do not include markdown.
Do not include fields outside the required schema.

INPUT RECORDS:
${JSON.stringify(records)}
`.trim();
}