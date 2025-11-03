import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessService } from 'src/business/business.service';
import { Repository } from 'typeorm';
import { BusinessServiceService } from './business-service.service';
import { CreateBusinessServicePriceDto } from './dto/create-business-service-price.dto';
import { UpdateBusinessServicePriceDto } from './dto/update-business-service-price.dto';
import { BusinessServicePrice } from './entities/business-service-price.entity';

@Injectable()
export class BusinessServicePriceService {
  constructor(
    private businessService: BusinessServiceService,
    private business: BusinessService,

    @InjectRepository(BusinessServicePrice)
    private repository: Repository<BusinessServicePrice>,
  ) {}

  async create(
    userId: string,
    { businessServiceId, price }: CreateBusinessServicePriceDto,
  ) {
    const business = await this.business.findByUserId(userId);

    if (!business) throw new BadRequestException('Business not found');

    const businessService =
      await this.businessService.findOne(businessServiceId);

    if (!businessService)
      throw new BadRequestException('BusinessService not found');

    const duplicate = await this.repository.findOneBy({
      businessService: {
        id: businessServiceId,
      },
    });

    if (duplicate)
      throw new BadRequestException('BusinessServicePrice is duplicate');

    const instance = this.repository.create({
      business: {
        id: business.id,
      },

      businessService: {
        id: businessServiceId,
      },
      price: price,
    });
    return this.repository.save(instance);
  }

  // async findAll(userId: string, query: FindAllBusinessServiceDto) {
  //   const business = await this.business.findByUserId(userId);

  //   if (!business) throw new BadRequestException('Business not found');

  //   return this.repository.find({
  //     where: {
  //       business: {
  //         id: business.id,
  //       },
  //       service: {
  //         id: query.serviceId,
  //       },
  //     },
  //   });
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} businessService`;
  // }

  async update(
    userId: string,
    id: string,
    { price }: UpdateBusinessServicePriceDto,
  ) {
    const business = await this.business.findByUserId(userId);

    if (!business) throw new BadRequestException('Business not found');

    const bsPrice = await this.repository.findOneBy({ id: id });

    if (!bsPrice)
      throw new BadRequestException('Business service price not found');

    bsPrice.price = price;

    return this.repository.save(bsPrice);
  }

  async remove(userId: string, id: string) {
    const business = await this.business.findByUserId(userId);

    if (!business) throw new BadRequestException('Business not found');

    const bs = await this.repository.findOneBy({ id });

    if (!bs) throw new BadRequestException('Business service not found');

    return this.repository.delete({ id });
  }
}
