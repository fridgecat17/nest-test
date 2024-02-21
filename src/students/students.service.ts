import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { StudentDto } from './dtos/students.dto';
import { Student } from './entities/students.entity';
import { Classes } from './entities/classes.entity';
import { Body } from '@nestjs/common';
@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Classes)
    private readonly classRepository: Repository<Classes>,
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
      .orderBy('createDate', 'DESC')
      .skip(pageType ? (current - 1) * size : 1)
      .take(pageType ? size : 999)
      .getManyAndCount();
    return {
      list: results[0],
      total: results[1],
      size,
      current,
      pages: Math.ceil(results[1] / size),
    };
  }
  // 更新学生信息
  async updatedStudent(@Body() userInfo: StudentDto, uid: number) {
    const results = this.studentRepository
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
    const results = this.studentRepository.save({
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
  async setClass(name: string, studentIds: number[]) {
    const students = await this.studentRepository.find({
      where: studentIds.map((id) => ({ id })),
    });
    const result = await this.classRepository.save({
      className: name,
      students: students,
    });
    return result;
  }
  async findClass(id: number) {
    const result = await this.classRepository.find({
      where: { id },
      relations: ['students'],
    });
    return result;
  }
}
