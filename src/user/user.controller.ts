import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseInterceptors,
  ParseFilePipe,
  UploadedFile,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { AuthWithRoles } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthUser } from 'src/common/decorators/business.decorators';
import { User } from './entities/user.entity';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UpdateProfileDto, UpdateProfileImg } from './dto/profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }
  @Get('profile')
  @AuthWithRoles([Role.BUSINESS_ADMIN, Role.CUSTOMER, Role.EMPLOYEE])
  @ApiOperation({ operationId: 'findUserProfile' })
  @ApiOkResponse({
    type: () => UpdateProfileDto,
  })
  findProfile(@AuthUser() user: User) {
    return this.userService.getProfile(user.id);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.userService.findOne(+id);
  }

  @Patch('profile')
  @AuthWithRoles([Role.EMPLOYEE, Role.CUSTOMER, Role.BUSINESS_ADMIN])
  updateProfile(@AuthUser() user: User, @Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(user, dto);
  }
  @Put('profile/img')
  @AuthWithRoles([Role.EMPLOYEE, Role.CUSTOMER, Role.BUSINESS_ADMIN])
  @UseInterceptors(FileInterceptor('img'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        img: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  updateProfileImg(
    @AuthUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }), // allow only images
        ],
      }),
    )
    img: Express.Multer.File,
  ) {
    return this.userService.updateProfileImg(user, img);
  }

  @Delete('profile/img')
  @AuthWithRoles([Role.EMPLOYEE, Role.CUSTOMER, Role.BUSINESS_ADMIN])
  remove(@AuthUser() user: User) {
    return this.userService.deleteProfileImg(user);
  }
}
