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

const main = () => {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data: string[][] = sheet.getDataRange().getValues();

  data.forEach((row, index) => {
    if (index === 0) {
      // The first row is a header
      return;
    }

    const twitterUserName = row[0];
    const webhookURL = row[1];
    const sinceId = row[2];

    const twitterUserId = fetchTwitterUserId(twitterUserName);
    const tweetIds = fetchTweetIds(twitterUserId, sinceId);

    if (sinceId === "") {
      // Record the latest Tweet ID
      sheet.getRange(index + 1, 2 + 1).setValue(tweetIds[0]);
      return;
    }

    if (tweetIds.length > 0) {
      // Record the latest Tweet ID
      sheet.getRange(index + 1, 2 + 1).setValue(tweetIds[0]);

      // Arrange tweetIds in chronological order
      tweetIds.reverse();

      for (const tweetId of tweetIds) {
        const payload = {
          content: `https://twitter.com/${twitterUserName}/status/${tweetId}`,
        };
        const options = {
          method: "post",
          contentType: "application/json",
          payload: JSON.stringify(payload),
        } as const;

        try {
          UrlFetchApp.fetch(webhookURL, options);
        } catch (error) {
          console.error(
            `Failed to POST to the Discord incoming webhook: ${error}`
          );
        }
      }
    }
  });
};
