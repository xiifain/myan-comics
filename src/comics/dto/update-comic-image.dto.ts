import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateComicDto } from './create-comic.dto';

export class UpdateComicImageDto extends PartialType(CreateComicDto) {

    @IsString()
    @IsNotEmpty()
    image: string;
}
