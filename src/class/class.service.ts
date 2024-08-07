import { Injectable } from '@nestjs/common';
import { Classes } from './entities/classes.entity';
import { Student } from '../students/entities/students.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Body } from '@nestjs/common';
import { ClassesDto } from './dtos/classes.dto';
@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Classes)
    private readonly classRepository: Repository<Classes>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}
  async setClass(name: string, studentIds: number[]) {
    if (studentIds.length > 0) {
      const students = await this.studentRepository.find({
        where: studentIds.map((id) => ({ id })),
      });
      const result = await this.classRepository.save({
        className: name,
        students: students,
      });
      return result;
    } else {
      const result = await this.classRepository.save({
        className: name,
      });
      return result;
    }
  }
  // class查询
  async getClassList(
    current: number,
    size: number,
    pageType: number,
    name: string,
  ) {
    // 查询表列表
    // 分页查询
    const results = await this.classRepository
      .createQueryBuilder('class')
      .where('class.isDel = :isDel', { isDel: false })
      .andWhere(
        new Brackets((qb) => {
          if (name) {
            return qb.where('class.name LIKE :name', {
              name: `%${name}%`,
            });
          } else {
            return qb;
          }
        }),
      )
      // 连表查询
      .leftJoinAndSelect('class.students', 'student')
      .select('class')
      .addSelect('student')
      .orderBy('class.createDate', 'DESC')
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
  // 软删除
  async removeClass(uid: number) {
    const results = await this.classRepository
      .createQueryBuilder('class')
      .update(Classes)
      .set({
        isDel: true,
        students: [],
      })
      .where('id = :id', { id: uid })
      .execute();
    return {
      code: 0,
      data: results,
      msg: 'success',
    };
  }
  // 更新信息
  async updatedClass(@Body() userInfo: ClassesDto, uid: number) {
    let students = [];
    if (userInfo.userIds.length !== 0) {
      students = await this.studentRepository
        .createQueryBuilder('student')
        .where('student.id IN (:...ids)', { ids: userInfo.userIds })
        .getMany();
    }
    const classes = await this.classRepository
      .createQueryBuilder('class')
      .where('id = :id', { id: uid })
      .getOne();
    classes.className = userInfo.name;
    classes.students = students;
    await this.classRepository.save(classes);
    return {
      code: 0,
      msg: 'success',
    };
  }
}
