import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { StudentsController } from './students/students.controller';
import { StudentsModule } from './students/students.module';
// import { StudentsService } from './students/students.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserGuard } from './common/guards/user.guard'; // 全局挂载守卫
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { SensitiveController } from './sensitive/sensitive.controller';
import { SensitiveModule } from './sensitive/sensitive.module';
import { SensitiveInterceptor } from './common/interceptors/sensitive.interceptor';
import { ClassModule } from './class/class.module';
import { RedisService } from './redis/redis.service';
import { RedisModule } from './redis/redis.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { JwtService } from '@nestjs/jwt';
import App_globalConfig from './config/configuration';
import DatabaseConfig from './config/database';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [App_globalConfig, DatabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ClassModule],
      useFactory: async () => {
        return {
          type: 'mysql',
          host: DatabaseConfig().host,
          port: Number(DatabaseConfig().port),
          username: DatabaseConfig().username,
          password: DatabaseConfig().password,
          database: DatabaseConfig().database,
          autoLoadEntities: true,
          synchronize: true, // 数据库自动同步entity文件修改
        };
      },
      inject: [ConfigService],
    }),
    StudentsModule,
    ClassModule,
    SensitiveModule,
    ClassModule,
    RedisModule,
    AuthModule,
    UserModule,
  ],
  controllers: [
    AppController,
    SensitiveController,
    AuthController,
    UserController,
  ],
  providers: [
    // 全局挂载守卫
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // 全局挂载拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: SensitiveInterceptor,
    },
    AppService,
    RedisService,
    AuthService,
    UserService,
    JwtService,
  ],
})
export class AppModule {}
