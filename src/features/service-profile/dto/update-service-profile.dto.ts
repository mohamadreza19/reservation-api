import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceProfileDto } from './create-service-profile.dto';

export class UpdateServiceProfileDto extends PartialType(CreateServiceProfileDto) {}
