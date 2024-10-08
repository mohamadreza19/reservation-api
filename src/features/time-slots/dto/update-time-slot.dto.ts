import { PartialType } from '@nestjs/swagger';
import { CreateTimeSlotDto } from './create-time-slot.dto';

export class UpdateTimeSlotDto extends PartialType(CreateTimeSlotDto) {}
