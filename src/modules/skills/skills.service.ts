import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Skill, SkillDocument } from '../../schemas/skill.schema';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/create-skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectModel(Skill.name) private skillModel: Model<SkillDocument>,
  ) {}

  async create(createSkillDto: CreateSkillDto): Promise<SkillDocument> {
    const existingSkill = await this.skillModel.findOne({
      skill_name: createSkillDto.skill_name,
    });
    if (existingSkill) {
      throw new ConflictException('Skill name already exists');
    }

    const skill = new this.skillModel({
      ...createSkillDto,
      created_by: createSkillDto.created_by
        ? new Types.ObjectId(createSkillDto.created_by)
        : undefined,
    });
    return skill.save();
  }

  async findAll(): Promise<SkillDocument[]> {
    return this.skillModel.find().populate('created_by').exec();
  }

  async findOne(id: string): Promise<SkillDocument> {
    const skill = await this.skillModel
      .findById(id)
      .populate('created_by')
      .exec();
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }
    return skill;
  }

  async findByCategory(category: string): Promise<SkillDocument[]> {
    return this.skillModel.find({ category, is_active: true }).exec();
  }

  async update(
    id: string,
    updateSkillDto: UpdateSkillDto,
  ): Promise<SkillDocument> {
    const skill = await this.skillModel
      .findByIdAndUpdate(id, updateSkillDto, { new: true })
      .populate('created_by')
      .exec();
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }
    return skill;
  }

  async remove(id: string): Promise<void> {
    const result = await this.skillModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Skill not found');
    }
  }
}
