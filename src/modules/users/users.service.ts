import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { handleError } from 'src/utils/handle-errors';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getUsers(search: string) {
    try {
      const users = search
        ? await this.userRepository.find({
            where: [
              { firstName: ILike(`%${search}%`) },
              { lastName: ILike(`%${search}%`) },
            ],
            select: ['id', 'firstName', 'lastName'],
          })
        : await this.userRepository.find({
            select: ['id', 'firstName', 'lastName'],
          });

      const usersResponse = users.map(async (user) => ({
        userName: `${user.firstName} ${user.lastName}`,
        id: user.id,
      }));

      return usersResponse;
    } catch (error) {
      handleError(error);
    }
  }

  async getUser(id: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new NotFoundException('User Not Found');
      return user;
    } catch (error) {
      handleError(error);
    }
  }

  async loginUser(email: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) throw new NotFoundException('User Not Found');
      return user;
    } catch (error) {
      handleError(error);
    }
  }
}
