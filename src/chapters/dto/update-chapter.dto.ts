import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { CreateChapterDto } from './create-chapter.dto';

export class UpdateChapterDto extends PartialType(CreateChapterDto) {

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    name?: string;
  
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    description?: string;
  
    @IsNumber()
    @IsOptional()
    @IsPositive()
    comic?: number;
}
