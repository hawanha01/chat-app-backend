import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entity/message.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entity/user.entity';
import pusherServer from 'src/config/pusher.config';
import { handleError } from 'src/utils/handle-errors';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PusherService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}
  async postMessage(body: {
    channelName: string;
    userId: string;
    message: string;
    eventName: string;
    auth: string;
  }) {
    try {
      const { channelName, userId, message, eventName, auth } = body;
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User NotFound');
      const newMessage = this.messageRepository.create({
        channelName,
        user,
        content: message,
      });
      const messageResponse = await this.messageRepository.save(newMessage);
      await pusherServer.trigger(channelName, eventName, {
        channelName: channelName,
        content: message,
        createdAt: messageResponse.createdAt,
        user: { userName: `${user.firstName} ${user.lastName}`, id: user.id },
      });

      return {
        channelName: messageResponse.channelName,
        content: messageResponse.content,
        createdAt: messageResponse.createdAt,
        user: {
          userName: `${messageResponse.user.firstName} ${messageResponse.user.lastName}`,
          id: messageResponse.user.id,
        },
      };
    } catch (error) {
      handleError(error);
    }
  }

  async getAllChannelMessages(channelName: string) {
    try {
      const [messages, total] = await this.messageRepository.findAndCount({
        where: { channelName },
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });
      const response =
        messages && messages.length > 0
          ? messages.map((message) => ({
              channelName: message.channelName,
              content: message.content,
              createdAt: message.createdAt,
              user: {
                userName: `${message.user.firstName} ${message.user.lastName}`,
                id: message.user.id,
              },
            }))
          : [];
      return response;
    } catch (error) {
      handleError(error);
    }
  }

  async authenticateUser(
    channel_name: string,
    socket_id: string,
    user_id: string,
  ) {
    try {
      const user = user_id
        ? await this.userRepository.findOne({
            where: { id: user_id },
          })
        : null;
      if (!user) throw new NotFoundException('User Not found');
      if (user) {
        const channelData = {
          user_id: user.id,
          user_info: {
            name: `${user.firstName} ${user.lastName}`,
          },
        };

        const response = pusherServer.authorizeChannel(
          socket_id,
          channel_name,
          channelData,
        );
        return response;
      }
    } catch (error) {
      handleError(error);
    }
  }
}
