import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entity/message.entity';
import { ConfigModule } from '@nestjs/config';
import { User } from '../users/entity/user.entity';
import { PusherController } from './pusher.controller';
import { PusherService } from './pusher.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User]), ConfigModule],
  controllers: [PusherController],
  providers: [PusherService],
})
export class PusherModule {}
