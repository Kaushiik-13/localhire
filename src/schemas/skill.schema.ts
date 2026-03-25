import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SkillDocument = Skill & Document;

@Schema({ timestamps: true })
export class Skill {
  @Prop({ required: true, unique: true })
  skill_name: string;

  @Prop({ default: true })
  is_active: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  created_by?: Types.ObjectId;
}

export const SkillSchema = SchemaFactory.createForClass(Skill);
