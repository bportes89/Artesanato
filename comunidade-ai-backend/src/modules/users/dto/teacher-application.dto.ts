import { IsString, Length } from 'class-validator';

export class TeacherApplicationDto {
  @IsString()
  @Length(2, 120)
  name!: string;

  @IsString()
  @Length(2, 120)
  city!: string;

  @IsString()
  @Length(2, 160)
  technique!: string;

  @IsString()
  @Length(2, 160)
  experience!: string;

  @IsString()
  @Length(8, 32)
  whatsapp!: string;
}
