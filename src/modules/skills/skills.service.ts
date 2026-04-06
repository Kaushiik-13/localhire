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

  async create(
    createSkillDto: CreateSkillDto,
    createdBy?: string,
  ): Promise<SkillDocument> {
    const existingSkill = await this.skillModel.findOne({
      skill_name: createSkillDto.skill_name,
    });
    if (existingSkill) {
      throw new ConflictException('Skill name already exists');
    }

    const skill = new this.skillModel({
      ...createSkillDto,
      created_by: createdBy ? new Types.ObjectId(createdBy) : undefined,
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

  async bulkCreateSkills(
    skills: Array<{ skill_name: string }>,
    _adminId: string,
  ): Promise<{
    message: string;
    created_count: number;
    failed_count: number;
    results: Array<{
      skill_name: string;
      status: 'success' | 'failed';
      message: string;
    }>;
  }> {
    const results: Array<{
      skill_name: string;
      status: 'success' | 'failed';
      message: string;
    }> = [];

    const createdCount = 0;
    const failedCount = 0;

    for (const skillData of skills) {
      try {
        const existingSkill = await this.skillModel.findOne({
          skill_name: skillData.skill_name,
        });

        if (existingSkill) {
          results.push({
            skill_name: skillData.skill_name,
            status: 'failed',
            message: 'Skill name already exists',
          });
          continue;
        }

        const skill = new this.skillModel({
          skill_name: skillData.skill_name,
          created_by: _adminId ? new Types.ObjectId(_adminId) : undefined,
        });

        await skill.save();

        results.push({
          skill_name: skillData.skill_name,
          status: 'success',
          message: 'Skill created successfully',
        });
      } catch (error) {
        results.push({
          skill_name: skillData.skill_name,
          status: 'failed',
          message: error.message || 'Failed to create skill',
        });
      }
    }

    const created_count = results.filter((r) => r.status === 'success').length;
    const failed_count = results.filter((r) => r.status === 'failed').length;

    return {
      message: `Bulk skill creation completed. ${created_count} created, ${failed_count} failed.`,
      created_count,
      failed_count,
      results,
    };
  }
}
