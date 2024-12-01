import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment, { Moment } from 'moment-jalaali';
import { Repository } from 'typeorm';
import { BusinessService } from '../business/business.service';
import { CustomerService } from '../customer/customer.service';
import { ServiceProfileService } from '../service-profile/service-profile.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';

import { NotificationQueueService } from 'src/shared/queues/notification-queue/notification-queue.service';

import { AppointmentFilter } from 'src/shared/types/appointment-filter.eum';
import { AppointmentStatus } from 'src/shared/types/appointment-status.enum';
import { TimeSlotStatus } from 'src/shared/types/time-slot-status.enum';
import {
  CustomerPayload,
  UserPayload,
} from 'src/shared/types/user-payload.interface';
import { isCustomerPayload } from 'src/shared/types/user-serialize-request.interface';
import {
  calculateReminderDelays,
  formatTimeSlotToDate,
} from 'src/shared/utils';
import { TransactionService } from '../transaction/transaction.service';
import { GetQueryAppointmentsDto } from './dto/get-query-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @Inject(forwardRef(() => CustomerService))
    private readonly customerService: CustomerService,
    @Inject(forwardRef(() => BusinessService))
    private readonly businessService: BusinessService,
    private readonly serviceProfileService: ServiceProfileService,
    private readonly transactionService: TransactionService,

    private readonly notificationQueueService: NotificationQueueService,
  ) {}
  async create(
    createAppointmentDto: CreateAppointmentDto,
    businessId: number,
    customerId: number,
  ) {
    const timeSlot = await this.businessService.findTimeSlotById(
      createAppointmentDto.timeSlotId,
    );

    if (!timeSlot) {
      throw new NotFoundException('Can not find TimeSlot');
    }

    const customer = await this.customerService.findOneById(customerId);

    if (!customer) {
      throw new NotFoundException('Can not find Customer');
    }

    const business = await this.businessService.findOneById(businessId);

    if (!business) {
      throw new NotFoundException('Can not find Business');
    }

    const serviceProfile =
      await this.serviceProfileService.findOneByIdBasedBusinessId(
        createAppointmentDto.serviceProfileId,
        businessId,
      );
    if (!serviceProfile) {
      throw new NotFoundException('Can not find ServiceProfile');
    }

    const appointment = this.appointmentRepository.create({
      business: {
        id: business.id,
      },
      customer: {
        id: customer.id,
      },
      serviceProfile: serviceProfile,
      timeSlot: {
        id: timeSlot.id,
      },
      status: AppointmentStatus.PENDING,
    });

    const dateFormat = formatTimeSlotToDate(timeSlot.date, timeSlot.HHMM);

    const reminders = calculateReminderDelays(dateFormat);

    const createdAppointment =
      await this.appointmentRepository.save(appointment);

    await this.businessService.updateTimeSlotStatusById(
      timeSlot,
      TimeSlotStatus.BOOKED,
    );
    await this.notificationQueueService.sendRegisterAppointmentNotification({
      email: 'mrzar1380@gmail.com',
      businessName: business.subDomainName,
      date: moment(dateFormat).format('jYYYY/jMM/jDD HH:mm'),
      name: customer.name,
      type: 'appointment-register',
    });

    reminders.forEach(async (reminder) => {
      await this.notificationQueueService.sendAppointmentReminderNotification(
        {
          appointmentDate: moment(dateFormat).format('jYYYY/jMM/jDD HH:mm'),
          businessName: business.subDomainName,
          email: 'mrzar1380@gmail.com',
          name: customer.name,
          type: 'appointment-reminder',
          message: reminder.message,
        },
        reminder.delayMs,
      );
    });

    return {
      id: createdAppointment.id,
      timeSlotId: createdAppointment.timeSlot.id,
      customerId: createdAppointment.customer.id,
      serviceProfileId: createdAppointment.serviceProfile.id,
      businessId: createdAppointment.business.id,
      paymentStatus: createdAppointment.status,
      status: createdAppointment.status,
    };
  }
  async testReminder() {
    // const date = moment().add(15, 'minutes').add(1, 'second');
    const date = moment().add(2, 'minutes').add(1, 'second');
    // const date = moment().add(1, 'days').add(1, 'second');
    // const date = moment().add(1, 'days');
    // const date = moment();

    const reminders = calculateReminderDelays(date);

    reminders.forEach(async (reminder) => {
      await this.notificationQueueService.sendAppointmentReminderNotification(
        {
          appointmentDate: moment(date).format('jYYYY/jMM/jDD HH:mm'),
          businessName: 'mrzar',
          email: 'mrzar1380@gmail.com',
          name: 'محمد رضا',
          type: 'appointment-reminder',
          message: reminder.message,
        },
        reminder.delayMs,
      );
    });

    return reminders;
    // return await this.appointmentQueue.add(
    //   'send-reminder',
    //   {
    //     email: 'mrzar1380@gmail.com',
    //   },
    //   {
    //     delay: 0,
    //     priority: 1,
    //     removeOnComplete: true,
    //   },
    // );
    // return await this.appointmentQueue.add(
    //   'send-reminder',
    //   { id: 'TEST' },
    //   {
    //     delay: delayInMilliseconds, // Calculate the delay in milliseconds
    //     removeOnComplete: true, // Automatically delete the job after it's been processed
    //     removeOnFail: true, // Automatically delete the job if it fails
    //   },
    // );
  }

  async getAllJobs() {
    return this.notificationQueueService.getAllJob();
  }
  async deleteAllJob() {
    await this.notificationQueueService.removeAllJobs();
    return 'All jobs deleted';
  }

  findAll() {
    return `This action returns all appointment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }
  async findOneByTimeSlotId(timeSlotId: number) {
    return await this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.timeSlot.id = :timeSlotId', { timeSlotId })
      .getOne();
  }
  async findTimeSlotsByAppointment(businessId: number, since: Moment) {
    const appointments = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.timeSlot', 'timeSlot') // Join the TimeSlot entity
      .where('appointment.businessId = :businessId', { businessId }) // Filter by businessId
      .andWhere('timeSlot.date > :date', { date: since.toISOString() }) // Filter for future time slots
      .andWhere('appointment.timeSlotId IS NOT NULL') // Ensure that the timeSlot exists for the appointment
      .orderBy('timeSlot.date', 'ASC') // Order by time slot date ascending
      .getMany();

    return appointments;
  }
  async _findAppointment(
    user: UserPayload | CustomerPayload,
    getQueryAppointmentsDto: GetQueryAppointmentsDto,
  ) {
    return isCustomerPayload(user)
      ? () => {}
      : this.findBusinessAppointment(user.userId, getQueryAppointmentsDto);
  }
  async findBusinessAppointment(
    businessId: number,
    getQueryAppointmentsDto: GetQueryAppointmentsDto,
  ) {
    const { endDate, startDate, search, status } = getQueryAppointmentsDto;

    const queryBuilder = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.timeSlot', 'timeSlot')
      .leftJoinAndSelect('appointment.customer', 'customer')
      .leftJoinAndSelect('appointment.serviceProfile', 'serviceProfile')
      .where('appointment.businessId = :businessId', { businessId }); // Filter by businessId

    if (status !== AppointmentFilter.ALL) {
      queryBuilder.andWhere('appointment.status = :status', { status });
    }

    // Filter by startDate and endDate
    if (startDate && endDate) {
      queryBuilder.andWhere('timeSlot.date BETWEEN :startDate AND :endDate', {
        startDate: moment(startDate).toISOString(),
        endDate: moment(endDate).toISOString(),
      });
    } else if (startDate) {
      queryBuilder.andWhere('timeSlot.date > :startDate', {
        startDate: moment(startDate).toISOString(),
      });
    } else if (endDate) {
      queryBuilder.andWhere('timeSlot.date < :endDate', {
        endDate: moment(endDate).toISOString(),
      });
    }

    // Add search condition
    if (search) {
      queryBuilder.andWhere(
        '(LOWER(customer.name) ILIKE :search OR LOWER(customer.phoneNumber) ILIKE :search OR LOWER(serviceProfile.name) ILIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    // Ensure appointments have time slots
    // queryBuilder.andWhere('appointment.timeSlotId IS NOT NULL');

    // Order by date
    queryBuilder.orderBy('timeSlot.date', 'ASC');

    // Execute and return results
    const re = await queryBuilder.getMany();
    console.log(re);
    return re;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
