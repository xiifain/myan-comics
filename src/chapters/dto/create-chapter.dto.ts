import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
export class CreateChapterDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsNumber()
  @IsPositive()
  comic: number;
}