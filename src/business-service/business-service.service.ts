import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessService } from 'src/business/business.service';
import { ServiceService } from 'src/service/service.service';
import { Repository } from 'typeorm';
import { CreateBusinessServiceDto } from './dto/create-business-service.dto';
import { UpdateBusinessServiceDto } from './dto/update-business-service.dto';
import { BusinessService as BsEntity } from './entities/business-service.entity';
import { FindAllBusinessServiceDto } from './dto/find-all-business-service.dto';

@Injectable()
export class BusinessServiceService {
  constructor(
    private service: ServiceService,

    private business: BusinessService,

    @InjectRepository(BsEntity)
    private repository: Repository<BsEntity>,
  ) {}

  async create(userId: string, { serviceId, name }: CreateBusinessServiceDto) {
    const business = await this.business.findByUserId(userId);

    if (!business) throw new BadRequestException('Business not found');

    const service = await this.service.findById(serviceId);

    if (!service) throw new BadRequestException('Service not found');

    const duplicate = await this.repository.findOneBy({ name });

    if (duplicate) throw new BadRequestException('Name is duplicate');

    const instance = this.repository.create({
      business: {
        id: business.id,
      },
      name,
      service: {
        id: serviceId,
      },
    });
    return this.repository.save(instance);
  }

  async findAll(userId: string, query: FindAllBusinessServiceDto) {
    const business = await this.business.findByUserId(userId);
    if (!business) throw new BadRequestException('Business not found');

    return this.repository.find({
      where: {
        business: { id: business.id },
        service: { id: query.serviceId },
      },
      relations: ['price'],
      select: {
        id: true,
        name: true,
        price: { id: true, price: true },
      },
    });
  }

  findOne(id: string) {
    return this.repository.findOneBy({ id });
  }

  async update(
    userId: string,
    bsId: string,
    { name }: UpdateBusinessServiceDto,
  ) {
    const business = await this.business.findByUserId(userId);

    if (!business) throw new BadRequestException('Business not found');

    const bs = await this.repository.findOneBy({ id: bsId });

    if (!bs) throw new BadRequestException('Business service not found');

    if (name == bs.name) throw new BadRequestException('Name is duplicate');

    bs.name = name;

    return this.repository.save(bs);
  }

  async remove(userId: string, id: string) {
    const business = await this.business.findByUserId(userId);

    if (!business) throw new BadRequestException('Business not found');

    const bs = await this.repository.findOneBy({ id });

    if (!bs) throw new BadRequestException('Business service not found');

    return this.repository.delete({ id });
  }
}
