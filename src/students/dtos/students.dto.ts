import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
export class StudentDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  desc: string;
  @IsOptional() // 选填字段校验
  @IsNumber()
  sex: number;
}
