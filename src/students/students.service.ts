import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { StudentDto } from './dtos/students.dto';
import { Student } from './entities/students.entity';
import { Body } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly redisService: RedisService,
  ) {}
  private readonly logger = new Logger(StudentsService.name);
  // 详情
  ImStudent(user: string, name?: string) {
    this.logger.log(`student name is ${name}`);
    return 'Im student, ' + name + '! from request => ' + user;
  }
  async getImStudentName(id: number) {
    this.logger.log(`get student id is ${id}`);
    const results = await this.studentRepository.find({ where: { id } });
    return results ?? 'not found';
  }
  // 列表
  async getImStudentList(
    current: number,
    size: number,
    name: string,
    user: string,
    pageType: number,
  ) {
    // 查询表列表
    // 分页查询
    const results = await this.studentRepository
      .createQueryBuilder('student')
      .where('student.isDel = :isDel', { isDel: false })
      .andWhere(
        new Brackets((qb) => {
          if (name) {
            return qb.where('student.name LIKE :name', {
              name: `%${name}%`,
            });
          } else {
            return qb;
          }
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          if (user) {
            return qb.andWhere('student.user LIKE :user', {
              user: `%${user}%`,
            });
          } else {
            return qb;
          }
        }),
      )
      //连表查询
      .leftJoinAndSelect('student.class', 'class')
      .select('student')
      .addSelect('class')
      .orderBy('student.createDate', 'DESC')
      .skip(pageType === 1 ? (current - 1) * size : 0)
      .take(pageType === 1 ? size : undefined)
      .getManyAndCount();
    // 使用redis
    await this.redisService.setValue('test', JSON.stringify(results[0]));
    return {
      list: results[0],
      total: results[1],
      size: pageType === 1 ? size : undefined,
      current: pageType === 1 ? current : undefined,
      pageType,
      pages: pageType === 1 ? Math.ceil(results[1] / size) : undefined,
    };
  }
  // 软删除
  async removeStudent(uid: number) {
    const results = await this.studentRepository
      .createQueryBuilder('student')
      .update(Student)
      .set({
        isDel: true,
      })
      .where('id = :id', { id: uid })
      .execute();
    return {
      code: 0,
      data: results,
      msg: 'success',
    };
  }
  // 更新学生信息
  async updatedStudent(@Body() userInfo: StudentDto, uid: number) {
    const results = await this.studentRepository
      .createQueryBuilder('student')
      .update(Student)
      .set({
        name: userInfo.name,
        user: userInfo.user,
        desc: userInfo.desc,
        sex: userInfo.sex,
      })
      .where('id = :id', { id: uid })
      .execute();
    return {
      code: 0,
      data: results,
      msg: 'success',
    };
  }
  // 添加
  async setStudent(@Body() userInfo: StudentDto) {
    const results = await this.studentRepository.save({
      name: userInfo.name,
      user: userInfo.user,
      desc: userInfo.desc,
      sex: userInfo.sex,
    });
    return {
      code: 0,
      data: results,
      msg: 'success',
    };
  }
}
