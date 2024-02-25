import { Module } from '@nestjs/common';

import { StocksModule } from '../stocks/stocks.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [StocksModule, ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'), // Serve static files from the 'public' directory
  }),],
  controllers: [],
  providers: []
})
export class AppModule {
}
