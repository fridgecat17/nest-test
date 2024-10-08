import { UserStatusDTO } from './../user/dto/user-status.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { jwtConstants } from './constans';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // 验证用户有效性，这个在local策略里用到
  async validateUser(loginUserDto: LoginUserDto): Promise<any> {
    const username = loginUserDto.username;
    const password = loginUserDto.password;
    if (!username || !password) {
      throw new BadRequestException('user is required!');
    }
    // 去数据库查找该user
    const user = await this.userService.findLoginUser(username);
    if (!user) {
      throw new BadRequestException('user not found!');
    }
    const isValidPwd = await bcrypt.compare(password, user.password);
    if (!isValidPwd) {
      throw new BadRequestException('password is not valid!');
    }
    const sanitizedUser = {
      id: user.id,
      username: user.username,
      memo_count: user.memo_count,
      day_count: user.day_count,
      tag_count: user.tag_count,
      month_sign_id: user.month_sign_id,
      last_login: user.last_login,
    };
    return sanitizedUser;
  }

  // 登录接口服务层
  async login(userInfo: UserStatusDTO) {
    const token = this.createToken(userInfo);
    return {
      userInfo,
      ...token,
    };
  }
  createToken({ username, id: userId }: UserStatusDTO) {
    const payload = { username, userId };
    const token = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
    });
    const expires = process.env.expiresTime;

    return {
      token,
      expires,
    };
  }
}
