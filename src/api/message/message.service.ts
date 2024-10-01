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

  async createUser(
    userId: string,
  ): Promise<{ displayName: string; pictureUrl: string }> {
    try {
      const profile = await getProfile(userId);
      await this.usersRepository.save({
        line_id: userId,
        name: profile.displayName,
        picture_url: profile.pictureUrl,
        chapter: 1,
      });
      return {
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
      };
    } catch (error) {
      logger.error(`Failed to create user: ${error.message}`);
      throw error;
    }
  }

  async handleFollow(userId: string): Promise<Message[]> {
    try {
      const { displayName, pictureUrl } = await this.createUser(userId);
      const problem = await this.problemsRepository.findOne({
        where: { number: 1 },
      });

      return [
        this.createWelcomeFlexMessage(displayName, pictureUrl),
        this.createProblemMessage(problem),
        ...(problem.image ? [this.createImageMessage(problem.image)] : []),
      ];
    } catch (error) {
      logger.error(`Error handling follow event: ${error.message}`);
      return [this.createErrorMessage(error)];
    }
  }

  async handleTextMessage(
    userId: string,
    message: TextEventMessage,
  ): Promise<Message[]> {
    try {
      const user = await this.usersRepository.findOne({
        where: { line_id: userId },
      });
      const problem = await this.problemsRepository.findOne({
        where: { number: user.chapter },
      });
      const { text } = message;

      switch (text) {
        case '查看目前題目':
          return this.handleViewCurrentProblem(problem);
        case '查看客廳場景':
        case '查看主臥場景':
          return this.handleViewScene(text);
        default:
          return this.handleAnswerAttempt(user, problem, text);
      }
    } catch (error) {
      logger.error(`Error handling text message: ${error.message}`);
      return [this.createErrorMessage(error)];
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
            await replyMessage(event.replyToken, messages);
            break;
          default:
            return;
        }
      } catch (error) {
        logger.error(error.message);
        messages = [
          { type: 'text', text: '出了點小意外, 請先封鎖再解除封鎖後再試一次' },
        ];
      }
      if ('replyToken' in event && event.replyToken) {
        await replyMessage(event.replyToken, messages);
      }
    }
  }

  private createWelcomeFlexMessage(
    displayName: string,
    pictureUrl: string,
  ): Message {
    return {
      type: 'flex',
      altText: '歡迎加入',
      contents: {
        type: 'bubble',
        hero: {
          type: 'image',
          url: pictureUrl,
          size: 'full',
          aspectRatio: '20:13',
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
              text: '歡迎來到密室逃脫遊戲！',
              wrap: true,
            },
          ],
        },
      },
    };
  }
  private createProblemMessage(problem: ProblemsEntity): Message {
    return {
      type: 'text',
      text: `題目：${problem.question}`,
    };
  }

  private createImageMessage(imageUrl: string): Message {
    return {
      type: 'image',
      originalContentUrl: imageUrl,
      previewImageUrl: imageUrl,
    };
  }
  private createErrorMessage(error: Error): Message {
    return {
      type: 'text',
      text: `發生錯誤：${error.message}`,
    };
  }

  private handleViewCurrentProblem(problem: ProblemsEntity): Message[] {
    const messages: Message[] = [this.createProblemMessage(problem)];
    if (problem.image) {
      messages.push(this.createImageMessage(problem.image));
    }
    return messages;
  }

  private handleViewScene(sceneType: string): Message[] {
    const images =
      sceneType === '查看客廳場景' ? LIVING_ROOM_IMAGES : BEDROOM_IMAGES;
    return images.map((imageUrl) =>
      this.createImageMessage(IMAGE_MAP[imageUrl]),
    );
  }

  private async handleAnswerAttempt(
    user: UsersEntity,
    problem: ProblemsEntity,
    answer: string,
  ): Promise<Message[]> {
    if (answer === problem.answer) {
      const nextProblem = await this.problemsRepository.findOne({
        where: { number: user.chapter + 1 },
      });
      if (nextProblem) {
        user.chapter += 1;
        await this.usersRepository.save(user);
        return [
          { type: 'text', text: '恭喜你答對了！' },
          this.createProblemMessage(nextProblem),
          ...(nextProblem.image
            ? [this.createImageMessage(nextProblem.image)]
            : []),
        ];
      } else {
        return [{ type: 'text', text: '恭喜你完成了所有題目！' }];
      }
    } else {
      return [{ type: 'text', text: '很抱歉，答案不正確。請再試一次！' }];
    }
  }
}
