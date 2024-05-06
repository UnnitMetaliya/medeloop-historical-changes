import { ObjectID } from '@tsed/mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Auth extends Document {
  @ObjectID('id')
  _id: string;

  @Prop({ required: true, type: String, unique: true })
  email: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ type: String })
  token: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
