import { Injectable, NotFoundException } from '@nestjs/common';
import { Classes } from './entities/classes.entity';
import { Student } from '../students/entities/students.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, In } from 'typeorm';
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
      .skip(pageType === 1 ? (current - 1) * size : 0)
      .take(pageType === 1 ? size : undefined)
      .getManyAndCount();
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
  async updatedClass(@Body() classInfo: ClassesDto, classId: number) {
    // 查找班级
    const classToUpdate = await this.classRepository.findOne({
      where: { id: classId },
      relations: ['students'],
    });

    if (!classToUpdate) {
      throw new NotFoundException('未找到指定班级');
    }

    // 更新班级名称
    classToUpdate.className = classInfo.name;

    // 如果提供了学生ID,则更新学生列表
    if (classInfo.userIds.length > 0) {
      classToUpdate.students = await this.studentRepository.findBy({
        id: In(classInfo.userIds),
      });
    } else {
      classToUpdate.students = [];
    }
  }
}
