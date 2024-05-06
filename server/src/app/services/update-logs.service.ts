import { Injectable } from '@nestjs/common';
import { MongoDBLoggerService } from './mongodb-logger.service';
import { Model } from 'mongoose';
import { Product } from '../schemas/product.schemas';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UpdateLogsService {
  constructor(
    private readonly logger: MongoDBLoggerService,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}
  async updateProduct(product: any) {
    try {
      // console.log(product);
      const response = await this.productModel.updateOne(
        { _id: product._id },
        {
          $set: {
            productName: product.productName,
            price: product.price,
            description: product.description,
            offer: product.offer,
          },
        },
      );
      console.log(response);
      return response;
    } catch (error) {
      throw new Error('Something went wrong.');
    }
  }
  async getAllLogs(): Promise<any> {
    try {
      return await this.logger.getLogs();
    } catch (error) {
      throw new Error('somthing went wrong.');
    }
  }
}
