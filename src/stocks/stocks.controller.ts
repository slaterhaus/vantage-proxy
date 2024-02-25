import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { StockService } from './stocks.service';
import { catchError, of } from 'rxjs';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stockService: StockService) {
  }

  @Get('price-and-average')
  fetchPriceAndMovingAverage(@Query('symbol') symbol: string) {
    if (!symbol) {
      throw new HttpException('Symbol query parameter is required', HttpStatus.BAD_REQUEST);
    }

    return this.stockService.fetchPriceAndMovingAverage(symbol).pipe(catchError(e => {
      return of(new HttpException(e.toString(), HttpStatus.INTERNAL_SERVER_ERROR));
    }));

  }
}
