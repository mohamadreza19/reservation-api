import { BadRequestException } from '@nestjs/common';

export class UnrelatedEmployeeIdsException extends BadRequestException {
  constructor(unrelatedEmployeeIds: number[]) {
    super(
      `The following employee IDs are unrelated to the specified business: ${unrelatedEmployeeIds.join(', ')}`,
    );
  }
}
