# Google Sheets Estimate Flow

This project stores estimate requests directly in Google Sheets (no database).

## 1) Sheet Setup

Use your spreadsheet:

- [Cars Of Novi Estimates Sheet](https://docs.google.com/spreadsheets/d/1ci0tGk9Iz-sdzwA0SIGXZE1FHOKaCpC_q9qYxfvNdNo/edit?gid=0#gid=0)

Create or confirm this tab exists (default: `Sheet1`) and add this header row in row 1:

1. `referenceId`
2. `name`
3. `phone`
4. `email`
5. `vehicleYear`
6. `vehicleMake`
7. `vehicleModel`
8. `vin`
9. `licensePlate`
10. `serviceNeeded`
11. `customerMessage`
12. `adminResponse`
13. `submittedAt`
14. `respondedAt`

If you only want a simplified view (`name`, `phone`, `estimate`, `response`, `date`), create a separate tab with formulas that reference these columns.

## 2) Google Service Account

1. In Google Cloud, enable **Google Sheets API**.
2. Create a **Service Account**.
3. Generate a JSON key for that service account.
4. Copy the service account email.
5. Share the spreadsheet with that service account email as **Editor**.

## 3) Environment Variables

Set these in `.env.local`:

```env
GOOGLE_SHEETS_SPREADSHEET_ID=1ci0tGk9Iz-sdzwA0SIGXZE1FHOKaCpC_q9qYxfvNdNo
GOOGLE_SHEETS_SHEET_NAME=Sheet1
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Notes:

- Keep quotes around `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`.
- Keep `\n` escaped exactly as shown.

## 4) Runtime Flow

### A) New estimate submission (`POST /api/estimate`)

1. Validate request payload.
2. Generate reference ID.
3. Append a new row in Google Sheets.
4. Send estimate notification email.
5. Return success + `referenceId` to frontend.

If Google Sheets write fails, API returns `500` so the request is not silently lost.

### B) Admin list (`GET /api/estimate`)

1. Read all rows from Google Sheets.
2. Map rows into estimate submission objects.
3. Return ordered submissions (newest first) for admin UI.

### C) Admin reply (`POST /api/admin/reply`)

1. Send email reply to customer.
2. Update the matching sheet row by `referenceId`:
   - set `adminResponse`
   - set `respondedAt`

If row is missing, email still sends and API logs a warning.

## 5) Files Implementing This

- `lib/googleSheets.ts`
- `app/api/estimate/route.ts`
- `app/api/admin/reply/route.ts`
- `.env.example`
