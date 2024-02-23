import { Injectable } from '@nestjs/common';
import { Classes } from './entities/classes.entity';
import { Student } from '../students/entities/students.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Classes)
    private readonly classRepository: Repository<Classes>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}
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
}
