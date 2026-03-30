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

  // ============ APPROVAL METHODS ============

  async findUsersByStatus(
    status: ApprovalStatus,
  ): Promise<AdminListResponse<UserDocument>> {
    const data = await this.userModel
      .find({ approval_status: status })
      .populate('approved_by')
      .exec();
    return { count: data.length, data };
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
    return user;
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
    return user;
  }

  async findWorkersByStatus(
    status: ApprovalStatus,
  ): Promise<AdminListResponse<WorkerDocument>> {
    const data = await this.workerModel
      .find({ approval_status: status })
      .populate('user_id')
      .populate('approved_by')
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
    return serviceProvider;
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
    const users = await this.userModel.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
    ]);
    return users.reduce(
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
    const listings = await this.listingModel.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
    ]);
    return listings.reduce(
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
    const applications = await this.jobApplicationModel.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
    ]);
    return applications.reduce(
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
    const data = await this.listingModel.aggregate([
      { $match: { listing_type: 'job' } },
      { $unwind: '$job_details' },
      { $unwind: '$job_details.required_skills' },
      { $group: { _id: '$job_details.required_skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);

    const skillIds = data.map((d) => d._id).filter(Boolean);
    const skills = await this.skillModel
      .find({ _id: { $in: skillIds } })
      .exec();
    const skillMap = new Map(
      skills.map((s) => [s._id.toString(), s.skill_name]),
    );

    const enrichedData = data.map((d) => ({
      _id: skillMap.get(d._id?.toString()) || d._id,
      count: d.count,
    }));

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
      this.jobApplicationModel.aggregate([
        { $group: { _id: '$listing_id', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
      ]),
      this.serviceBookingModel.aggregate([
        { $group: { _id: '$listing_id', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
      ]),
    ]);

    const listingIds = [
      ...jobApplications.map((j) => j._id),
      ...serviceBookings.map((s) => s._id),
    ];

    const uniqueIds = [...new Set(listingIds.map((id) => id.toString()))];

    const data = await this.listingModel
      .find({ _id: { $in: uniqueIds } })
      .populate('created_by')
      .exec();

    const enrichedData = data.map((listing) => {
      const jobApp = jobApplications.find(
        (j) => j._id?.toString() === listing._id.toString(),
      );
      const serviceApp = serviceBookings.find(
        (s) => s._id?.toString() === listing._id.toString(),
      );
      return {
        ...listing.toObject(),
        applicationCount: (jobApp?.count || 0) + (serviceApp?.count || 0),
      };
    });

    enrichedData.sort((a, b) => b.applicationCount - a.applicationCount);

    return { count: enrichedData.length, data: enrichedData };
  }

  // ============ CSV EXPORT ============

  async exportListingsCsv(): Promise<string> {
    const listings = await this.listingModel
      .find()
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
        (l as any).created_by?.name || '',
        (l as any).createdAt?.toISOString() || '',
      ].join(','),
    );

    return [headers, ...rows].join('\n');
  }

  async exportUsersCsv(): Promise<string> {
    const users = await this.userModel.find().exec();

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
        (u as any).createdAt?.toISOString() || '',
      ].join(','),
    );

    return [headers, ...rows].join('\n');
  }

  async exportWorkersCsv(): Promise<string> {
    const workers = await this.workerModel.find().populate('user_id').exec();

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
        `"${(w as any).user_id?.name || ''}"`,
        w.experience_years,
        w.expected_salary || '',
        w.rating,
        w.completed_jobs,
        w.approval_status,
        (w as any).createdAt?.toISOString() || '',
      ].join(','),
    );

    return [headers, ...rows].join('\n');
  }
}
