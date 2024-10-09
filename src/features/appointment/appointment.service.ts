import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessService } from '../business/business.service';
import { CustomerService } from '../customer/customer.service';
import { ServiceProfileService } from '../service-profile/service-profile.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import moment from 'moment';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmenRepository: Repository<Appointment>,
    private readonly customerService: CustomerService,
    private readonly businessService: BusinessService,
    private readonly serviceProfileService: ServiceProfileService,
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

    const appointment = this.appointmenRepository.create({
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
      paymentStatus: 'unpaid',
      status: 'pending',
    });

    const createdAppointment =
      await this.appointmenRepository.save(appointment);

    return {
      id: createdAppointment.id,
      timeSlotId: createdAppointment.timeSlot.id,
      customerId: createdAppointment.customer.id,
      serviceProfileId: createdAppointment.serviceProfile.id,
      businessId: createdAppointment.business.id,
      paymentStatus: createdAppointment.paymentStatus,
      status: createdAppointment.status,
    };
  }

  findAll() {
    return `This action returns all appointment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
