import logger from './logger';
import { messagingApi } from '@line/bot-sdk';
import { inspect } from 'util';
import { Message } from '@line/bot-sdk/dist/messaging-api/api';

// create LINE SDK client
const client = new messagingApi.MessagingApiClient({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});

export async function pushMessage(userId: string, messages: Message[]) {
  logger.debug(inspect(messages, false, null, true));
  try {
    const res = await client.pushMessage({ to: userId, messages });
    logger.debug(inspect(res, false, null, true));
    return res;
  } catch (err) {
    logger.error(err.message);
    throw err;
  }
}

export async function replyMessage(replyToken: string, messages: Message[]) {
  logger.debug(inspect(messages, false, null, true));
  try {
    const res = await client.replyMessage({ replyToken, messages });
    logger.debug(inspect(res, false, null, true));
    return res;
  } catch (err) {
    logger.error(err.message);
    throw err;
  }
}

export async function getProfile(userId: string) {
  try {
    const res = await client.getProfile(userId);
    logger.debug(inspect(res, false, null, true));
    return res;
  } catch (err) {
    logger.error(err.message);
    throw err;
  }
}
