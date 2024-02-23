import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  ParseIntPipe,
  DefaultValuePipe,
  Delete,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassesDto } from './dtos/classes.dto';
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}
  @Get('getClassList')
  getClass(
    @Query('current', new DefaultValuePipe(1), ParseIntPipe) current: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
    @Query('name') name: string,
    @Query('pageType', new DefaultValuePipe(1), ParseIntPipe) pageType: number,
  ) {
    return this.classService.getClassList(current, size, pageType, name);
  }
  @Post('set-class')
  setClass(@Body() classes: ClassesDto) {
    return this.classService.setClass(classes.name, classes.userIds);
  }
}
