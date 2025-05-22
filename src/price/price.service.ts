import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Price } from './entities/price.entity';
import { Service } from '../service/entities/service.entity';
import { BusinessService } from '../business/business.service';
import { User } from '../user/entities/user.entity';
import { Role } from '../common/enums/role.enum';
import { Logger } from '@nestjs/common';

import { CreatePriceDto, UpdatePriceDto } from './dto/price-dto';
import { ServiceService } from 'src/service/service.service';

@Injectable()
export class PriceService {
  private readonly logger = new Logger(PriceService.name);

  constructor(
    @InjectRepository(Price)
    private readonly priceRepo: Repository<Price>,

    private readonly serviceService: ServiceService,
    private readonly businessService: BusinessService,
  ) {}

  async create(createPriceDto: CreatePriceDto, user: User): Promise<Price> {
    this.logger.debug(
      `Creating price with DTO: ${JSON.stringify(createPriceDto)}`,
    );

    // Fetch the service
    const service = await this.serviceService.findOne(createPriceDto.serviceId);
    if (!service) {
      throw new NotFoundException(
        `Service with ID ${createPriceDto.serviceId} not found`,
      );
    }

    // Ensure service is non-system
    if (service.isSystemService) {
      throw new BadRequestException('Cannot set price for system services');
    }

    // Verify user is BUSINESS_ADMIN of the service's business
    const business = await this.businessService.findByUserId(user.id);
    if (
      !business ||
      (service.business && business.id !== service.business.id)
    ) {
      throw new ForbiddenException(
        'You can only create prices for services in your own business',
      );
    }

    // Check if service already has a price
    const existingPrice = await this.priceRepo.findOne({
      where: { service: { id: createPriceDto.serviceId } },
    });
    if (existingPrice) {
      throw new BadRequestException(
        `Service with ID ${createPriceDto.serviceId} already has a price`,
      );
    }
    console.log('createPriceDto.amount', createPriceDto.amount);
    const price = this.priceRepo.create({
      amount: createPriceDto.amount,
      service,
    });

    try {
      const savedPrice = await this.priceRepo.save(price);
      this.logger.debug(`Created price with ID: ${savedPrice.id}`);
      return savedPrice;
    } catch (error) {
      this.logger.error(`Failed to create price: ${error.message}`);
      throw error;
    }
  }

  async update(
    id: string,
    updatePriceDto: UpdatePriceDto,
    user: User,
  ): Promise<Price> {
    const price = await this.priceRepo.findOne({
      where: { id },
      relations: ['service', 'service.business'],
    });
    if (!price) {
      throw new NotFoundException(`Price with ID ${id} not found`);
    }

    // Ensure service is non-system
    if (price.service.isSystemService) {
      throw new BadRequestException('Cannot update price for system services');
    }

    // Verify user is BUSINESS_ADMIN of the service's business
    const business = await this.businessService.findByUserId(user.id);
    if (
      !business ||
      (price.service.business && business.id !== price.service.business.id)
    ) {
      throw new ForbiddenException(
        'You can only update prices for services in your own business',
      );
    }

    // Update amount if provided
    if (updatePriceDto.amount !== undefined) {
      price.amount = updatePriceDto.amount;
    }

    try {
      const savedPrice = await this.priceRepo.save(price);
      this.logger.debug(`Updated price with ID: ${savedPrice.id}`);
      return savedPrice;
    } catch (error) {
      this.logger.error(`Failed to update price: ${error.message}`);
      throw error;
    }
  }

  async findByService(serviceId: string, user: User): Promise<Price> {
    const price = await this.priceRepo.findOne({
      where: { service: { id: serviceId } },
      relations: ['service', 'service.business'],
    });
    if (!price) {
      throw new NotFoundException(
        `Price for service with ID ${serviceId} not found`,
      );
    }

    // Verify user access
    const business = await this.businessService.findByUserId(user.id);
    if (
      !business ||
      (price.service.business && business.id !== price.service.business.id)
    ) {
      throw new ForbiddenException(
        'You can only view prices for services in your own business',
      );
    }

    return price;
  }

  async remove(id: string, user: User): Promise<void> {
    const price = await this.priceRepo.findOne({
      where: { id },
      relations: ['service', 'service.business'],
    });
    if (!price) {
      throw new NotFoundException(`Price with ID ${id} not found`);
    }

    // Ensure service is non-system
    if (price.service.isSystemService) {
      throw new BadRequestException('Cannot delete price for system services');
    }

    // Verify user is BUSINESS_ADMIN of the service's business
    const business = await this.businessService.findByUserId(user.id);
    if (
      !business ||
      (price.service.business && business.id !== price.service.business.id)
    ) {
      throw new ForbiddenException(
        'You can only delete prices for services in your own business',
      );
    }

    // Prevent deletion due to check_non_system_service_price constraint
    throw new BadRequestException(
      'Cannot delete price for non-system services due to database constraints',
    );
  }
}
