import {
  AudioEventMessage,
  EventMessage,
  ImageEventMessage,
  TextEventMessage,
  WebhookRequestBody,
} from '@line/bot-sdk';
import { Message } from '@line/bot-sdk/dist/messaging-api/api';
import { Inject, Injectable } from '@nestjs/common';
import { ProblemsEntity } from 'src/model/repositories/problems/problems.entity';
import { UsersEntity } from 'src/model/repositories/users/users.entity';
import { getProfile, replyMessage } from 'src/utils/line-helper';
import logger from 'src/utils/logger';
import { Repository } from 'typeorm';

const LIVING_ROOM_IMAGES = [
  'https://lh3.googleusercontent.com/pw/AP1GczO-QeMTglZ46RIhvS1XyNoicQtIzQ76IbtfCzGK3XGQp_mdcTwT8duVIMg44x1AxkJ8A76Y2x48H-dODIiex3V2Bz1_z_BY_kLOYdMWSZscW_DLyCxiLP1uVMY2WYcQC7OwsBdvG1Y_3L33H1vVkgHw1Q=w1109-h1479-s-no-gm?authuser=0',
  'https://lh3.googleusercontent.com/pw/AP1GczM8w-kHNvbZsk5drYHBvWC5A4bIvvw9S5v7oidxch1dIK8-27xvP-yQSEVG9_gvEtI5ONzzl4f97Cc--ehVS2FwZqqKjrS23uKZ1xd4qCwAd5Kg_zn2goo-P0TUq0D7vfoBRo1sGQ6lAPzp-IGiMrr6cw=w2010-h1508-s-no-gm?authuser=0',
  'https://lh3.googleusercontent.com/pw/AP1GczMqhHrSgWCyqEVwA0PXGM9v95QPuNm8gT7SYqwu9iq5t3hHo2M0ADPweCl3nyLTAHaRnnl2teEu6wc4DuMuBRH8GD7OIL6mVuVZ5WNXT0EUdgsjkQTYrwvMJpGX7iMtLsgOeFefrudSi-taBvLIorz5Fw=w1109-h1479-s-no-gm?authuser=0',
  'https://lh3.googleusercontent.com/pw/AP1GczNnTf8m2zNg9h-BWyXVtfuUSdQBxCgjwwA40CAope8Gfh98H0Q0BgnMmFWbC1a9J6J5bMSZragsvpCCys20Qlre2kPSf_MnOFkZl084uOqAPo_RKnPIdoq8C6VGM3j3KENIFBAtpSDqNxdbCk6SfZy4fw=w2010-h1508-s-no-gm?authuser=0',
];

const BEDROOM_IMAGES = [
  'https://lh3.googleusercontent.com/pw/AP1GczMP04TPkjFKbxA3waJJ31HzegTL0h0pPetQNy7RqdDp7o1UJT4Zdi_K9JuryNL6iKPQCa7zxOllXZkMyyzSq3SUzSN29BFSgrA7aLZmI4Yp3tX0qQGM6fp9rbaXZ_2WXSfoIsMfqdDdtj7a0GxAGDnClQ=w2010-h1508-s-no-gm?authuser=0',
  'https://lh3.googleusercontent.com/pw/AP1GczManfb3nsBlc2EwB5ESvuNAf0nLB5W-nD49iDi7I1pFgest6bhw3s03cd4gI0m5Ohp1C4wLzz93LP4KI8S1T5o8uOy1ht6ml4geO9HmLxipnFICX6zIir3SzD5SUAnNPyEhXBsCk2awMp3DStjkVVr8mg=w2010-h1508-s-no-gm?authuser=0',
  'https://lh3.googleusercontent.com/pw/AP1GczM5biKR882gYAUL4TtdHSrQGl96YGkWm2BsodL-KoId5OdZFvReDm9Kcmmxozt-atnUmDW4CCl-UcebbpfRwlgPkvgdVy5INHk90dy1wKHv0SKCldZW0k3DqyKEpBlIbb8Wyi_BZJ6_2FQi_QFori0qxQ=w1132-h1508-s-no-gm?authuser=0',
  'https://lh3.googleusercontent.com/pw/AP1GczNg3izmFKMIfBLS98HaDHRK0XXIbhrHf2WEXZub3xXvIXB2XVwpj_hKFNnt-eqidDtXUO-ECd86nFj-RWGtQIDbvpHbe_02A39ZOCMhD6lIaUSa2SagHzYqLG2dmNuJqbXfD1sxn3a3wFUpUOim6zGOwQ=w1132-h1508-s-no-gm?authuser=0',
];

const IMAGE_MAP = new Map([
  ['查看客廳場景', LIVING_ROOM_IMAGES],
  ['查看主臥場景', BEDROOM_IMAGES],
]);

@Injectable()
export class MessageService {
  constructor(
    @Inject('USER_REPOSITORY')
    private usersRepository: Repository<UsersEntity>,
    @Inject('PROBLEM_REPOSITORY')
    private problemsRepository: Repository<ProblemsEntity>,
  ) {}
  async createUser(userId: string) {
    const profile = await getProfile(userId);
    await this.usersRepository.insert({
      line_id: userId,
      name: profile.displayName,
      image: profile.pictureUrl,
    });
    return profile;
  }
  async handleFollow(userId: string) {
    const messages = [];
    try {
      const { displayName, pictureUrl } = await this.createUser(userId);
      const { title, question, image } = await this.problemsRepository.findOne({
        where: { number: 1 },
      });
      messages.push({
        type: 'flex',
        altText: `${displayName}, 歡迎加入遊戲`,
        contents: {
          type: 'bubble',
          hero: {
            type: 'image',
            url: pictureUrl,
            size: 'full',
            aspectMode: 'cover',
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: `${displayName}, 歡迎加入遊戲`,
              },
            ],
          },
        },
      });
      messages.push({
        type: 'text',
        text: `${title}\n${question}`,
      });
      if (image) {
        messages.push({
          type: 'image',
          originalContentUrl: image,
          previewImageUrl: image,
        });
      }
    } catch (error) {
      let text = '歡迎回來，請繼續遊戲';
      if (-1 === error.message.indexOf(`for key 'PRIMARY'`)) {
        text = '加入遊戲失敗，請先封鎖再解除封鎖，嘗試重新加入遊戲';
      }
      logger.error(error.message);
      messages.push({
        type: 'text',
        text,
      });
    }
    return messages;
  }
  async handleTextMessage(userId: string, message: TextEventMessage) {
    const user = await this.usersRepository.findOne({
      where: { line_id: userId },
    });
    const problem = await this.problemsRepository.findOne({
      where: { number: user.chapter },
    });
    const { text } = message;
    const messages = [];
    switch (text) {
      case '查看目前題目':
        if (problem) {
          const { title, question, image } = problem;
          messages.push({
            type: 'text',
            text: `${title}\n${question}`,
          });
          if (image) {
            messages.push({
              type: 'image',
              originalContentUrl: image,
              previewImageUrl: image,
            });
          }
        } else {
          messages.push({
            type: 'text',
            text: '恭喜你完成了所有關卡，並獲得了大秘寶，謝謝你的參與～',
          });
        }
        break;
      case '查看客廳場景':
      case '查看主臥場景':
        if (1 === user.chapter) {
          messages.push({
            type: 'text',
            text: '請先進入大門',
          });
        } else {
          const images = IMAGE_MAP.get(text);
          if (images) {
            const carouselTemplate = {
              type: 'template',
              altText: 'images',
              template: {
                type: 'image_carousel',
                columns: [],
              },
            };
            for (const imageUrl of images) {
              carouselTemplate.template.columns.push({
                imageUrl,
                action: {
                  type: 'uri',
                  uri: imageUrl,
                },
              });
            }
            messages.push(carouselTemplate);
          }
        }
        break;
      default:
        const nextProblem = await this.problemsRepository.findOne({
          where: { number: user.chapter + 1 },
        });

        if (problem) {
          if (text === problem.answer) {
            user.chapter = user.chapter + 1;
            await this.usersRepository.save(user);
            if (nextProblem) {
              const { title, question, image } = nextProblem;
              messages.push({
                type: 'text',
                text: `${title}\n${question}`,
              });
              if (image) {
                messages.push({
                  type: 'image',
                  originalContentUrl: image,
                  previewImageUrl: image,
                });
              }
            } else {
              messages.push({
                type: 'text',
                text: '恭喜你完成了所有關卡，並獲得了大秘寶，謝謝你的參與～',
              });
            }
          } else {
            messages.push({
              type: 'text',
              text: problem.error_message,
            });
          }
        } else {
          messages.push({
            type: 'text',
            text: '恭喜你完成了所有關卡，並獲得了大秘寶，謝謝你的參與～',
          });
        }
        break;
    }
    return messages;
  }
  async handleMediaMessage(
    userId: string,
    message: ImageEventMessage | AudioEventMessage,
  ) {
    return [];
  }
  async handleMessage(userId: string, message: EventMessage) {
    const { type } = message;
    switch (type) {
      case 'text':
        return await this.handleTextMessage(userId, message);
      case 'image':
      case 'audio':
        return await this.handleMediaMessage(userId, message);
      default:
        return [];
    }
  }
  async dispatchMessage(body: WebhookRequestBody) {
    let messages: Message[] = [];
    const { events } = body;
    for (const event of events) {
      try {
        const {
          type,
          source: { userId },
        } = event;
        switch (type) {
          case 'follow':
            messages = await this.handleFollow(userId);
            break;
          case 'message':
            messages = await this.handleMessage(userId, event.message);
            await replyMessage(event.replyToken, messages);
            break;
          default:
            return;
        }
      } catch (error) {
        logger.error(error.message);
        messages = [
          { type: 'text', text: '出了點小意外, 請在嘗試一次剛剛的動作' },
        ];
      }
      if ('replyToken' in event && event.replyToken) {
        await replyMessage(event.replyToken, messages);
      }
    }
  }
}
