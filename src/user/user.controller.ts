import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  // Req,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../user/user.decorator';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { Public } from 'src/common/decorators/public.decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @Public()
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.userService.register(createUserDto);
  }
  //鉴权
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async me(@User('id') userId: string) {
    const userInfo = await this.userService.findUser(userId);
    return {
      userInfo,
    };
  }
  //鉴权
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@User('id') userId, @Body() userDto: UpdateUserDto) {
    return await this.userService.updateUser(userId, userDto);
  }
}
