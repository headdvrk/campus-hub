// Google Apps Script relay: sends Campus Hub verification emails from your Gmail over HTTPS.
// Use it when the server host blocks SMTP ports (e.g. Render free tier).
//
// Setup (once):
//  1. https://script.google.com → New project → paste this file → set SECRET to a long random string.
//  2. Deploy → New deployment → type "Web app": Execute as "Me", Who has access "Anyone" → Deploy, allow access.
//  3. Put the Web app URL into MAIL_WEBHOOK_URL and the same SECRET into MAIL_WEBHOOK_SECRET (server/.env).
// Limit: about 100 emails per day for a personal Gmail account.

const SECRET = 'CHANGE_ME';

function doPost(e) {
  const reply = (obj) =>
    ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
  try {
    const data = JSON.parse(e.postData.contents);
    if (SECRET === 'CHANGE_ME' || data.secret !== SECRET) return reply({ ok: false, error: 'forbidden' });
    MailApp.sendEmail({ to: data.to, subject: data.subject, htmlBody: data.html, name: data.name || 'Campus Hub' });
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  }
}
