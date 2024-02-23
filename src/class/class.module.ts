import { Module } from '@nestjs/common';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classes } from './entities/classes.entity';
import { Student } from '../students/entities/students.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Classes, Student])],
  controllers: [ClassController],
  providers: [ClassService, Classes],
  exports: [ClassService],
})
export class ClassModule {}
