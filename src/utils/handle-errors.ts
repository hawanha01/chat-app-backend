import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

export const handleError = (error: any): void => {
  if (error instanceof HttpException) {
    throw error;
  }
  if (error instanceof QueryFailedError) {
    throw error;
  }
  throw new InternalServerErrorException('An unexpected error occurred');
};
