import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Express } from 'express';

@ValidatorConstraint({ async: false })
export class IsFileConstraint implements ValidatorConstraintInterface {
  validate(file: Express.Multer.File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']; // Add your allowed file types
    const maxSize = 2 * 1024 * 1024; // 2 MB size limit

    return file && allowedTypes.includes(file.mimetype) && file.size <= maxSize;
  }

  defaultMessage(): string {
    return 'Invalid file type or size. Allowed types: JPEG, PNG, PDF; Max size: 2MB.';
  }
}
