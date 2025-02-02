import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { PusherService } from './pusher.service';
import { query, Request, Response, response } from 'express';

@Controller('pusher')
export class PusherController {
  constructor(private readonly pusherService: PusherService) {}
  @Post('new-message')
  async postMessage(
    @Body()
    body: {
      channelName: string;
      userId: string;
      message: string;
      eventName: string;
      auth: string
    },
  ) {
    return await this.pusherService.postMessage(body);
  }

  @Get('messages')
  async getAllChannelMessages(@Query() query: { channelName: string }) {
    return await this.pusherService.getAllChannelMessages(query.channelName);
  }

  @Post('auth')
  async auth(
    @Body() body: { channel_name: string; socket_id: string; user_id: string },
    @Res() response: Response,
  ) {
    response
      .status(200)
      .json(
        await this.pusherService.authenticateUser(
          body.channel_name,
          body.socket_id,
          body.user_id,
        ),
      );
  }
}
