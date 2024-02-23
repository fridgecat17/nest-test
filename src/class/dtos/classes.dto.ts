import { IsNotEmpty, IsString } from 'class-validator';
export class ClassesDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  userIds: number[];
}
