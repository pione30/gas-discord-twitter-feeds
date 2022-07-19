const testWebhook = () => {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();

  // The first row is a header
  data.shift();

  for (const row of data) {
    const webhookURL = row[1];

    const payload = {
      content: "Hello",
    };
    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
    } as const;

    UrlFetchApp.fetch(webhookURL, options);
  }
};
