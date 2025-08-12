import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UserProfileDto } from './dto/user.dto';
import { AuthWithRoles } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthUser } from 'src/common/decorators/business.decorators';
import { User } from './entities/user.entity';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

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
  @AuthWithRoles([Role.BUSINESS_ADMIN, Role.CUSTOMER])
  @ApiOperation({
    operationId: 'user_profile',
  })
  @ApiOkResponse({
    type: () => UserProfileDto,
  })
  findProfile(@AuthUser() user: User) {
    return this.userService.getProfile(user.id);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.userService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateCustomerDto) {
  //   // return this.userService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.userService.remove(+id);
  }
}
