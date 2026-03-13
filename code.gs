/**
 * YOU KNOW TOO MUCH — Guest Submission Handler
 * ─────────────────────────────────────────────
 * Google Apps Script (clasp or paste into script.google.com)
 *
 * SETUP STEPS
 * ───────────
 * 1. Go to https://script.google.com → New Project → paste this entire file.
 * 2. Update SHEET_ID below to your Google Sheet's ID
 *    (the long string in the sheet URL between /d/ and /edit).
 * 3. Update SHEET_NAME to the tab name you want responses written to
 *    (default: "Submissions"). Create that tab in your sheet if needed.
 * 4. Add headers to Row 1 of your sheet:
 *       Timestamp | Name | Email | What They Know Too Much About
 * 5. Deploy → New Deployment → Web App:
 *       - Execute as: Me
 *       - Who has access: Anyone
 * 6. Copy the generated Web App URL.
 * 7. Paste that URL into index.html where it says YOUR_APPS_SCRIPT_WEB_APP_URL.
 * 8. Re-deploy (new version) after any code change.
 */

const SHEET_ID   = 'YOUR_GOOGLE_SHEET_ID_HERE';
const SHEET_NAME = 'Submissions';

// ── POST handler (called by the website form) ────────────────────────────────
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const data    = JSON.parse(e.postData.contents);
    const sheet   = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);

    // Add headers automatically if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'What They Know Too Much About']);
    }

    sheet.appendRow([
      new Date().toISOString(),
      data.name  || '',
      data.email || '',
      data.topic || '',
    ]);

    return buildResponse({ result: 'success' });

  } catch (err) {
    return buildResponse({ result: 'error', error: err.message });

  } finally {
    lock.releaseLock();
  }
}

// ── GET handler (health check / CORS preflight fallback) ─────────────────────
function doGet() {
  return buildResponse({ result: 'ok', message: 'YKTM guest form endpoint is live.' });
}

// ── Helper: JSON response with CORS headers ───────────────────────────────────
function buildResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
