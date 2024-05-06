import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class ProductDto {
  @IsNotEmpty({ message: 'Product name is required' })
  @IsString()
  productName: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber()
  price: number;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  offer?: string;
}
