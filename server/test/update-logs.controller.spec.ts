import { Test, TestingModule } from '@nestjs/testing';
import { UpdateLogsController } from '../src/app/controllers/update.logs.controller';
import { UpdateLogsService } from '../src/app/services/update-logs.service';
import { Logger } from '../src/app/services/logger.service';
import { AuthenticationGuard } from '../src/app/guards/authentication.guards';
import { LoggingInterceptor } from '../src/app/interceptors/logging.interceptor';
import { getMockRes } from '@jest-mock/express';
import { HttpStatus } from '@nestjs/common';

describe('UpdateLogsController', () => {
  let controller: UpdateLogsController;
  let updateLogsService: UpdateLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateLogsController],
      providers: [
        UpdateLogsService,
        Logger,
        {
          provide: AuthenticationGuard,
          useValue: {
            canActivate: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: LoggingInterceptor,
          useValue: {
            intercept: jest.fn().mockImplementation((req, res, next) => next()),
          },
        },
      ],
    }).compile();

    controller = module.get<UpdateLogsController>(UpdateLogsController);
    updateLogsService = module.get<UpdateLogsService>(UpdateLogsService);
    loggerService = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateProduct', () => {
    it('should update a product and return a success response', async () => {
      const mockBody = {
        productId: '1',
        updatedData: { name: 'Updated Name' },
      };
      const { res } = getMockRes({
        status: HttpStatus.OK,
        body: mockBody,
      });

      updateLogsService.updateProduct = jest.fn().mockResolvedValue(mockBody);

      await controller.updateProduct(mockBody, res);

      expect(updateLogsService.updateProduct).toHaveBeenCalledWith(mockBody);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(mockBody);
    });

    it('should handle errors and return a misdirected response', async () => {
      const mockBody = {
        productId: '1',
        updatedData: { name: 'Updated Name' },
      };
      const { res } = getMockRes({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        body: 'Internal Server Error',
      });

      updateLogsService.updateProduct = jest
        .fn()
        .mockRejectedValue(new Error('Internal Server Error'));

      await controller.updateProduct(mockBody, res);

      expect(updateLogsService.updateProduct).toHaveBeenCalledWith(mockBody);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: 'Internal Server Error',
      });
    });
  });

  describe('getProducts', () => {
    it('should return logs and a success response', async () => {
      const mockLogs = [{ id: '1', logMessage: 'Log Message' }];
      const { res } = getMockRes({
        status: HttpStatus.OK,
        body: mockLogs,
      });

      updateLogsService.getAllLogs = jest.fn().mockResolvedValue(mockLogs);

      await controller.getProducts(res);

      expect(updateLogsService.getAllLogs).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        status: HttpStatus.OK,
        data: mockLogs,
      });
    });

    it('should handle errors and return a misdirected response', async () => {
      const { res } = getMockRes({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        body: 'Internal Server Error',
      });

      updateLogsService.getAllLogs = jest
        .fn()
        .mockRejectedValue(new Error('Internal Server Error'));

      await controller.getProducts(res);

      expect(updateLogsService.getAllLogs).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: 'Internal Server Error',
      });
    });
  });
});
