const testWebhook = () => {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();

  // The first row is a header
  for (let i = 1; i < data.length; i++) {
    const webhookURL = data[i][1];

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
