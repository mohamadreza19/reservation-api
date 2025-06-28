import { PartialType } from '@nestjs/swagger';
import { CreateSwaggerDto } from './create-swagger.dto';

export class UpdateSwaggerDto extends PartialType(CreateSwaggerDto) {}
