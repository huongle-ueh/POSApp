import React, { useState } from 'react';
import MoneyExchangeService from '../services/money-exchange.service';

const MoneyExchange = () => {
  const currencies = [
    'AUD', 'CAD', 'CHF', 'CNY', 'DKK', 'EUR', 'GBP', 'HKD', 'INR', 'JPY',
    'KRW', 'KWD', 'MYR', 'NOK', 'RUB', 'SAR', 'SEK', 'SGD', 'THB', 'USD', 'VND'
  ];

  const [amount, setAmount] = useState<number | null>(null);
  const [fromCurrency, setFromCurrency] = useState<string | null>(null);
  const [toCurrency, setToCurrency] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<{
    amount: number;
    fromCurrency: string;
    toCurrency: string;
    date: string;
    exchangeRate: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const convertCurrency = () => {
    if (!amount) return;

    const service = new MoneyExchangeService();
    service
      .convertCurrency(amount, fromCurrency || '', toCurrency || '', formatDate(date || ''))
      .then((data) => {
        setResult(data);
        console.log('Result:', data);
        setError(null);
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('An error occurred while converting currency.');
        setResult(null);
      });
  };

  const formatDate = (inputDate: string) => {
    const [year, month, day] = inputDate.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    convertCurrency();
  };

  const handleFromCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setToCurrency(e.target.value);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="text-center mb-4">Currency Converter</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Amount:</label>
              <input
                type="number"
                className="form-control"
                value={amount || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  setAmount(isNaN(value) ? null : value);
                }}
                required
              />
            </div>
            <div className="form-group">
              <label>From Currency:</label>
              <select
                className="form-control"
                value={fromCurrency || ''}
                onChange={handleFromCurrencyChange}
                required
              >
                <option value="">-- Select Currency --</option>
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>To Currency:</label>
              <select
                className="form-control"
                value={toCurrency || ''}
                onChange={handleToCurrencyChange}
                required
              >
                <option value="">-- Select Currency --</option>
                {currencies
                  .filter(currency => currency !== fromCurrency) // Filter out fromCurrency
                  .map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
              </select>
            </div>
            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                className="form-control"
                value={date || ''}
                onChange={(e) => {
                  const selectedDate = e.target.value;
                  const today = new Date().toISOString().split('T')[0];
                  if (selectedDate > today) {
                    setDate(today);
                  } else {
                    setDate(selectedDate);
                  }
                }}
                required
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <button className="btn btn-primary btn-block" type="submit">Convert</button>
          </form>
        </div>
      </div>
      {result !== null && (
        <div className="row mt-4">
          <div className="col-md-6 offset-md-3">
            <h3>Result:</h3>
            <p>Amount: {result.amount.toLocaleString()}</p>
            <p>From Currency: {result.fromCurrency}</p>
            <p>To Currency: {result.toCurrency}</p>
            <p>Date: {result.date}</p>
            <p>Exchange Rate: {result.exchangeRate.toLocaleString()}</p>
          </div>
        </div>
      )}
      {error !== null && (
        <div className="row mt-4">
          <div className="col-md-6 offset-md-3">
            <p className="text-danger">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoneyExchange;
