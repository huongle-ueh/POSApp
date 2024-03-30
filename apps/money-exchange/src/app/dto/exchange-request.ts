import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class ExchangeQueryParams {
  @ApiProperty({
    description: 'The amount of currency to exchange',
    required: true,
    example: 1000,
  })
  @IsNotEmpty()
  @Expose()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'The currency code or name from which the exchange will be made',
    required: true,
    example: 'USD',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z]{3}$/, {
    message: 'Currency code should be a 3-letter uppercase string',
  })
  @Expose()
  fromCurrency: string;

  @ApiProperty({
    description: 'The currency code or name to which the exchange will be made',
    required: true,
    example: 'EUR',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z]{3}$/, {
    message: 'Currency code should be a 3-letter uppercase string',
  })
  @Expose()
  toCurrency: string;

  @ApiProperty({
    description: 'The date of the exchange rate (dd/mm/yyyy)',
    required: true,
    example: '27/03/2024',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(\d{2})\/(\d{2})\/(\d{4})$/, {
    message: 'Date should be in dd/mm/yyyy format',
  })
  date: string;
}