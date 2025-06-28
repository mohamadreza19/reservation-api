import {
  Controller,
  Get,
  Post,
  Param,
  Res,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileService } from './file.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(':entity/:id')
  async getFile(
    @Param('entity') entity: string,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const file = await this.fileService.getFileStream(entity, id);
    file.getStream().pipe(res);
  }

  @Post(':entity/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('entity') entity: string,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    await this.fileService.saveFile(entity, id, file);
    return {
      message: 'File uploaded successfully',
      entity,
      id,
      filename: file.originalname,
    };
  }
}
