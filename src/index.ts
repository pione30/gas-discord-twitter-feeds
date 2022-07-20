const twitterApiOrigin = "https://api.twitter.com";

const scriptProperties = PropertiesService.getScriptProperties();
const twitterApiBearerToken = scriptProperties.getProperty(
  "TWITTER_API_BEARER_TOKEN"
);

const fetchTwitterUserId = (userName: string): string => {
  const options = {
    method: "get",
    headers: {
      Authorization: `Bearer ${twitterApiBearerToken}`,
    },
  } as const;

  const response = UrlFetchApp.fetch(
    `${twitterApiOrigin}/2/users/by?usernames=${userName}`,
    options
  );

  const responseJson = JSON.parse(response.getContentText("UTF-8"));

  return responseJson["data"][0]["id"];
};

const fetchTweetIds = (userId: string, sinceId: string): string[] => {
  const options = {
    method: "get",
    headers: {
      Authorization: `Bearer ${twitterApiBearerToken}`,
    },
  } as const;

  const queryParams = [
    "exclude=replies",
    sinceId === ""
      ? // The minimum permitted value is 5
        "max_results=5"
      : `since_id=${sinceId}`,
  ].join("&");

  const response = UrlFetchApp.fetch(
    `${twitterApiOrigin}/2/users/${userId}/tweets?${queryParams}`,
    options
  );

  const responseJson = JSON.parse(response.getContentText("UTF-8"));

  return responseJson["data"].map((tweet: { id: string }) => tweet.id);
};

const testWebhook = () => {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();

  // The first row is a header
  data.shift();

  for (const row of data) {
    const twitterUserName = row[0];
    const webhookURL = row[1];

    const twitterUserId = fetchTwitterUserId(twitterUserName);
    const tweetIds = fetchTweetIds(twitterUserId);

    const payload = {
      content: `https://twitter.com/${twitterUserName}/status/${tweetIds[0]}`,
    };
    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
    } as const;

    UrlFetchApp.fetch(webhookURL, options);
  }
};
