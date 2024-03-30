interface ExchangeRate {
    from: string;
    to: string;
    rate: number;
}

interface ExchangeRate {
    currencyName: string;
    currencyCode: string;
    buyingRatesCash: number;
    buyingRatesTransfer: number;
    sellingRates: number;
}

interface ConvertedExchangeRate {
    from: string;
    to: string;
    rate: number;
}