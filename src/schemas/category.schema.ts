import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, unique: true })
  category_name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ default: true })
  is_active: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  created_by?: Types.ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
