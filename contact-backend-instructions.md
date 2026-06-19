# 100% Free Lifetime Google Sheet + Gmail Contact Form Backend Setup

This guide allows you to set up a contact form backend that is completely free forever, has no submission caps, has no third-party branding, and logs all submissions into a spreadsheet while alerting you via email in real time.

---

## 1. Create Google Apps Script Backend

1. Open **[Google Sheets](https://sheets.google.com)** and create a new blank spreadsheet.
2. Rename the tab (tab at the bottom left) from `Sheet1` to **`Submissions`**.
3. In the menu bar, go to **Extensions** -> **Apps Script**.
4. Delete any code in the editor and paste the following Google Apps Script code:

```javascript
// Google Apps Script Contact Backend Code
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Submissions") || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var params = e.parameter;
    
    // Parse form parameters
    var name = params.name || "";
    var email = params.email || "";
    var message = params.message || "";
    var date = new Date();
    
    // Append row to Google Sheet
    sheet.appendRow([date, name, email, message]);
    
    // Send email alert to you
    var recipient = "maurgk212104@gmail.com"; // Your email
    var subject = "🔥 New Portfolio Message from " + name;
    var body = "You received a new inquiry from your portfolio website:\n\n" +
               "📅 Date: " + date.toString() + "\n" +
               "👤 Name: " + name + "\n" +
               "✉️ Email: " + email + "\n\n" +
               "💬 Message:\n" + message;
               
    MailApp.sendEmail(recipient, subject, body);
    
    // Return CORS-friendly JSON response
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
                         .setMimeType(ContentService.MimeType.JSON)
                         .setHeader("Access-Control-Allow-Origin", "*");
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON)
                         .setHeader("Access-Control-Allow-Origin", "*");
  }
}

// Allow CORS pre-flight OPTIONS request
function doOptions(e) {
  return ContentService.createTextOutput("")
                       .setMimeType(ContentService.MimeType.TEXT)
                       .setHeader("Access-Control-Allow-Origin", "*")
                       .setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
                       .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
```

5. Click the **Save** icon (disk symbol) or press `Ctrl + S`.

---

## 2. Deploy Web Application

1. In the Apps Script top bar, click **Deploy** -> **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Configure the settings:
   - **Description:** `Portfolio Contact Form Backend`
   - **Execute as:** `Me (your-gmail-account@gmail.com)`
   - **Who has access:** `Anyone` (this allows your HTML form to send data here without requiring readers to log in)
4. Click **Deploy**.
5. Google will ask you to **Authorize Access**. Click *Authorize access*, select your Google account, click *Advanced* (small text at bottom), and select *Go to Untitled project (unsafe)* to approve sheet/mail permissions.
6. Once deployed, copy the **Web app URL** (looks like `https://script.google.com/macros/s/.../exec`).

---

## 3. Configure Your Portfolio Form

1. Open your portfolio `index.html` file.
2. Locate the contact form `action=""` property:
   ```html
   <form id="fs-frm" action="YOUR_GOOGLE_WEB_APP_URL" method="POST" ...>
   ```
3. Replace `YOUR_GOOGLE_WEB_APP_URL` with the URL you copied in Step 6.
4. Save and deploy your site to GitHub Pages! Submissions will now go directly to your Google Sheet and send a notification to your Gmail account.
