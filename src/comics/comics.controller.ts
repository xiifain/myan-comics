import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpException,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ComicsService } from './comics.service';
import { CreateComicDto } from './dto/create-comic.dto';
import { UpdateComicDto } from './dto/update-comic.dto';
import { Comic } from './entities/comic.entity';

@Controller('comics')
export class ComicsController {
  constructor(private readonly comicsService: ComicsService) {}

  @Post()
  create(@Body() createComicDto: CreateComicDto) {
    return this.comicsService.create(createComicDto);
  }

  @Get()
  findAll() {
    return this.comicsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.comicsService.findOne(+id).catch(() => {
      throw new HttpException(`Comic with ID ${+id} doesn\'t exists`, HttpStatus.NOT_FOUND);
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComicDto: UpdateComicDto) {
    return this.comicsService.update(+id, updateComicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comicsService.remove(+id);
  }

  @Patch(':id/image')
  @UseInterceptors(FileInterceptor('image'))
  updateImage(@Param('id') id: string, @UploadedFile() image: Express.Multer.File) {
    if ( image === undefined ) {
      throw new HttpException('Image File cannot be empty', HttpStatus.BAD_REQUEST);
    } else {
      let updateImageDto = {
        image: `${process.env.SERVER_URL}${image.path}`
      }
      return this.comicsService.update(+id, updateImageDto)
    }
  }
}
