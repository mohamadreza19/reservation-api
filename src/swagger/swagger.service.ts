import { Injectable } from '@nestjs/common';
import { CreateSwaggerDto } from './dto/create-swagger.dto';
import { UpdateSwaggerDto } from './dto/update-swagger.dto';

@Injectable()
export class SwaggerService {
  create(createSwaggerDto: CreateSwaggerDto) {
    return 'This action adds a new swagger';
  }

  findAll() {
    return `This action returns all swagger`;
  }

  findOne(id: number) {
    return `This action returns a #${id} swagger`;
  }

  update(id: number, updateSwaggerDto: UpdateSwaggerDto) {
    return `This action updates a #${id} swagger`;
  }

  remove(id: number) {
    return `This action removes a #${id} swagger`;
  }
}
