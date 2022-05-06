import { config } from 'dotenv';
import { Client, Constants } from 'eris';
import { ArenaClient } from 'arena-ts';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { extractUrls } from './extractUrls';

config();

function fetchArenaChannelMap(): Record<string, string> {
  try {
    return JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../channels.json')).toString()
    );
  } catch (e) {
    console.warn('Warning: No channel.json map loaded');
  }
  return {};
}

const channelMap = fetchArenaChannelMap();

function assertExists<T>(
  v: T | null | undefined,
  msg?: string
): asserts v is T {
  if (v != null) return;
  throw new Error(msg || 'Value should exist');
}

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_BOT_ID = process.env.DISCORD_BOT_ID;
const ARENA_API_TOKEN = process.env.ARENA_API_TOKEN;

type UploadUrlsResponse =
  | { type: 'error'; message: string; blocks?: string[] }
  | { type: 'ok'; blocks: string[] };

async function uploadUrlsToArenaChannel(
  client: ArenaClient,
  channel: string,
  urls: string[]
): Promise<UploadUrlsResponse> {
  if (urls.length > 5)
    return {
      type: 'error',
      message:
        'Too much content! I cannot upload more than five things at a time.',
    };
  const blocks: string[] = [];
  let failed = 0;
  for (const url of urls) {
    try {
      const block = await client.channel(channel).createBlock({ source: url });
      blocks.push(`https://www.are.na/block/${block.id}`);
    } catch (e) {
      failed++;
      console.error(e);
    }
  }
  if (failed > 0) {
    return {
      type: 'error',
      message: 'Some or all uploads to are.na failed!',
      blocks,
    };
  }
  return {
    type: 'ok',
    blocks,
  };
}

async function main() {
  assertExists(DISCORD_BOT_TOKEN, 'DISCORD_BOT_TOKEN not set!');
  assertExists(ARENA_API_TOKEN, 'ARENA_API_TOKEN not set!');
  const arenaClient = new ArenaClient({ fetch, token: ARENA_API_TOKEN });
  const bot = new Client(DISCORD_BOT_TOKEN);
  bot.on('ready', () => {
    console.log('connected and ready');
  });

  bot.on('messageCreate', (msg) => {
    if (!msg.mentions.find((user) => user.id === DISCORD_BOT_ID && user.bot)) {
      return;
    }
    const channel = bot.getChannel(msg.channel.id);
    if (channel.type !== Constants.ChannelTypes.GUILD_TEXT) {
      return;
    }
    // Find are.na channel to post to.
    const arenaChannel = channelMap[channel.name];
    if (!arenaChannel) {
      bot.createMessage(
        channel.id,
        'Cannot post to are.na because this text channel is not mapped to an are.na channel.'
      );
      return;
    }
    // analyse message for content
    let urls = [];
    for (const attachment of msg.attachments) {
      if (attachment.ephemeral) continue;
      urls.push(attachment.url);
    }
    for (const embed of msg.embeds) {
      embed.url && urls.push(embed.url);
    }
    const potentialUrls = extractUrls(msg.content);
    for (const potentialUrl of potentialUrls) {
      if (urls.some((url) => url.includes(potentialUrl))) {
        continue;
      }
      urls.push(potentialUrl);
    }

    if (urls.length === 0) {
      bot.createMessage(
        channel.id,
        ':no_mouth: I could not find anything to post to are.na. If you want to post to are.na include links or file attachments in a message and tag me.'
      );
      return;
    }

    uploadUrlsToArenaChannel(arenaClient, arenaChannel, urls)
      .then((result) => {
        switch (result.type) {
          case 'error':
            bot.createMessage(
              channel.id,
              `:poop: ${result.message}` +
                (result.blocks && result.blocks.length > 0
                  ? `\n Only ${result.blocks.length} block${
                      result.blocks.length > 1 ? 's' : ''
                    } of ${
                      urls.length
                    } were added to our arena channel: ${arenaChannel}!`
                  : '')
            );
            return;
          case 'ok':
            bot.createMessage(
              channel.id,
              `:tada: I posted ${result.blocks.length} new block${
                result.blocks.length > 1 ? 's' : ''
              } to our arena channel: ${arenaChannel}!`
            );
            return;
        }
      })
      .catch((e) => {
        console.error(e);
      });
  });
  bot.on('disconnect', () => {
    // try to reconnect?
    console.log('disconnected');
    process.exit(1);
  });

  return bot.connect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
