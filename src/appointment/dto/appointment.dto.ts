import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'The unique identifier of the service being booked',
    example: '987fcdeb-1a2b-3c4d-5e6f-789abcdef123',
    type: String,
  })
  @IsNotEmpty()
  @IsUUID()
  serviceId: string;

  @ApiProperty({
    description: 'The unique identifier of the timeslot for the appointment',
    example: '456789ab-cdef-1234-5678-901234567890',
    type: String,
  })
  @IsNotEmpty()
  @IsUUID()
  timeslotId: string;
}
