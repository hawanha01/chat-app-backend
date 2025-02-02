import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('login')
  async loginUser(@Query() query: { email: string }) {
    return await this.userService.loginUser(query.email);
  }

  @Get()
  async getUsers(@Query() query: { search: string }) {
    return await this.userService.getUsers(query.search);
  }

  @Get('current')
  async getCurrentUser(@Query() query: { id: string }) {
    return await this.userService.getUser(query.id);
  }
}
