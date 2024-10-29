import { Controller, Delete, Get } from '@nestjs/common';
import { AppointmentService } from './appointment.service';

@Controller('test')
export class TestController {
  constructor(private appointmentService: AppointmentService) {}

  @Get()
  test() {
    return this.appointmentService.testReminder();
  }
  @Get('all')
  testall() {
    return this.appointmentService.getAllJobs();
  }

  @Delete('deleteall')
  deleteAll() {
    return this.appointmentService.deleteAllJob();
  }
}
