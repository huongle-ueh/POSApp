import { IsOptional } from 'class-validator';
import { ExchangeQueryParams } from './exchange-request';
import { Expose, Transform } from 'class-transformer';

export class ExchangeResponse extends ExchangeQueryParams {
  @IsOptional()
  @Expose()
  exchangeRate: number;
}