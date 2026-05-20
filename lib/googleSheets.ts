import { google, sheets_v4 } from "googleapis";

const DEFAULT_SPREADSHEET_ID = "1ci0tGk9Iz-sdzwA0SIGXZE1FHOKaCpC_q9qYxfvNdNo";
const DEFAULT_SHEET_NAME = "Sheet1";

export interface EstimateSheetRecord {
  referenceId: string;
  name: string;
  phone: string;
  email: string;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vin: string;
  licensePlate: string;
  serviceNeeded: string;
  customerMessage: string;
  adminResponse: string;
  submittedAt: string;
  respondedAt: string;
}

function getSpreadsheetId() {
  return process.env.GOOGLE_SHEETS_SPREADSHEET_ID || DEFAULT_SPREADSHEET_ID;
}

function getSheetName() {
  return process.env.GOOGLE_SHEETS_SHEET_NAME || DEFAULT_SHEET_NAME;
}

function getPrivateKey() {
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!privateKey) return "";
  return privateKey.replace(/\\n/g, "\n");
}

async function getSheetsClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = getPrivateKey();

  if (!clientEmail || !privateKey) {
    throw new Error(
      "Google Sheets credentials are missing. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY."
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

function getDataRange() {
  return `${getSheetName()}!A2:N`;
}

function toStringValue(value: string | undefined) {
  return value?.toString().trim() ?? "";
}

function mapRowToRecord(row: string[]): EstimateSheetRecord | null {
  if (!row[0]) return null;

  return {
    referenceId: toStringValue(row[0]),
    name: toStringValue(row[1]),
    phone: toStringValue(row[2]),
    email: toStringValue(row[3]),
    vehicleYear: toStringValue(row[4]),
    vehicleMake: toStringValue(row[5]),
    vehicleModel: toStringValue(row[6]),
    vin: toStringValue(row[7]),
    licensePlate: toStringValue(row[8]),
    serviceNeeded: toStringValue(row[9]),
    customerMessage: toStringValue(row[10]),
    adminResponse: toStringValue(row[11]),
    submittedAt: toStringValue(row[12]),
    respondedAt: toStringValue(row[13]),
  };
}

export async function appendEstimateToSheet(
  record: Omit<EstimateSheetRecord, "adminResponse" | "respondedAt">
) {
  const sheets = await getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const range = `${getSheetName()}!A:N`;

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          record.referenceId,
          record.name,
          record.phone,
          record.email,
          record.vehicleYear,
          record.vehicleMake,
          record.vehicleModel,
          record.vin,
          record.licensePlate,
          record.serviceNeeded,
          record.customerMessage,
          "",
          record.submittedAt,
          "",
        ],
      ],
    },
  });
}

export async function getEstimatesFromSheet() {
  const sheets = await getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: getDataRange(),
  });

  const rows = (response.data.values || []) as string[][];

  return rows
    .map((row) => mapRowToRecord(row))
    .filter((row): row is EstimateSheetRecord => row !== null)
    .sort((a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt));
}

async function findSheetRowByReferenceId(
  sheets: sheets_v4.Sheets,
  referenceId: string
) {
  const spreadsheetId = getSpreadsheetId();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: getDataRange(),
  });
  const rows = (response.data.values || []) as string[][];
  const rowIndex = rows.findIndex((row) => toStringValue(row[0]) === referenceId);

  if (rowIndex === -1) return null;

  // +2 because rows are zero indexed and sheet data starts at row 2.
  return rowIndex + 2;
}

export async function updateEstimateResponseInSheet(params: {
  referenceId: string;
  responseMessage: string;
  respondedAt: string;
}) {
  const sheets = await getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const rowNumber = await findSheetRowByReferenceId(sheets, params.referenceId);

  if (!rowNumber) {
    return false;
  }

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: {
      valueInputOption: "USER_ENTERED",
      data: [
        {
          range: `${getSheetName()}!L${rowNumber}`,
          values: [[params.responseMessage]],
        },
        {
          range: `${getSheetName()}!N${rowNumber}`,
          values: [[params.respondedAt]],
        },
      ],
    },
  });

  return true;
}
