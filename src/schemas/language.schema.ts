import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LanguageDocument = Language & Document;

@Schema({ timestamps: true })
export class Language {
  @Prop({ required: true, unique: true })
  language_name: string;

  @Prop({ default: true })
  is_active: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  created_by?: Types.ObjectId;
}

export const LanguageSchema = SchemaFactory.createForClass(Language);
