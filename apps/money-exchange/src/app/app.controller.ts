import { Body, Controller, HttpCode, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ExchangeQueryParams } from './dto/exchange-request';
import { ExchangeResponse } from './dto/exchange-response';
import { plainToClass } from 'class-transformer';

@ApiTags('Money Exchange')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('exchange')
  @ApiOperation({
    summary: 'Endpoint to exchange currencies.',
    description: `
    This endpoint allows users to calculate the exchange rate between two currencies for a given amount and date.
    It accepts the following request body parameters:
   
   - 'amount': The amount of currency to exchange. Must be a positive number.
      Example: 1000
   
   - 'fromCurrency': The currency code or name from which the exchange will be made.
      Example: 'USD'
   
   - 'toCurrency': The currency code or name to which the exchange will be made.
      Example: 'EUR'
   
   - 'date': The date of the exchange rate in dd/mm/yyyy format.
      Example: '27/03/2024'
   
   If successful, the endpoint returns the calculated exchange rate.

   If any of the required parameters are missing or invalid, the endpoint returns a 400 Bad Request error.

   If the exchange rate data is not available for the provided date or currencies, the endpoint returns a 404 Not Found error.
  `,
  })
  @ApiBody({ type: ExchangeQueryParams })
  @ApiResponse({
    status: 200,
    description: 'Successful operation. Returns the calculated exchange rate.',
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'number' },
        fromCurrency: { type: 'string' },
        toCurrency: { type: 'string' },
        date: { type: 'string' },
        exchangeRate: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. One or more parameters are missing or invalid.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Not Found. The exchange rate data is not available for the provided date or currencies.',
  })
  @HttpCode(200)
  async exchangeCurrency(
    @Body(new ValidationPipe({ transform: true })) query: ExchangeQueryParams
  ): Promise<ExchangeResponse> {
    const exchangeRates = await this.appService.getExchangeRates(query.date);
    const exchangeData = await this.appService.exchangeCurrency(
      query.amount,
      query.fromCurrency,
      query.toCurrency,
      query.date,
      exchangeRates
    );
    return plainToClass(ExchangeResponse, exchangeData);
  }
}
