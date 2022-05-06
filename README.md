# An Are.na Discord Bot

This is a very basic discord bot for sharing links and posting the content to [are.na](https://are.na).

## How this bot works

If you post links or attachments a discord channel and mention this bot (`@your-bot-name`), the bot will automatically
post the links and/or attachments to your are.na channel.

## Getting started

Dependencies:

- Node v16+
- Yarn 3.2+

Clone this repository to get the code.

### Environment Variables

Requires environment variables for configuring access to discord and to are.na. You can set these however you normally
set environment variables for your deployment, or you can place a `.env` file at the root of this directory.

```
DISCORD_BOT_TOKEN=YOUR_DISCORD_BOT_TOKEN
DISCORD_BOT_ID=YOUR_DISCORD_BOT_USER_ID
ARENA_API_TOKEN=YOUR_ARENA_API_TOKEN
```

### Channel configuration

You can specify which of your discord channels will post to which are.na channels by creating a file
named `channels.json` in the root of this directory. This maps the discord channel to the are.na channel slug. Example:

```json
{
  "my-discord-channel-name": "my-arena-channel-slug"
}
```

### Running the app

Install dependencies:

```bash
yarn install
```

#### Development

```bash
yarn dev
```

#### Production

First build the app:
```bash
yarn build
```

Run the app:
```bash
yarn start
```


