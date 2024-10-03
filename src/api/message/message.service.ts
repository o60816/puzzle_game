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
  'https://lh3.googleusercontent.com/pw/AP1GczPCvwfg_O9rsd-iXqwjGHKLBWAizhKlszjfGTOwL03NFlKcPa-MACunW1gAdnuSL5wS02ghX6DEiYlkXPvfar0a0Hs6PXj0kK6y5rlUL1Z1C5aQIAEafusrzNiopv6azuTLjG7TsWXnJm3prcPnZDDnDw=w2010-h1508-s-no-gm?authuser=0',
];

const KITCHEN_IMAGES = [
  'https://lh3.googleusercontent.com/pw/AP1GczNSHf0_6_hKGj7sHhbPMGi03WM3sNGuPgwt30GFrvdlU8zACK58r2L92VUP48WQx3EvbqPd4MTZZ1GE9w3xtS1trZz74bSgVRVMukHvgivprhOuh-w9etWYf8iJtNo4bSIMs0M1FaRqmXAbArv4R9yPVQ=w1109-h1479-s-no-gm?authuser=0',
  'https://lh3.googleusercontent.com/pw/AP1GczP-mQ3KFsF7nU4PU2ECRRlBmm4T2WS-gE76GKrIY0OQ18Ap5wni-S6XADyDsaaZ-YJT8Ul4HEwsKwkC2w3Q-cWLbZo8_DEA2SZlr03BxjRxOp93TnPI1BRd_KSqAdZ_tw7YbW4MOzd-Yt7CUeShkM-9Xw=w1109-h1479-s-no-gm?authuser=0',
  'https://lh3.googleusercontent.com/pw/AP1GczNuClwsi6WqCyfMoU8noyqQPY7Bjj0C44NwrDFYLjkJmJi2Jfi583KYN36hDmOi1EUGX0VkPGGUIoAHF1eUN8uPfEjfqMG0FKM-HITz5MJf3gA476HkXQlcCIt5nCgRZmKwaRArcUGmx8lGtG-Ocu3t3A=w2010-h1508-s-no-gm?authuser=0',
];

const IMAGE_MAP = new Map([
  ['查看客廳場景', LIVING_ROOM_IMAGES],
  ['查看主臥場景', BEDROOM_IMAGES],
  ['查看廚房場景', KITCHEN_IMAGES],
]);

const FINISH_MESSAGE =
  '恭喜你順利解開所有謎題~♪~♬~\n也感謝你來參加我們的婚禮♥\n希望你今天玩得開心唷(｡◕∀◕｡)/';

const FINISH_IMAGES = [
  'https://lh3.googleusercontent.com/pw/AP1GczNz4o17twJDvdO479Dplh8jbMeZNeke2lQ7d4ikC2Wpzho22anQHh-ULnO-MJ_74Bv9iqj7uFzUpM5qBrsn28Gn_hH4URDNrapn5yteO-5xZ4X9-Nv86TCwq7KMiNzecdzjGTVykO0TUBLkkXbtdSqNpA=w2262-h1508-s-no-gm?authuser=0',
  'https://lh3.googleusercontent.com/pw/AP1GczMm6RmFF_wfVWsKCmTSJBADJMbGy83Mr01BfNBno1SWHCrIitvw70yqb39GbMcNEWDcK0GfO1AH8pEGVozye0p_vUsF9SJD403z5xRRFG-xG0Lp5Gc6IPEowAmGK21aBBXsNhE9qFo4ltyAAV25tauckA=w2262-h1508-s-no-gm?authuser=0',
  'https://lh3.googleusercontent.com/pw/AP1GczPQHvKSSH_0HASKtzYu3FeiZ1e2-YIiQh9iP7ketu3h-PQQ54r2lQS6mlbB_auKaOQxxGX5-aqz5dR7SAe4x14AxKiJ8QSRbXEzHoLvQAJR17SrugW4yswrV_3R1pnRwUxbWYT2p2-st5jlbDQ-iZN0BA=w2262-h1508-s-no-gm?authuser=0',
];

@Injectable()
export class MessageService {
  constructor(
    @Inject('USER_REPOSITORY')
    private usersRepository: Repository<UsersEntity>,
    @Inject('PROBLEM_REPOSITORY')
    private problemsRepository: Repository<ProblemsEntity>,
  ) {}

  async createUser(userId: string): Promise<UsersEntity> {
    const profile = await getProfile(userId);
    let user = await this.usersRepository.findOne({
      where: { line_id: userId },
    });
    if (user) {
      return user;
    }
    user = await this.usersRepository.save({
      line_id: userId,
      name: profile.displayName,
      image: profile.pictureUrl,
      chapter: 1,
    });
    return user;
  }

  async handleFollow(userId: string): Promise<Message[]> {
    const { name, image, chapter } = await this.createUser(userId);
    const problem = await this.problemsRepository.findOne({
      where: { number: chapter },
    });
    const message: Message[] = this.createWelcomeFlexMessage(name, image);
    if (!problem) {
      message.push(...this.createFinishedMessage());
      return message;
    }
    message.push(...this.createProblemMessage(problem));
    if (problem.image) {
      message.push(this.createImageMessage(problem.image));
    }
    return message;
  }

  async handleTextMessage(
    userId: string,
    message: TextEventMessage,
  ): Promise<Message[]> {
    const user = await this.usersRepository.findOne({
      where: { line_id: userId },
    });
    const problem = await this.problemsRepository.findOne({
      where: { number: user.chapter },
    });
    if (!problem) {
      return this.createFinishedMessage();
    }
    const { text } = message;

    switch (text) {
      case '查看目前題目':
        return this.handleViewCurrentProblem(problem);
      case '查看客廳場景':
      case '查看主臥場景':
      case '查看廚房場景':
        if (1 == user.chapter) {
          return [this.createTextMessage('目前還不能查看喔！請先進入大門')];
        }
        return this.handleViewScene(text);
      default:
        return this.handleAnswerAttempt(user, problem, text);
    }
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
            break;
          default:
            return;
        }
      } catch (error) {
        logger.error(error.message);
        messages = [
          this.createTextMessage('出了點小意外, 請先封鎖再解除封鎖後再試一次'),
        ];
      }
      if ('replyToken' in event && event.replyToken) {
        await replyMessage(event.replyToken, messages);
      }
    }
  }

  private createFinishedMessage() {
    return [
      this.createTextMessage(FINISH_MESSAGE),
      this.createImageMessage(FINISH_IMAGES[Date.now() % FINISH_IMAGES.length]),
    ];
  }

  private createTextMessage(text: string): Message {
    return {
      type: 'text',
      text,
    };
  }

  private createWelcomeFlexMessage(
    displayName: string,
    pictureUrl: string,
  ): Message[] {
    return [
      {
        type: 'flex',
        altText: '歡迎加入',
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
                text: `歡迎 ${displayName}`,
                weight: 'bold',
                size: 'xl',
              },
              {
                type: 'text',
                text: '來到婚禮解謎遊戲！',
              },
              {
                type: 'text',
                text: '各位挑戰者們，想要我的財寶嗎？',
              },
              {
                type: 'text',
                text: '想要的話可以全部給你!',
              },
              {
                type: 'text',
                text: '去找吧!',
              },
              {
                type: 'text',
                text: '我把所有的財寶都放在那裡了!',
              },
              {
                type: 'text',
                text: '(是真的有財(ㄌ一ˇ)寶(ㄨˋ)喔！！)',
              },
            ],
          },
        },
      },
    ];
  }
  private createProblemMessage(problem: ProblemsEntity): Message[] {
    return [
      {
        type: 'text',
        text: `${problem.title}`,
      },
      {
        type: 'text',
        text: `${problem.question}`,
      },
    ];
  }

  private createCasualImageMessage(images: string[] = []): Message {
    return {
      type: 'template',
      altText: 'images',
      template: {
        type: 'image_carousel',
        columns: images.map((imageUrl) => ({
          imageUrl,
          action: {
            type: 'uri',
            uri: imageUrl,
          },
        })),
      },
    };
  }
  private createImageMessage(imageUrl: string): Message {
    return {
      type: 'image',
      originalContentUrl: imageUrl,
      previewImageUrl: imageUrl,
    };
  }

  private handleViewCurrentProblem(problem: ProblemsEntity): Message[] {
    const messages: Message[] = this.createProblemMessage(problem);
    if (problem.image) {
      messages.push(this.createImageMessage(problem.image));
    }
    return messages;
  }

  private handleViewScene(sceneType: string): Message[] {
    return [this.createCasualImageMessage(IMAGE_MAP.get(sceneType))];
  }

  private async handleAnswerAttempt(
    user: UsersEntity,
    problem: ProblemsEntity,
    answer: string,
  ): Promise<Message[]> {
    if (answer !== problem.answer) {
      return [this.createTextMessage(problem.error_message)];
    }
    user.chapter += 1;
    await this.usersRepository.save(user);
    const nextProblem = await this.problemsRepository.findOne({
      where: { number: user.chapter },
    });
    if (nextProblem) {
      return [
        this.createTextMessage('恭喜你答對了！'),
        ...this.createProblemMessage(nextProblem),
        ...(nextProblem.image
          ? [this.createImageMessage(nextProblem.image)]
          : []),
      ];
    }
    return this.createFinishedMessage();
  }
}
