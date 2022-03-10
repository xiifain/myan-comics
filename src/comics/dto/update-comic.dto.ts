import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { CreateComicDto } from './create-comic.dto';

export class UpdateComicDto extends PartialType(CreateComicDto) {

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
