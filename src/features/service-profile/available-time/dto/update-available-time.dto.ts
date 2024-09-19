import { PartialType } from '@nestjs/mapped-types';
import { CreateAvailableTimeDto } from './create-available-time.dto';

export class UpdateAvailableTimeDto extends PartialType(CreateAvailableTimeDto) {}
