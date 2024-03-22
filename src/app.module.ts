import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { StudentsController } from './students/students.controller';
import { StudentsModule } from './students/students.module';
// import { StudentsService } from './students/students.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserGuard } from './common/guards/user.guard'; // 全局挂载守卫
import {
  // APP_GUARD,
  APP_INTERCEPTOR,
} from '@nestjs/core';
import { SensitiveController } from './sensitive/sensitive.controller';
import { SensitiveModule } from './sensitive/sensitive.module';
import { SensitiveInterceptor } from './common/interceptors/sensitive.interceptor';
import { ClassModule } from './class/class.module';
import { RedisService } from './redis/redis.service';
import { RedisModule } from './redis/redis.module';
@Module({
  imports: [
    StudentsModule,
    ClassModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'ADMINroot17+',
      database: 'school',
      autoLoadEntities: true,
      synchronize: true, // 数据库自动同步entity文件修改
    }),
    SensitiveModule,
    ClassModule,
    RedisModule,
  ],
  controllers: [AppController, SensitiveController],
  providers: [
    // 全局挂载守卫
    // {
    //   provide: APP_GUARD,
    //   useClass: UserGuard,
    // },
    // 全局挂载拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: SensitiveInterceptor,
    },
    AppService,
    RedisService,
  ],
})
export class AppModule {}
