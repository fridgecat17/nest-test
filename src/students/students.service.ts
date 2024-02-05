import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ImStudent(user: string, name?: string) {
    this.logger.log(`student name is ${name}`);
    return {
      code: 0,
      data: 'Im student, ' + name + '! from request => ' + user,
    };
  }
  async getImStudentName(id: number) {
    this.logger.log(`get student id is ${id}`);
    // const ID_NAME_MAP = {
    //   1: 'tom',
    //   2: 'jerry',
    //   3: 'candy',
    //   4: 'valeria',
    // };
    const results = await this.studentRepository.find({ where: { id } });
    return results ?? 'not found';
  }
  async getImStudentList() {
    const results = await this.studentRepository.find();
    return {
      code: 0,
      data: results,
    };
  }
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
