import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthWithRoles } from 'src/common/decorators/auth.decorator';
import { AuthUser } from 'src/common/decorators/business.decorators';
import { Entities } from 'src/common/enums/entities.enum';
import { Role } from 'src/common/enums/role.enum';
import { User } from 'src/user/entities/user.entity';
import { FileService } from './file.service';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(':entity/:id')
  @AuthWithRoles([Role.BUSINESS_ADMIN, Role.CUSTOMER])
  @ApiOperation({ operationId: 'files_get' })
  @ApiParam({ name: 'entity', enum: Entities, description: 'Entity type' })
  @ApiOkResponse({
    description: 'File stream response',
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  async getFile(
    @Param('entity') entity: string,
    @Param('id') id: string,
    @AuthUser() user: User,
    @Res() res: Response,
  ) {
    const file = await this.fileService.getFileStream({ entity, id, user });

    const headers = file.getHeaders();
    res.setHeader('Content-Type', headers.type);
    res.setHeader('Content-Disposition', headers.disposition as any);

    file.getStream().pipe(res);
  }

  @Post(':entity/:id')
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  @ApiOperation({ operationId: 'files_upload' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'entity', enum: Entities, description: 'Entity type' })
  @ApiParam({ name: 'id', type: String, description: 'Entity ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('entity') entity: string,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @AuthUser() user: User,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    await this.fileService.saveFile({ entity, id, file, user });
    return {
      message: 'File uploaded successfully',
      entity,
      id,
      filename: file.originalname,
    };
  }
}
