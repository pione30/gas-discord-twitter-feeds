You may first login:

```sh
npx clasp login
```

Your `.clasp.json` should be like:

```json
{
  "scriptId": "XXXXXXXXXX",
  "fileExtension": "ts"
}
```

### Requirements

* You must sign up for a Twitter developer account and create an developer App. Then put the Bearer Token to the GAS project's Script Property as `TWITTER_API_BEARER_TOKEN`.

* Create Google App Script project with a spreadsheet as a container.

  * The first row should be a header.

  * The first column is for the Twitter username.

  * The second column is for the Discord incoming webhook to POST.

### Push / Deploy

The npm scripts available:

```sh
# Push
npm run push

# Deploy
npm run deploy
```
