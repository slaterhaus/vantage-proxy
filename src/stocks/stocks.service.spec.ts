import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { StockService } from './stocks.service';
import { AxiosResponse } from 'axios';


describe('StockService', () => {
  let service: StockService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StockService>(StockService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateMovingAverage', () => {
    it('should calculate the moving average correctly', () => {
      const testData = [1, 2, 3, 4, 5];
      const windowSize = 3;
      const expected = 4; // (3+4+5)/3
      expect(service.calculateMovingAverage(testData, windowSize)).toEqual(expected);
    });
  });

  describe('fetchPriceAndMovingAverage', () => {
    it('should fetch price and moving average correctly', async (done) => {
      const testSymbol = 'TEST';
      const mockResponse: AxiosResponse = {
        data: {
          'Time Series (Daily)': {
            '2023-01-01': { '4. close': '100' },
            '2023-01-02': { '4. close': '110' },
            // Add more data points as needed
          },
        },
        status: 200, // Example status
        statusText: 'OK', // Example status text
        headers: {}, // Example headers (or provide actual mock headers if needed)
        config: {
          headers: undefined
        }, // Mock config, can be an empty object if not used
      };
      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      service.fetchPriceAndMovingAverage(testSymbol).subscribe({
        next: (result) => {
          expect(result).toBeDefined();
          expect(result.latestPrice).toEqual(110);
          // Further assertions on the moving average
          done();
        },
        error: done,
      });
    });
  });
});
