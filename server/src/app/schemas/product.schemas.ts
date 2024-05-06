import { ObjectID } from '@tsed/mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { number } from '@tsed/schema';

@Schema({ timestamps: true })
export class Product extends Document {
  @ObjectID('id')
  _id: string;

  @Prop({ required: true, type: String, unique: true })
  productName: string;

  @Prop({ required: true, type: number })
  price: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: false, type: String })
  offer: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
