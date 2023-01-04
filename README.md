# line-bot-5

## 1. Initialize

```
$ npm init --yes
$ npm install -g nodemon
$ npm install --save express @line/bot-sdk dotenv mongoose log4js express-cluster
$ npm install --save-dev eslint
$ npm init @eslint/config
```

```json:package.json
  :
  "engint": {
    "node": ">=19.0 <20.0",
    "npm": "~8.19.2"
  },
  :
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node -r dotenv/config index.js",
    "dev": "nodemon -r dotenv/config index.js",
    "lint": "eslint . --ext .js",
    "lint:fix": "eslint . --ext .js --fix"
  },
  :
```

```json:.eslintrc.json
{
    "env": {
        "node": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
    }
}
```

## 2. Push source

```console:.gitignore
$ cat .gitignore
npm-debug.log
node_modules
.env
.vscode
certs
```

```
$ git init
$ git add .
$ git commit -m "First commit"
$ git remote add origin s035779.github.com:S035779/line-bot-5.git
$ git push -u origin master
```

## 3. Run ngrok.

```
$ ngrok http 3000
```

## 4. Run line-bot-5 app.

```
$ npm run dev
```

## 5. Set webhook url

Webhook URL: https://a05f-61-25-23-68.ngrok.io/bot/webhook

```
{ destination: 'U********************************', events: [] }
```

## 6. Reply static message.

```
{
  destination: 'U********************************',
  events: [
    {
      type: 'message',
      message: { type: 'text', id: '17391207771927', text: 'こんにちは' },
      webhookEventId: '01GNM2EF14G4JZQEQ3VHRKC3Z5',
      deliveryContext: { isRedelivery: false },
      timestamp: 1672489679786,
      source: { type: 'user', userId: 'U********************************' },
      replyToken: '5f32339530cd46939db0bf81a75340ae',
      mode: 'active'
    }
  ]
}
1 event(s) processed.
```

eol
