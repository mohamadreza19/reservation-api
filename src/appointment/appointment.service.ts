// appointment.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, InsertResult, Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';

import { Timeslot } from '../time-slot/entities/time-slot.entity';
import { Customer } from '../customer/entities/customer.entity';
import { Service } from '../service/entities/service.entity';
import { User } from '../user/entities/user.entity';
import { Role } from '../common/enums/role.enum';
import {
  CreateAppointmentDto,
  // UpdateAppointmentDto,
} from './dto/appointment.dto';
import { TimeslotService } from 'src/time-slot/time-slot.service';
import { CustomerService } from 'src/customer/customer.service';
import { ServiceService } from 'src/service/service.service';
import { Business } from 'src/business/entities/business.entity';
import { BusinessService } from 'src/business/business.service';
import { AvailableDateRangeDto } from 'src/time-slot/dto/time-slot-dto';

import { TimeSlotStatus } from 'src/common/enums/time-slot-status.enum';
import { ReminderService } from 'src/reminder/reminder.service';
import { REMINDER_MINUTES_BEFORE } from '../common/constants/reminder.config';
import { TimeUtil } from '../common/utils/time.util';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    private readonly timeslotService: TimeslotService,
    private readonly customerService: CustomerService,
    private readonly serviceService: ServiceService,
    private readonly businessService: BusinessService,
    private readonly reminder: ReminderService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, user: User) {
    // Fetch related entities
    let business: Business | null;
    let customer: Customer | null;
    let service: Service | null;
    let timeslot: Timeslot | null;
    let appointmentInstance: Appointment | null;

    customer = await this.customerService.findByUserId(user.id);

    if (!customer) {
      throw new NotFoundException(`Customer not found`);
    }

    service = await this.serviceService.findOne(createAppointmentDto.serviceId);
    if (!service) {
      throw new NotFoundException(
        `Service with ID ${createAppointmentDto.serviceId} not found`,
      );
    }

    business = await this.businessService.findOne(service.business?.id as any);

    if (!business) throw BadRequestException;

    timeslot = await this.timeslotService.findOneById(
      createAppointmentDto.timeslotId,
    );

    if (!timeslot) {
      throw new NotFoundException(
        `Timeslot with ID ${createAppointmentDto.timeslotId} not found`,
      );
    }
    if (timeslot.status !== TimeSlotStatus.IDLE) {
      throw new BadRequestException('Selected timeslot is not available');
    }

    appointmentInstance = this.appointmentRepo.create({
      customer,
      service,
      timeslot,
      business,
    });
    return await this.dataSource.transaction(async (manager) => {
      // Step 1: Save the appointment

      const appointment = manager.create(Appointment, appointmentInstance);
      await manager.save(appointment);

      // Step 2: Set timeslot availability to false
      if (appointment.timeslot) {
        await manager.update(Timeslot, appointment.timeslot.id, {
          status: TimeSlotStatus.BOOKED,
        });
      }

      // Step 3: Schedule reminders
      const { date, startTime } = timeslot;
      const appointmentDateTime = TimeUtil.createAppointmentDateTime(
        date,
        startTime,
      );
      for (const minutesBefore of REMINDER_MINUTES_BEFORE) {
        const { delay } = TimeUtil.calculateReminderTime(
          appointmentDateTime,
          minutesBefore,
        );
        if (TimeUtil.shouldScheduleReminder(delay)) {
          console.log(REMINDER_MINUTES_BEFORE);
          await this.reminder.scheduleReminder(
            user.id,
            appointment.id,

            delay,
          );
        }
      }

      return appointment;
    });
  }
  async trigger() {
    this.reminder.scheduleReminder('qwe', 'appointmentId', 1000);
  }
  async getAll(query: AvailableDateRangeDto, user: User) {
    if (user.role === Role.BUSINESS_ADMIN) {
      const business = await this.businessService.findByUserId(user.id);

      if (!business) throw BadRequestException;

      const buildQuery = this.buildAppointmentQuery({
        businessId: business.id,
        query: query,
      });

      return buildQuery.getMany();
    }
    if (user.role === Role.CUSTOMER) {
      const customer = await this.customerService.findByUserId(user.id);
      if (!customer) throw BadRequestException;
      const buildQuery = this.buildAppointmentQuery({
        customerId: customer.id,
        query: query,
      });

      return buildQuery.getMany();
    }
  }
  buildAppointmentQuery(options: {
    businessId?: string;
    customerId?: string;
    query?: AvailableDateRangeDto; // e.g. '2025-06-27'
  }) {
    const qb = this.appointmentRepo.createQueryBuilder('appointment');

    qb.innerJoin('appointment.timeslot', 'timeslot')
      .innerJoin('appointment.service', 'service')
      .innerJoin('service.price', 'price')
      .innerJoin('appointment.customer', 'customer')
      .innerJoin('customer.userInfo', 'userInfo')
      .select([
        'appointment.id',
        'appointment.status',
        'timeslot',
        // 'service.id',
        'service.name',
        'price.amount',
      ]);

    if (options.businessId) {
      qb.andWhere('appointment.businessId = :businessId', {
        businessId: options.businessId,
      });
      qb.addSelect([
        'customer.id',
        'userInfo.id',
        'userInfo.userName',
        'userInfo.phoneNumber',
      ]);
    }

    if (options.customerId) {
      qb.andWhere('appointment.customerId = :customerId', {
        customerId: options.customerId,
      });
      qb.innerJoin('appointment.business', 'business');
      qb.addSelect([
        // 'business.id',
        'business.name',
      ]);
    }

    if (options.query?.date) {
      qb.andWhere('timeslot.date = :date', { date: options.query.date });
    }
    qb.orderBy('timeslot.date', 'DESC').addOrderBy(
      'timeslot.startTime',
      'DESC',
    );

    return qb;
  }

  async getAvailableDateRange(user: User) {
    if (user.role == Role.CUSTOMER) {
      const cus = await this.customerService.findByUserId(user.id);
      if (!cus) {
        throw new NotFoundException('Customer not found for this user');
      }
      return dateRangeQueryBuilderBasedRole(this.appointmentRepo, cus);
    }
    if (user.role == Role.BUSINESS_ADMIN) {
      const bus = await this.businessService.findByUserId(user.id);
      if (!bus) {
        throw new NotFoundException('Business not found for this user');
      }
      return dateRangeQueryBuilderBasedRole(this.appointmentRepo, bus);
    }
  }
}

function dateRangeQueryBuilderBasedRole(
  rep: Repository<Appointment>,
  user: Business | Customer,
) {
  const query = rep
    .createQueryBuilder('appointment')
    .innerJoin('appointment.timeslot', 'timeslot')
    .select('DISTINCT timeslot.date', 'date')
    // .where('timeslot.date')
    .orderBy('timeslot.date', 'ASC');

  if (user instanceof Business) {
    query.andWhere('appointment.businessId = :businessId', {
      businessId: user.id,
    });
  }

  if (user instanceof Customer) {
    query.andWhere('appointment.customerId = :customerId', {
      customerId: user.id,
    });
  }

  return query.getRawMany();
}
