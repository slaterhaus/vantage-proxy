import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class StockService {
  constructor(private httpService: HttpService) {}

  fetchPriceAndMovingAverage(symbol: string) {
    const url = `https://www.alphavantage.co/query`;
    const params = {
      function: `TIME_SERIES_DAILY`,
      symbol: symbol,
      outputsize: `compact`,
      datatype: `json`,
      apikey: process.env.ALPHA_VANTAGE_API_KEY,
    };

    return this.httpService.get(url, { params }).pipe(
      map(response => {
        const data = response.data[`Time Series (Daily)`];
        const prices = Object.values(data).map((value: any) => parseFloat(value[`4. close`]));
        const movingAverage = this.calculateMovingAverage(prices, prices.length);
        const latestPrice = prices[0];
        const priceDiff = (latestPrice - movingAverage);
        const percentDifference = Number((priceDiff / movingAverage * 100).toFixed(2));
        return { latestPrice, movingAverage, percentDifference };
      }),
    );
  }

  calculateMovingAverage(data: number[], windowSize: number) {
    const movingAverage = [];
    for (let i = windowSize - 1; i < data.length; i++) {
      const window = data.slice(i - windowSize + 1, i + 1);
      const average = window.reduce((a, b) => a + b, 0) / windowSize;
      movingAverage.push(average);
    }
    return Number(movingAverage[0].toFixed(2));
  }
}
