import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BusinessScheduleService } from './business-schedule.service';
import { CreateBusinessScheduleDto } from './dto/create-business-schedule.dto';
import { UpdateBusinessScheduleDto } from './dto/update-business-schedule.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth-guard';
import { UserRole } from 'src/shared/types/user-role.enum';
import { UserSerializeRequest } from 'src/shared/types/user-serialize-request.interface';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';

@ApiTags('BusinessSchedule-V1')
@Controller('business-schedule/v1')
export class BusinessScheduleController {
  constructor(
    private readonly businessScheduleService: BusinessScheduleService,
  ) {}
  @Roles(UserRole.Business)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth(UserRole.Business)
  @Post()
  create(
    @Req() req: UserSerializeRequest,
    @Body() createBusinessScheduleDto: CreateBusinessScheduleDto,
  ) {
    return this.businessScheduleService.create(
      createBusinessScheduleDto,
      req.user,
    );
  }

  @Get()
  findAll() {
    return this.businessScheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessScheduleService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBusinessScheduleDto: UpdateBusinessScheduleDto,
  ) {
    return this.businessScheduleService.update(+id, updateBusinessScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.businessScheduleService.remove(+id);
  }
}
