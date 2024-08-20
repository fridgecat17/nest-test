import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { SensitiveType } from '../sensitive/constants';
// 装饰器
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest(); // 拿到请求
    return request.body.user;
  },
);
export const NoUser = () => SetMetadata('no-user', true);
export const SensitiveOperation = (type: SensitiveType) =>
  SetMetadata('sensitive-operation', type);
