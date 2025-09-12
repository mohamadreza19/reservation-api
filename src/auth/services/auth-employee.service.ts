import { Injectable } from '@nestjs/common';
import { EmployeeService } from 'src/employee/employee.service';
import { Employee } from 'src/employee/entities/employee.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthEmployeeService {
  constructor(private readonly employeeService: EmployeeService) {}

  async ensureEmployeeForUser(user: User) {
    let employee: Employee | null;

    employee = await this.employeeService.findOneByUserId(user.id);

    if (employee) return;

    return await this.employeeService.createByUserId(user.id);
  }
}
