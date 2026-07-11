# GrowEasy AI-Powered CSV Importer

An AI-powered CSV importer that accepts CRM lead data from CSV files with arbitrary column names and structures, previews the raw data before processing, and uses Google Gemini to intelligently map records into the GrowEasy CRM format.

## Features

### CSV Upload and Preview
- Drag-and-drop and file picker support
- Client-side CSV parsing before AI processing
- Validation for file type, empty files, duplicate headers, and file size
- Responsive preview table with horizontal and vertical scrolling
- Sticky table headers
- AI processing begins only after explicit user confirmation

### AI-Powered CRM Extraction
- Uses Google Gemini to intelligently map arbitrary CSV structures into the GrowEasy CRM schema
- Does not depend on fixed input column names
- Processes records in batches
- Retry mechanism for failed AI batches
- Structured AI output validation
- Handles ambiguous and messy CSV fields
- Extracts primary email and mobile number while preserving additional contact information in CRM notes
- Restricts CRM status and data source values to the allowed values
- Skips records containing neither an email nor a mobile number

### Results
- Displays successfully parsed CRM records
- Displays skipped records with reasons
- Shows total, successfully imported, and skipped record counts
- Responsive results table
- Virtualized table support for larger datasets

### User Experience
- Responsive interface
- AI processing/loading state
- Progress indicator
- Error handling and toast notifications
- Dark mode
- Import another CSV workflow

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Papa Parse
- Sonner
- Lucide React

### Backend
- Node.js
- Express
- TypeScript
- Google Gemini API
- Zod
- Multer

## Architecture

The application is split into a Next.js frontend and an Express backend.

```text
CSV File
   |
   v
Client-side Validation & Parsing
   |
   v
CSV Preview
   |
   | User confirms import
   v
Express Upload API
   |
   v
Server-side CSV Parsing
   |
   v
Batch Processing
   |
   v
Google Gemini
   |
   v
Structured Response Validation
   |
   v
CRM Normalization & Invalid Record Filtering
   |
   v
Results UI
```

The frontend performs local parsing only for the preview. No AI processing occurs until the user confirms the import. After confirmation, the original CSV file is uploaded to the backend, parsed into records, processed through Gemini in batches, validated and normalized, and returned as structured CRM data.

## CRM Output Schema

The AI attempts to extract the following fields:

- `created_at`
- `name`
- `email`
- `country_code`
- `mobile_without_country_code`
- `company`
- `city`
- `state`
- `country`
- `lead_owner`
- `crm_status`
- `crm_note`
- `data_source`
- `possession_time`
- `description`

Records containing neither an email nor a mobile number are skipped.

## Allowed CRM Status Values

- `GOOD_LEAD_FOLLOW_UP`
- `DID_NOT_CONNECT`
- `BAD_LEAD`
- `SALE_DONE`

## Allowed Data Source Values

- `leads_on_demand`
- `meridian_tower`
- `eden_park`
- `varah_swamy`
- `sarjapur_plots`

If a data source cannot be confidently mapped, it is left blank.

## Project Structure

```text
groweasy-ai-csv-importer/
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── prompts/
│   │   ├── providers/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── types/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── types/
├── package.json
└── README.md
```

## Local Setup

### Prerequisites

- Node.js
- npm
- A Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/JaaieKadam/groweasy-ai-csv-importer.git
cd groweasy-ai-csv-importer
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd server
npm install
```

### 4. Configure backend environment variables

Inside the `server` directory, create a `.env` file based on `.env.example`:

```env
PORT=4000
CLIENT_URL=http://localhost:3000

GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

AI_BATCH_SIZE=20
AI_MAX_RETRIES=3
```

Replace `your_gemini_api_key_here` with a valid Gemini API key.

Do not commit the `.env` file or API key to source control.

### 5. Start the backend

From the `server` directory:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:4000
```

### 6. Start the frontend

Open another terminal in the project root:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:3000
```

## Usage

1. Open the application.
2. Upload or drag and drop a valid CSV file.
3. Review the locally parsed CSV preview.
4. Click **Confirm Import**.
5. Wait while the backend processes the records using Gemini.
6. Review successfully imported CRM records and any skipped records.
7. Use **Import another CSV** to process another file.

## Error Handling

The application handles:

- Invalid file types
- Empty CSV files
- Oversized files
- Missing or invalid CSV headers
- Duplicate headers
- CSV parsing failures
- AI provider failures
- Failed AI batches with retry attempts
- Invalid AI responses
- Records without an email or mobile number
- Backend and network errors

## Performance Considerations

- AI requests are processed in configurable batches.
- Failed AI batches are retried.
- CSV preview rows are limited for UI performance.
- Large result sets use table virtualization.
- The application remains stateless and does not require a database.

## Environment Variables

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | Backend server port | `4000` |
| `CLIENT_URL` | Allowed frontend origin | `http://localhost:3000` |
| `GEMINI_API_KEY` | Google Gemini API key | Required |
| `GEMINI_MODEL` | Gemini model used for extraction | `gemini-2.5-flash` |
| `AI_BATCH_SIZE` | Number of records processed per AI batch | `20` |
| `AI_MAX_RETRIES` | Maximum retry attempts for failed AI batches | `3` |

## Build Verification

Frontend:

```bash
npm run build
```

Backend:

```bash
cd server
npm run build
```

## Notes

- The application is stateless and does not require a database.
- AI extraction quality depends on the structure and context available in the uploaded CSV.
- Large imports may take longer depending on the number of records, configured batch size, AI provider availability, and API rate limits.
- API keys are configured through environment variables and are not committed to the repository.

## Author

Jaaie Kadam

Built as part of the GrowEasy Software Developer Intern assignment.
