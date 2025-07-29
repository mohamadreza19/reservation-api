import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginatedServiceDto, PlanDto } from '../dto/service.dto';

export function ApiServiceCreateResponse() {
  return applyDecorators(
    ApiOperation({ operationId: 'services_create' }),
    ApiResponse({ status: 201, description: 'Service created successfully' }),
    ApiResponse({
      status: 404,
      description: 'Parent service or business not found',
    }),
  );
}

export function ApiServiceFindAllResponse() {
  return applyDecorators(
    ApiOperation({ operationId: 'services_findAll' }),
    ApiResponse({
      status: 200,
      description: 'Services retrieved successfully',
      type: PaginatedServiceDto,
    }),
  );
}

export function ApiServiceFindAllPlansResponse() {
  return applyDecorators(
    ApiOperation({ operationId: 'services_findAllPlans' }),
    ApiResponse({ type: [PlanDto] }),
  );
}

export function ApiServiceFindByBusinessResponse() {
  return applyDecorators(
    ApiOperation({ operationId: 'services_findByBusiness' }),
    ApiResponse({
      status: 200,
      description: 'Business services retrieved successfully',
      type: PaginatedServiceDto,
    }),
    ApiResponse({ status: 404, description: 'Business not found' }),
  );
}

export function ApiServiceFindOneResponse() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a service by ID' }),
    ApiResponse({ status: 200, description: 'Service retrieved successfully' }),
    ApiResponse({ status: 404, description: 'Service not found' }),
  );
}

export function ApiServiceUpdateResponse() {
  return applyDecorators(
    ApiOperation({ operationId: 'services_update' }),
    ApiResponse({ status: 200, description: 'Service updated successfully' }),
    ApiResponse({ status: 400, description: 'Bad request' }),
    ApiResponse({ status: 403, description: 'Forbidden' }),
    ApiResponse({
      status: 404,
      description: 'Service, parent or business not found',
    }),
  );
}

export function ApiServiceDeleteResponse() {
  return applyDecorators(
    ApiOperation({ operationId: 'services_delete' }),
    ApiResponse({ status: 200, description: 'Service deleted successfully' }),
    ApiResponse({ status: 403, description: 'Forbidden' }),
    ApiResponse({ status: 404, description: 'Service not found' }),
  );
}
