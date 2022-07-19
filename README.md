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

### Push / Deploy

The npm scripts available:

```sh
# Push
npm run push

# Deploy
npm run deploy
```
