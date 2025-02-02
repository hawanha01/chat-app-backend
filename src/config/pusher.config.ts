import { ConfigService } from '@nestjs/config';
import * as Pusher from 'pusher';

const configService = new ConfigService();

const pusherServer = new Pusher({
  appId: '1933353',
  key: 'a5c2c9818880596e17dc',
  secret: '411b83b8858eae95bc05',
  cluster: 'ap2',
  useTLS: true,
});

export default pusherServer;
