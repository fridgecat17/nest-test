import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserStatusDTO } from './../user/dto/user-status.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';

import {
  Controller,
  Get,
  Post,
  // Body,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Public } from 'src/common/decorators/public.decorators';

declare module 'express' {
  interface Request {
    user: UserStatusDTO;
  }
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 登录接口
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Public()
  async login(@Req() req: Request) {
    try {
      return this.authService.login(req.user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // 查询个人信息
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  me(@Req() req: Request) {
    return req.user;
  }
}
