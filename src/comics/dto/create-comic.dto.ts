import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateComicDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description?: string;
}