import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { Worker, WorkerDocument } from '../../schemas/worker.schema';
import { Employer, EmployerDocument } from '../../schemas/employer.schema';
import {
  ServiceProvider,
  ServiceProviderDocument,
} from '../../schemas/service-provider.schema';
import { Listing, ListingDocument } from '../../schemas/listing.schema';
import {
  JobApplication,
  JobApplicationDocument,
} from '../../schemas/job-application.schema';
import {
  ServiceBooking,
  ServiceBookingDocument,
} from '../../schemas/service-booking.schema';
import { Skill, SkillDocument } from '../../schemas/skill.schema';
import { ApprovalStatus } from '../../common/enums/approval.enum';
import { DocumentVerificationStatus } from '../../common/enums/status.enum';

export interface AdminListResponse<T> {
  count: number;
  data: T[];
}

export interface DashboardStats {
  totalUsers: number;
  totalWorkers: number;
  totalEmployers: number;
  totalServiceProviders: number;
  totalListings: number;
  totalJobApplications: number;
  totalServiceBookings: number;
}

export interface TrendData {
  month: string;
  users: number;
  listings: number;
  jobApplications: number;
}

interface TrendResult {
  _id: string;
  count: number;
}

interface SkillAggregateResult {
  _id: Types.ObjectId | string;
  count: number;
}

interface PopulatedListing {
  _id: Types.ObjectId;
  title: string;
  listing_type: string;
  status: string;
  approval_status: string;
  created_by: { name: string } | null;
  createdAt: Date;
}

interface PopulatedUser {
  _id: Types.ObjectId;
  name: string;
  phone: string;
  email: string | null;
  roles: string[];
  approval_status: string;
  createdAt: Date;
}

interface PopulatedWorker {
  _id: Types.ObjectId;
  experience_years: number;
  expected_salary: number | null;
  rating: number;
  completed_jobs: number;
  approval_status: string;
  user_id: { name: string } | null;
  createdAt: Date;
}

interface ListingAggregateResult {
  _id: Types.ObjectId;
  count: number;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Worker.name)
    private workerModel: Model<WorkerDocument>,
    @InjectModel(Employer.name)
    private employerModel: Model<EmployerDocument>,
    @InjectModel(ServiceProvider.name)
    private serviceProviderModel: Model<ServiceProviderDocument>,
    @InjectModel(Listing.name)
    private listingModel: Model<ListingDocument>,
    @InjectModel(JobApplication.name)
    private jobApplicationModel: Model<JobApplicationDocument>,
    @InjectModel(ServiceBooking.name)
    private serviceBookingModel: Model<ServiceBookingDocument>,
    @InjectModel(Skill.name)
    private skillModel: Model<SkillDocument>,
  ) {}

  private async syncUserApprovalStatus(
    userId: Types.ObjectId,
    status: ApprovalStatus,
    adminId: string,
  ): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, {
        approval_status: status,
        approved_by: new Types.ObjectId(adminId),
        approved_at: new Date(),
      })
      .exec();
  }

  // ============ APPROVAL METHODS ============

  private mapUserResponse(user: UserDocument): Record<string, unknown> {
    const obj = user.toObject() as Record<string, unknown>;
    const approvedBy = obj.approved_by as Record<string, unknown> | undefined;

    const identityDocs = (
      (obj.identity_docs as Record<string, unknown>[]) || []
    ).map((doc: Record<string, unknown>) => ({
      document_type: doc.document_type,
      document_number: doc.document_number,
      document_url: doc.document_url,
      verification_status: doc.verification_status,
      verified_by: doc.verified_by,
      verified_at: doc.verified_at,
    }));

    return {
      _id: obj._id,
      name: obj.name,
      phone: obj.phone,
      email: obj.email,
      roles: obj.roles,
      approval_status: obj.approval_status,
      approved_by: approvedBy
        ? {
            _id: approvedBy._id,
            name: approvedBy.name,
            phone: approvedBy.phone,
            email: approvedBy.email,
            roles: approvedBy.roles,
          }
        : null,
      approved_at: obj.approved_at,
      identity_docs: identityDocs,
    };
  }

  async findUsersByStatus(
    status: ApprovalStatus,
  ): Promise<AdminListResponse<UserDocument>> {
    const data = await this.userModel
      .find({ approval_status: status, roles: { $ne: 'admin' } })
      .populate('approved_by')
      .exec();

    const mappedData = data.map((user) => this.mapUserResponse(user));

    return {
      count: mappedData.length,
      data: mappedData as unknown as UserDocument[],
    };
  }

  async approveUser(id: string, adminId: string): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          approval_status: ApprovalStatus.APPROVED,
          approved_by: new Types.ObjectId(adminId),
          approved_at: new Date(),
        },
        { new: true },
      )
      .populate('approved_by')
      .exec();

    if (!user) throw new NotFoundException('User not found');
    return this.mapUserResponse(user) as unknown as UserDocument;
  }

  async rejectUser(id: string, adminId: string): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          approval_status: ApprovalStatus.REJECTED,
          approved_by: new Types.ObjectId(adminId),
          approved_at: new Date(),
        },
        { new: true },
      )
      .populate('approved_by')
      .exec();

    if (!user) throw new NotFoundException('User not found');
    return this.mapUserResponse(user) as unknown as UserDocument;
  }

  async findWorkersByStatus(
    status: ApprovalStatus,
  ): Promise<AdminListResponse<WorkerDocument>> {
    const data = await this.workerModel
      .find({ approval_status: status })
      .populate('user_id')
      .populate('approved_by')
      .populate('skills')
      .exec();
    return { count: data.length, data };
  }

  async approveWorker(id: string, adminId: string): Promise<WorkerDocument> {
    const worker = await this.workerModel
      .findByIdAndUpdate(
        id,
        {
          approval_status: ApprovalStatus.APPROVED,
          approved_by: new Types.ObjectId(adminId),
          approved_at: new Date(),
        },
        { new: true },
      )
      .populate('user_id')
      .populate('approved_by')
      .exec();

    if (!worker) throw new NotFoundException('Worker not found');

    await this.syncUserApprovalStatus(
      worker.user_id as unknown as Types.ObjectId,
      ApprovalStatus.APPROVED,
      adminId,
    );

    return worker;
  }

  async rejectWorker(id: string, adminId: string): Promise<WorkerDocument> {
    const worker = await this.workerModel
      .findByIdAndUpdate(
        id,
        {
          approval_status: ApprovalStatus.REJECTED,
          approved_by: new Types.ObjectId(adminId),
          approved_at: new Date(),
        },
        { new: true },
      )
      .populate('user_id')
      .populate('approved_by')
      .exec();

    if (!worker) throw new NotFoundException('Worker not found');

    await this.syncUserApprovalStatus(
      worker.user_id as unknown as Types.ObjectId,
      ApprovalStatus.REJECTED,
      adminId,
    );

    return worker;
  }

  async findEmployersByStatus(
    status: ApprovalStatus,
  ): Promise<AdminListResponse<EmployerDocument>> {
    const data = await this.employerModel
      .find({ approval_status: status })
      .populate('user_id')
      .populate('approved_by')
      .exec();
    return { count: data.length, data };
  }

  async approveEmployer(
    id: string,
    adminId: string,
  ): Promise<EmployerDocument> {
    const employer = await this.employerModel
      .findByIdAndUpdate(
        id,
        {
          approval_status: ApprovalStatus.APPROVED,
          approved_by: new Types.ObjectId(adminId),
          approved_at: new Date(),
        },
        { new: true },
      )
      .populate('user_id')
      .populate('approved_by')
      .exec();

    if (!employer) throw new NotFoundException('Employer not found');

    await this.syncUserApprovalStatus(
      employer.user_id as unknown as Types.ObjectId,
      ApprovalStatus.APPROVED,
      adminId,
    );

    return employer;
  }

  async rejectEmployer(id: string, adminId: string): Promise<EmployerDocument> {
    const employer = await this.employerModel
      .findByIdAndUpdate(
        id,
        {
          approval_status: ApprovalStatus.REJECTED,
          approved_by: new Types.ObjectId(adminId),
          approved_at: new Date(),
        },
        { new: true },
      )
      .populate('user_id')
      .populate('approved_by')
      .exec();

    if (!employer) throw new NotFoundException('Employer not found');

    await this.syncUserApprovalStatus(
      employer.user_id as unknown as Types.ObjectId,
      ApprovalStatus.REJECTED,
      adminId,
    );

    return employer;
  }

  async findServiceProvidersByStatus(
    status: ApprovalStatus,
  ): Promise<AdminListResponse<ServiceProviderDocument>> {
    const data = await this.serviceProviderModel
      .find({ approval_status: status })
      .populate('user_id')
      .populate('approved_by')
      .exec();
    return { count: data.length, data };
  }

  async approveServiceProvider(
    id: string,
    adminId: string,
  ): Promise<ServiceProviderDocument> {
    const serviceProvider = await this.serviceProviderModel
      .findByIdAndUpdate(
        id,
        {
          approval_status: ApprovalStatus.APPROVED,
          approved_by: new Types.ObjectId(adminId),
          approved_at: new Date(),
        },
        { new: true },
      )
      .populate('user_id')
      .populate('approved_by')
      .exec();

    if (!serviceProvider)
      throw new NotFoundException('Service provider not found');

    await this.syncUserApprovalStatus(
      serviceProvider.user_id as unknown as Types.ObjectId,
      ApprovalStatus.APPROVED,
      adminId,
    );

    return serviceProvider;
  }

  async rejectServiceProvider(
    id: string,
    adminId: string,
  ): Promise<ServiceProviderDocument> {
    const serviceProvider = await this.serviceProviderModel
      .findByIdAndUpdate(
        id,
        {
          approval_status: ApprovalStatus.REJECTED,
          approved_by: new Types.ObjectId(adminId),
          approved_at: new Date(),
        },
        { new: true },
      )
      .populate('user_id')
      .populate('approved_by')
      .exec();

    if (!serviceProvider)
      throw new NotFoundException('Service provider not found');

    await this.syncUserApprovalStatus(
      serviceProvider.user_id as unknown as Types.ObjectId,
      ApprovalStatus.REJECTED,
      adminId,
    );

    return serviceProvider;
  }

  // ============ SUSPEND METHODS ============

  async suspendUser(id: string, adminId: string): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          approval_status: ApprovalStatus.SUSPENDED,
          approved_by: new Types.ObjectId(adminId),
          approved_at: new Date(),
        },
        { new: true },
      )
      .populate('approved_by')
      .exec();

    if (!user) throw new NotFoundException('User not found');
    return this.mapUserResponse(user) as unknown as UserDocument;
  }

  async suspendWorker(id: string, adminId: string): Promise<WorkerDocument> {
    const worker = await this.workerModel
      .findByIdAndUpdate(
        id,
        {
          approval_status: ApprovalStatus.SUSPENDED,
          approved_by: new Types.ObjectId(adminId),
          approved_at: new Date(),
        },
        { new: true },
      )
      .populate('user_id')
      .populate('approved_by')
      .exec();

    if (!worker) throw new NotFoundException('Worker not found');

    await this.syncUserApprovalStatus(
      worker.user_id as unknown as Types.ObjectId,
      ApprovalStatus.SUSPENDED,
      adminId,
    );

    return worker;
  }

  async suspendEmployer(
    id: string,
    adminId: string,
  ): Promise<EmployerDocument> {
    const employer = await this.employerModel
      .findByIdAndUpdate(
        id,
        {
          approval_status: ApprovalStatus.SUSPENDED,
          approved_by: new Types.ObjectId(adminId),
          approved_at: new Date(),
        },
        { new: true },
      )
      .populate('user_id')
      .populate('approved_by')
      .exec();

    if (!employer) throw new NotFoundException('Employer not found');

    await this.syncUserApprovalStatus(
      employer.user_id as unknown as Types.ObjectId,
      ApprovalStatus.SUSPENDED,
      adminId,
    );

    return employer;
  }

  async suspendServiceProvider(
    id: string,
    adminId: string,
  ): Promise<ServiceProviderDocument> {
    const serviceProvider = await this.serviceProviderModel
      .findByIdAndUpdate(
        id,
        {
          approval_status: ApprovalStatus.SUSPENDED,
          approved_by: new Types.ObjectId(adminId),
          approved_at: new Date(),
        },
        { new: true },
      )
      .populate('user_id')
      .populate('approved_by')
      .exec();

    if (!serviceProvider)
      throw new NotFoundException('Service provider not found');

    await this.syncUserApprovalStatus(
      serviceProvider.user_id as unknown as Types.ObjectId,
      ApprovalStatus.SUSPENDED,
      adminId,
    );

    return serviceProvider;
  }

  // ============ IDENTITY DOC VERIFICATION ============

  async approveIdentityDoc(
    userId: string,
    docId: string,
    adminId: string,
  ): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const docIndex = user.identity_docs.findIndex(
      (d) => (d as any)._id?.toString() === docId,
    );
    if (docIndex === -1)
      throw new NotFoundException('Identity document not found');

    user.identity_docs[docIndex].verification_status =
      DocumentVerificationStatus.APPROVED;
    user.identity_docs[docIndex].verified_by = new Types.ObjectId(adminId);
    user.identity_docs[docIndex].verified_at = new Date();

    await user.save();
    return user;
  }

  async rejectIdentityDoc(
    userId: string,
    docId: string,
    adminId: string,
  ): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const docIndex = user.identity_docs.findIndex(
      (d) => (d as any)._id?.toString() === docId,
    );
    if (docIndex === -1)
      throw new NotFoundException('Identity document not found');

    user.identity_docs[docIndex].verification_status =
      DocumentVerificationStatus.REJECTED;
    user.identity_docs[docIndex].verified_by = new Types.ObjectId(adminId);
    user.identity_docs[docIndex].verified_at = new Date();

    await user.save();
    return user;
  }

  // ============ DASHBOARD STATS ============

  async getDashboardStats(): Promise<DashboardStats> {
    const [
      totalUsers,
      totalWorkers,
      totalEmployers,
      totalServiceProviders,
      totalListings,
      totalJobApplications,
      totalServiceBookings,
    ] = await Promise.all([
      this.userModel.countDocuments().exec(),
      this.workerModel.countDocuments().exec(),
      this.employerModel.countDocuments().exec(),
      this.serviceProviderModel.countDocuments().exec(),
      this.listingModel.countDocuments().exec(),
      this.jobApplicationModel.countDocuments().exec(),
      this.serviceBookingModel.countDocuments().exec(),
    ]);

    return {
      totalUsers,
      totalWorkers,
      totalEmployers,
      totalServiceProviders,
      totalListings,
      totalJobApplications,
      totalServiceBookings,
    };
  }

  async getListingsSummary(): Promise<any> {
    const [byType, byStatus, byApproval] = await Promise.all([
      this.listingModel.aggregate([
        { $group: { _id: '$listing_type', count: { $sum: 1 } } },
      ]),
      this.listingModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      this.listingModel.aggregate([
        { $group: { _id: '$approval_status', count: { $sum: 1 } } },
      ]),
    ]);

    return { byType, byStatus, byApproval };
  }

  async getApplicationsSummary(): Promise<any> {
    const [jobAppsByStatus, bookingsByStatus] = await Promise.all([
      this.jobApplicationModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      this.serviceBookingModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    return {
      jobApplications: jobAppsByStatus,
      serviceBookings: bookingsByStatus,
    };
  }

  async getTrends(months: number = 6): Promise<TrendData[]> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const trends = await Promise.all([
      this.getUserTrends(startDate),
      this.getListingTrends(startDate),
      this.getApplicationTrends(startDate),
    ]);

    const monthsArray: TrendData[] = [];
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().slice(0, 7);

      monthsArray.push({
        month: monthKey,
        users: trends[0][monthKey] || 0,
        listings: trends[1][monthKey] || 0,
        jobApplications: trends[2][monthKey] || 0,
      });
    }

    return monthsArray;
  }

  private async getUserTrends(
    startDate: Date,
  ): Promise<Record<string, number>> {
    const users = await this.userModel.aggregate<TrendResult>([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
    ]);
    return users.reduce<Record<string, number>>(
      (acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  private async getListingTrends(
    startDate: Date,
  ): Promise<Record<string, number>> {
    const listings = await this.listingModel.aggregate<TrendResult>([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
    ]);
    return listings.reduce<Record<string, number>>(
      (acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  private async getApplicationTrends(
    startDate: Date,
  ): Promise<Record<string, number>> {
    const applications = await this.jobApplicationModel.aggregate<TrendResult>([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
    ]);
    return applications.reduce<Record<string, number>>(
      (acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  // ============ LISTINGS ANALYTICS ============

  async getListingsByStatus(): Promise<AdminListResponse<any>> {
    const data = await this.listingModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    return { count: data.length, data };
  }

  async getListingsByApproval(): Promise<AdminListResponse<any>> {
    const data = await this.listingModel.aggregate([
      { $group: { _id: '$approval_status', count: { $sum: 1 } } },
    ]);
    return { count: data.length, data };
  }

  async getListingsByType(): Promise<AdminListResponse<any>> {
    const data = await this.listingModel.aggregate([
      { $group: { _id: '$listing_type', count: { $sum: 1 } } },
    ]);
    return { count: data.length, data };
  }

  async getListingsByJobType(): Promise<AdminListResponse<any>> {
    const data = await this.listingModel.aggregate([
      { $match: { listing_type: 'job' } },
      { $unwind: '$job_details' },
      { $group: { _id: '$job_details.job_type', count: { $sum: 1 } } },
    ]);
    return { count: data.length, data };
  }

  async getSkillsStats(): Promise<any[]> {
    const skills = await this.skillModel.find().exec();
    const totalWorkers = await this.workerModel.countDocuments();
    const totalSPs = await this.serviceProviderModel.countDocuments();
    const totalPeople = totalWorkers + totalSPs;

    const workerSkillCounts = await this.workerModel.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
    ]);

    const spSkillCounts = await this.serviceProviderModel.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
    ]);

    const skillCountMap = new Map<string, number>();
    workerSkillCounts.forEach((s) => {
      const key = s._id.toString();
      skillCountMap.set(key, (skillCountMap.get(key) || 0) + s.count);
    });
    spSkillCounts.forEach((s) => {
      const key = s._id.toString();
      skillCountMap.set(key, (skillCountMap.get(key) || 0) + s.count);
    });

    return skills
      .map((skill) => {
        const idStr = skill._id.toString();
        const count = skillCountMap.get(idStr) || 0;
        const percentage =
          totalPeople > 0 ? ((count / totalPeople) * 100).toFixed(1) : '0';

        return {
          skill_name: skill.skill_name,
          count,
          percentage: `${percentage}%`,
        };
      })
      .sort((a, b) => b.count - a.count);
  }

  async getListingsByLocation(): Promise<AdminListResponse<any>> {
    const data = await this.listingModel.aggregate([
      { $match: { 'address.city': { $exists: true, $ne: null } } },
      { $group: { _id: '$address.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);
    return { count: data.length, data };
  }

  async getListingsBySkills(): Promise<AdminListResponse<any>> {
    const data = await this.listingModel.aggregate<SkillAggregateResult>([
      { $match: { listing_type: 'job' } },
      { $unwind: '$job_details' },
      { $unwind: '$job_details.required_skills' },
      { $group: { _id: '$job_details.required_skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);

    const skillIds = data
      .map((d) => d._id)
      .filter((id): id is Types.ObjectId => {
        if (id instanceof Types.ObjectId) return true;
        if (typeof id === 'string' && Types.ObjectId.isValid(id)) return true;
        return false;
      });

    const skills = await this.skillModel
      .find({ _id: { $in: skillIds } })
      .exec();
    const skillMap = new Map(
      skills.map((s) => [s._id.toString(), s.skill_name]),
    );

    const enrichedData = data.map((d) => {
      const idStr = String(d._id);
      return {
        _id: skillMap.get(idStr) || idStr,
        count: d.count,
      };
    });

    return { count: enrichedData.length, data: enrichedData };
  }

  async getListingsSalaryRange(): Promise<AdminListResponse<any>> {
    const data = await this.listingModel.aggregate([
      { $match: { listing_type: 'job' } },
      { $unwind: '$job_details' },
      {
        $group: {
          _id: null,
          avgSalaryMin: { $avg: '$job_details.salary_min' },
          avgSalaryMax: { $avg: '$job_details.salary_max' },
          minSalary: { $min: '$job_details.salary_min' },
          maxSalary: { $max: '$job_details.salary_max' },
          count: { $sum: 1 },
        },
      },
    ]);
    return { count: data.length, data };
  }

  async getListingsPriceRange(): Promise<AdminListResponse<any>> {
    const data = await this.listingModel.aggregate([
      { $match: { listing_type: 'service' } },
      { $unwind: '$service_details' },
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$service_details.price' },
          minPrice: { $min: '$service_details.price' },
          maxPrice: { $max: '$service_details.price' },
          count: { $sum: 1 },
        },
      },
    ]);
    return { count: data.length, data };
  }

  async getListingsExpiringSoon(
    days: number = 30,
  ): Promise<AdminListResponse<ListingDocument>> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const data = await this.listingModel
      .find({
        'job_details.end_date': {
          $gte: new Date(),
          $lte: futureDate,
        },
      })
      .populate('created_by')
      .exec();

    return { count: data.length, data };
  }

  async getPopularListings(
    limit: number = 10,
  ): Promise<AdminListResponse<any>> {
    const [jobApplications, serviceBookings] = await Promise.all([
      this.jobApplicationModel.aggregate<ListingAggregateResult>([
        { $group: { _id: '$listing_id', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
      ]),
      this.serviceBookingModel.aggregate<ListingAggregateResult>([
        { $group: { _id: '$listing_id', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
      ]),
    ]);

    const listingIds: Types.ObjectId[] = [];
    for (const j of jobApplications) {
      if (j._id) listingIds.push(j._id);
    }
    for (const s of serviceBookings) {
      if (s._id) listingIds.push(s._id);
    }

    const uniqueIds = [...new Set(listingIds.map((id) => id.toString()))];

    const data = await this.listingModel
      .find({ _id: { $in: uniqueIds } })
      .populate('created_by')
      .exec();

    const enrichedData = data.map((listing) => {
      const listingIdStr = listing._id.toString();
      const jobApp = jobApplications.find(
        (j) => j._id && j._id.toString() === listingIdStr,
      );
      const serviceApp = serviceBookings.find(
        (s) => s._id && s._id.toString() === listingIdStr,
      );
      const listingObj = listing.toObject() as unknown as Record<
        string,
        unknown
      >;
      return {
        ...listingObj,
        applicationCount: (jobApp?.count || 0) + (serviceApp?.count || 0),
      };
    });

    enrichedData.sort((a, b) => b.applicationCount - a.applicationCount);

    return { count: enrichedData.length, data: enrichedData };
  }

  // ============ CSV EXPORT ============

  async exportListingsCsv(): Promise<string> {
    const listings = await this.listingModel
      .find<PopulatedListing>()
      .populate('created_by')
      .exec();

    const headers = [
      'ID',
      'Title',
      'Type',
      'Status',
      'Approval Status',
      'Created By',
      'Created At',
    ].join(',');

    const rows = listings.map((l) =>
      [
        l._id,
        `"${l.title}"`,
        l.listing_type,
        l.status,
        l.approval_status,
        l.created_by?.name || '',
        l.createdAt?.toISOString() || '',
      ].join(','),
    );

    return [headers, ...rows].join('\n');
  }

  async exportUsersCsv(): Promise<string> {
    const users = await this.userModel.find<PopulatedUser>().exec();

    const headers = [
      'ID',
      'Name',
      'Phone',
      'Email',
      'Roles',
      'Approval Status',
      'Created At',
    ].join(',');

    const rows = users.map((u) =>
      [
        u._id,
        `"${u.name}"`,
        u.phone,
        u.email || '',
        u.roles.join(';'),
        u.approval_status,
        u.createdAt?.toISOString() || '',
      ].join(','),
    );

    return [headers, ...rows].join('\n');
  }

  async exportWorkersCsv(): Promise<string> {
    const workers = await this.workerModel
      .find<PopulatedWorker>()
      .populate('user_id')
      .exec();

    const headers = [
      'ID',
      'User Name',
      'Experience Years',
      'Expected Salary',
      'Rating',
      'Completed Jobs',
      'Approval Status',
      'Created At',
    ].join(',');

    const rows = workers.map((w) =>
      [
        w._id,
        `"${w.user_id?.name || ''}"`,
        w.experience_years,
        w.expected_salary || '',
        w.rating,
        w.completed_jobs,
        w.approval_status,
        w.createdAt?.toISOString() || '',
      ].join(','),
    );

    return [headers, ...rows].join('\n');
  }
}
