import { Injectable, NotFoundException } from '@nestjs/common';
import { ExchangeResponse } from './dto/exchange-response';
import { plainToClass } from 'class-transformer';
const cheerio = require('cheerio');
const axios = require('axios');
@Injectable()
export class AppService {
  async exchangeCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    date: string,
    exchangeRates: ConvertedExchangeRate[]
  ): Promise<ExchangeResponse> | null {
    const exchangeRate = exchangeRates.find(
      (rate) => rate.from === fromCurrency && rate.to === toCurrency
    );

    if (!exchangeRate) {
      throw new NotFoundException(
        `Exchange rate from ${fromCurrency} to ${toCurrency} not found`
      );
    }

    const exchangedAmount = amount * exchangeRate.rate;

    return {
      amount: parseFloat(amount.toString()),
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
      date: date,
      exchangeRate: parseFloat(exchangedAmount.toFixed(3)),
    };
  }

  async fetchData(url: string): Promise<any> {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching data from ${url}: ${error.message}`);
    }
  }

  async convertExchangeRates(exchangeRates: ExchangeRate[]) {
    const convertedRates: ConvertedExchangeRate[] = [];

    // Loop through each pair of currencies
    for (let i = 0; i < exchangeRates.length; i++) {
      for (let j = 0; j < exchangeRates.length; j++) {
        if (i !== j) {
          // Push the rates from currency i to currency j
          convertedRates.push({
            from: exchangeRates[i].currencyCode,
            to: exchangeRates[j].currencyCode,
            rate:
              exchangeRates[i].buyingRatesTransfer /
              exchangeRates[j].buyingRatesTransfer,
          });

          // Push the rates from currency j to currency i
          convertedRates.push({
            from: exchangeRates[j].currencyCode,
            to: exchangeRates[i].currencyCode,
            rate:
              exchangeRates[j].buyingRatesTransfer /
              exchangeRates[i].buyingRatesTransfer,
          });
        }
      }
      convertedRates.push({
        from: exchangeRates[i].currencyCode,
        to: 'VND',
        rate: exchangeRates[i].buyingRatesTransfer,
      });
    }
    return convertedRates;
  }

  async getExchangeRates(date: string) {
    const exchaneCurrency = await this.getExchangeCurrency(date);
    const convertedRates = await this.convertExchangeRates(exchaneCurrency);
    return convertedRates;
  }

  async getExchangeCurrency(date: string) {
    // Hard code the URL for now and we will make it dynamic later
    const url =
      'https://portal.vietcombank.com.vn/UserControls/TVPortal.TyGia/pListTyGia.aspx?txttungay=' +
      date +
      '&BacrhID=1&isEn=True';
    const html = await this.fetchData(url);
    const $ = cheerio.load(html);
    const exchangeRates = [];

    $('.tbl-01 tr.odd').each((index, element) => {
      const tds = $(element).find('td');
      const currencyName = $(tds[0]).text().trim();
      const currencyCode = $(tds[1]).text().trim();
      const buyingRatesCash = parseFloat(
        $(tds[2]).text().trim().replace(/,/g, '')
      );
      const buyingRatesTransfer = parseFloat(
        $(tds[3]).text().trim().replace(/,/g, '')
      );
      const sellingRates = parseFloat(
        $(tds[4]).text().trim().replace(/,/g, '')
      );

      exchangeRates.push({
        currencyName,
        currencyCode,
        buyingRatesCash,
        buyingRatesTransfer,
        sellingRates,
      });
    });
    return exchangeRates;
  }
}
