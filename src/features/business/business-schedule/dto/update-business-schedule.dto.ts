import { PartialType } from '@nestjs/swagger';
import { CreateBusinessScheduleDto } from './create-business-schedule.dto';

export class UpdateBusinessScheduleDto extends PartialType(
  CreateBusinessScheduleDto,
) {}
