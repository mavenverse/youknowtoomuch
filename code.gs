/**
 * YOU KNOW TOO MUCH — Guest Submission Handler
 * ─────────────────────────────────────────────
 * Paste this into: Google Sheet → Extensions → Apps Script
 *
 * SETUP
 * 1. Replace SHEET_ID with the ID from your sheet URL
 *    e.g. docs.google.com/spreadsheets/d/THIS_PART_HERE/edit
 * 2. SHEET_TAB is the tab name at the bottom of the sheet (default is "Sheet1")
 * 3. Deploy → New Deployment → Web App
 *      Execute as: Me
 *      Who has access: Anyone
 * 4. Copy the Web App URL → paste into index.html as APPS_SCRIPT_URL
 */

const SHEET_ID  = 'YOUR_GOOGLE_SHEET_ID_HERE';
const SHEET_TAB = 'Sheet1'; // change if your tab has a different name

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const data  = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_TAB);

    sheet.appendRow([
      new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' }),
      data.name  || '',
      data.email || '',
      data.topic || '',
    ]);

    return response({ result: 'success' });

  } catch (err) {
    return response({ result: 'error', error: err.message });

  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return response({ result: 'ok', message: 'YKTM endpoint is live.' });
}

function response(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
