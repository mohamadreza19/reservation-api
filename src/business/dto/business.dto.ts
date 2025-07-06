import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/entities/user.entity';

export class CreateBusinessDto {
  @ApiProperty()
  @IsOptional()
  address: string;
  @ApiProperty()
  @IsOptional()
  name: string;
}

export class UpdateBusinessDto extends PartialType(CreateBusinessDto) {}

export class PublicBusinessDto {
  @ApiProperty({
    description: 'The unique identifier of the business',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'The name of the business',
    example: 'Example Coffee Shop',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'The address of the business',
    example: '123 Main Street, City, Country',
    type: String,
  })
  address: string;
}

export class BusinessProfileDto {
  @ApiProperty({ example: 'uuid-value' })
  id: string;

  @ApiProperty({ example: 'Acme Corp', required: false, nullable: true })
  name: string;

  @ApiProperty({ example: '123 Main St', required: false, nullable: true })
  address: string;

  @ApiProperty({ type: () => CreateUserDto })
  userInfo: CreateUserDto;
}

export class BusinessLink {}
