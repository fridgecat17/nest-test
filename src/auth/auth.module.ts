import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: '123', // 设置私钥
      signOptions: { expiresIn: '24h' }, // 过期时间
    }),
  ],
  controllers: [AuthController],
  // 注入策略模块
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
