import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as _ from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
  async findUser(id: UserEntity['id']) {
    return await this.userRepository.findOneBy({ id });
  }

  async register(createUserDto: CreateUserDto) {
    const username = createUserDto.username;
    const password = createUserDto.password;
    const userDO = {
      username,
      password,
      memo_count: 0,
      day_count: 0,
      tag_count: 0,
      month_sign_id: 0,
      last_login: '',
    };
    try {
      const user = this.userRepository.create(userDO);
      const result = await this.userRepository.save(user);
      if (_.isEmpty(result)) {
        return user;
      }

      return {
        code: 0,
        data: result,
        msg: 'success',
      };
    } catch (error) {
      throw error instanceof QueryFailedError
        ? new HttpException('用户名已存在', HttpStatus.BAD_REQUEST)
        : error;
    }
  }

  async recordLogin(userId: string) {
    const last_login = new Date().toISOString();

    return await this.userRepository.update(userId, {
      last_login,
    });
  }

  findLoginUser(username: string) {
    return this.userRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password', 'nickname', 'last_login'],
    });
  }
  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const userDo = {
      nickname: updateUserDto.nickname,
    };
    const res = (await this.userRepository.update({ id: userId }, userDo)) as {
      affected: number;
    };
    return res.affected >= 0;
  }
}
