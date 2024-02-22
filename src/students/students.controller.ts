import {
  // UseGuards,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
// import { UserGuard } from '../common/guards/user.guard'; // 单个接口使用守卫
import { StudentDto } from './dtos/students.dto';
import { StudentsService } from './students.service';
import { User, NoUser } from 'src/common/decorators';
import { ClassesDto } from './dtos/classes.dto';
import { SensitiveOperation } from '../common/decorators';
import { SensitiveType } from '../sensitive/constants';
import { TransformNamePipe } from '../common/pipes/name.pipes';
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}
  @Get('who-are-you')
  whoAreYou(
    @Query('name', TransformNamePipe) name: string,
    @Query('user') user: string,
  ) {
    return this.studentsService.ImStudent(user, name);
  }
  // @UseGuards(UserGuard) // 单个接口使用守卫
  @NoUser() // 自定义装饰器过滤守卫
  @Post('who-are-you-post')
  whoAreYouPost(@User() user: string, @Body() student: StudentDto) {
    return this.studentsService.ImStudent(user, student.name);
  }
  @Get('get-name-by-id')
  getNameById(@Query('id', ParseIntPipe) id: number) {
    return this.studentsService.getImStudentName(id);
  }
  // 查询列表
  @Get('getStudentList')
  getImStudentList(
    @Query('current', ParseIntPipe) current: number,
    @Query('size', ParseIntPipe) size: number,
    @Query('name') name: string,
    @Query('user') user: string,
    @Query('pageType', ParseIntPipe) pageType: number,
  ) {
    return this.studentsService.getImStudentList(
      current,
      size,
      name,
      user,
      pageType,
    );
  }
  // 删除
  @Delete(':id')
  removeStudent(@Param('id', ParseIntPipe) uid: number) {
    return this.studentsService.removeStudent(uid);
  }
  // 更新编辑
  @Post(':id')
  updateStudent(
    @Body() student: StudentDto,
    @Param('id', ParseIntPipe) uid: number,
  ) {
    return this.studentsService.updatedStudent(student, uid);
  }
  // 添加
  @SensitiveOperation(SensitiveType.Set)
  @Post('set-student')
  setStudentName(@Body() student: StudentDto) {
    return this.studentsService.setStudent(student);
  }
  @Post('who-is-request')
  whoIsReq(@User() user: string) {
    return user;
  }
  @Get('get-class')
  getClass(@Query('id', ParseIntPipe) id: number) {
    return this.studentsService.findClass(id);
  }
  @Post('set-class')
  setClass(@Body() classes: ClassesDto) {
    return this.studentsService.setClass(classes.className, classes.students);
  }
}
