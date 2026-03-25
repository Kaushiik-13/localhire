import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Language, LanguageDocument } from '../../schemas/language.schema';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/create-language.dto';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectModel(Language.name) private languageModel: Model<LanguageDocument>,
  ) {}

  async create(
    createLanguageDto: CreateLanguageDto,
    createdBy?: string,
  ): Promise<LanguageDocument> {
    const existingLanguage = await this.languageModel.findOne({
      language_name: createLanguageDto.language_name,
    });
    if (existingLanguage) {
      throw new ConflictException('Language name already exists');
    }

    const language = new this.languageModel({
      ...createLanguageDto,
      created_by: createdBy ? new Types.ObjectId(createdBy) : undefined,
    });
    return language.save();
  }

  async findAll(): Promise<LanguageDocument[]> {
    return this.languageModel.find().populate('created_by').exec();
  }

  async findOne(id: string): Promise<LanguageDocument> {
    const language = await this.languageModel
      .findById(id)
      .populate('created_by')
      .exec();
    if (!language) {
      throw new NotFoundException('Language not found');
    }
    return language;
  }

  async findActive(): Promise<LanguageDocument[]> {
    return this.languageModel
      .find({ is_active: true })
      .populate('created_by')
      .exec();
  }

  async update(
    id: string,
    updateLanguageDto: UpdateLanguageDto,
  ): Promise<LanguageDocument> {
    const language = await this.languageModel
      .findByIdAndUpdate(id, updateLanguageDto, { new: true })
      .populate('created_by')
      .exec();
    if (!language) {
      throw new NotFoundException('Language not found');
    }
    return language;
  }

  async remove(id: string): Promise<void> {
    const result = await this.languageModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Language not found');
    }
  }
}
