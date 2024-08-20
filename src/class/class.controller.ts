import {
  Body,
  Controller,
  Get,
  Post,
  // Query,
  Param,
  ParseIntPipe,
  // DefaultValuePipe,
  Delete,
  Put,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassesDto } from './dtos/classes.dto';
import { paging } from 'src/common/decorators/paging.decorators';
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}
  @Get('getClassList')
  getClass(
    // @Query('current', new DefaultValuePipe(1), ParseIntPipe) current: number,
    // @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
    // @Query('name') name: string,
    // @Query('pageType', new DefaultValuePipe(1), ParseIntPipe) pageType: number,
    @paging()
    query: {
      name: string;
      current?: number;
      size?: number;
      pageType?: number;
    },
  ) {
    return this.classService.getClassList(
      query.current,
      query.size,
      query.pageType,
      query.name,
    );
  }
  @Post('set-class')
  setClass(@Body() classes: ClassesDto) {
    return this.classService.setClass(classes.name, classes.userIds);
  }
  // 更新编辑
  @Put(':id')
  updatedClass(
    @Body() classes: ClassesDto,
    @Param('id', ParseIntPipe) uid: number,
  ) {
    return this.classService.updatedClass(classes, uid);
  }
  // 删除
  @Delete(':id')
  removeClass(@Param('id', ParseIntPipe) uid: number) {
    return this.classService.removeClass(uid);
  }
}
