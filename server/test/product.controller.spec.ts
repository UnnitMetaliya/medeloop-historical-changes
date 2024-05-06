import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../src/app/controllers/product.controller';
import { ProductService } from '../src/app/services/product.service';
import { Logger } from '../src/app/services/logger.service';
import { AuthenticationGuard } from '../src/app/guards/authentication.guards';
import { getMockRes } from '@jest-mock/express';
import { HttpStatus } from '@nestjs/common';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        ProductService,
        Logger,
        {
          provide: AuthenticationGuard,
          useValue: {
            canActivate: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
    loggerService = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a product and return a success response', async () => {
      const mockProduct = { name: 'Test Product', price: 100 };
      const mockProductObj = { id: '1', ...mockProduct };
      const { res } = getMockRes({
        status: HttpStatus.CREATED,
        body: mockProductObj,
      });

      productService.createProduct = jest
        .fn()
        .mockResolvedValue(mockProductObj);

      await controller.createProduct(mockProduct, res);

      expect(productService.createProduct).toHaveBeenCalledWith(mockProduct);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        status: HttpStatus.CREATED,
        data: mockProductObj,
      });
    });

    it('should handle errors and return a misdirected response', async () => {
      const mockProduct = { name: 'Test Product', price: 100 };
      const { res } = getMockRes({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        body: 'Internal Server Error',
      });

      productService.createProduct = jest
        .fn()
        .mockRejectedValue(new Error('Internal Server Error'));

      await controller.createProduct(mockProduct, res);

      expect(productService.createProduct).toHaveBeenCalledWith(mockProduct);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: 'Internal Server Error',
      });
    });
  });

  describe('getProducts', () => {
    it('should return products and a success response', async () => {
      const mockProducts = [{ id: '1', name: 'Test Product', price: 100 }];
      const { res } = getMockRes({
        status: HttpStatus.OK,
        body: mockProducts,
      });

      productService.getProducts = jest.fn().mockResolvedValue(mockProducts);

      await controller.getProducts(res);

      expect(productService.getProducts).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        status: HttpStatus.OK,
        data: mockProducts,
      });
    });

    it('should handle errors and return a misdirected response', async () => {
      const { res } = getMockRes({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        body: 'Internal Server Error',
      });

      productService.getProducts = jest
        .fn()
        .mockRejectedValue(new Error('Internal Server Error'));

      await controller.getProducts(res);

      expect(productService.getProducts).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: 'Internal Server Error',
      });
    });
  });
});
