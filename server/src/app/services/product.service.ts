import { Injectable } from '@nestjs/common';
import { ProductDto } from '../dto/product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../schemas/product.schemas';
import { Logger } from './logger.service';

@Injectable()
export class ProductService {
  private logger: Logger;
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly loggerService: Logger,
  ) {
    this.logger = loggerService;
  }

  async createProduct(product: ProductDto) {
    try {
      const productObj: Product = new this.productModel({
        productName: product.productName,
        price: product.price,
        description: product.description,
        offer: product.offer,
      });
      const saveResponse = await productObj.save();
      this.logger.info(`product created: ${product.productName}`);
      return saveResponse;
    } catch (error) {
      if (error.code === 11000) {
        this.logger.error(`duplicate product: ${error.keyValue.productName}`);
        throw new Error(`duplicate product: ${error.keyValue.productName}`);
      }
      this.logger.error(error);
    }
  }

  async getProducts() {
    try {
      return await this.productModel.find({});
    } catch (error) {
      this.logger.error(error);
    }
  }
}
