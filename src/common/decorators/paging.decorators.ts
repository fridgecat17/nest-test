import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const paging = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;
    if (!query.current || query.current < 1) query.current = 1;
    if (!query.size || query.size < 10) query.size = 10;
    if (!query.pageType && query.pageType !== 0) query.pageType = 1;
    return {
      current: Number(query.current),
      size: Number(query.size),
      pageType: Number(query.pageType),
    };
  },
);
