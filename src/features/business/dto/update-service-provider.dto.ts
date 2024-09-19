import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceProviderDto } from './create-service-provider.dto';

export class UpdateServiceProviderDto extends PartialType(CreateServiceProviderDto) {}
