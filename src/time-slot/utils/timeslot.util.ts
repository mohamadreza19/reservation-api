import { Repository } from 'typeorm';
import { Timeslot } from '../entities/time-slot.entity';
import { TimeSlotStatus } from 'src/common/enums/time-slot-status.enum';

function findLastFromCurrent(repo: Repository<Timeslot>) {}

export function futureTimeslotCondition(alias = 'timeslot'): string {
  return `(${alias}."date" || ' ' || ${alias}."tEnd")::timestamp > NOW()`;
}

export function noEmployeeCondition(alias = 'timeslot'): string {
  return `${alias}."employeesId" IS NULL`;
}
export function statusInCondition(
  statuses: TimeSlotStatus[],
  alias = 'timeslot',
): string {
  const statusList = statuses.map((s) => `'${s}'`).join(', ');
  return `${alias}.status IN (${statusList})`;
}
