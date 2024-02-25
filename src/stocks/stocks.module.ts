import { Module } from '@nestjs/common';
import { StockService } from './stocks.service';
import { StocksController } from './stocks.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [StockService],
  controllers: [StocksController]
})
export class StocksModule {}
