class MoneyExchangeService {
  async convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    date: string
  ) {
    try {
      const response = await fetch(
        'https://www.baocaocuoiky.info/api/money-exchange/exchange',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amount,
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
            date: date,
          }),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('An error occurred while converting currency.');
    }
  }
}

export default MoneyExchangeService;
