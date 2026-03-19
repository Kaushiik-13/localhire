import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WorkersModule } from './modules/workers/workers.module';
import { ServiceProvidersModule } from './modules/service-providers/service-providers.module';
import { EmployersModule } from './modules/employers/employers.module';
import { ListingsModule } from './modules/listings/listings.module';
import { JobApplicationsModule } from './modules/job-applications/job-applications.module';
import { ServiceBookingsModule } from './modules/service-bookings/service-bookings.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SkillsModule } from './modules/skills/skills.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { UploadsModule } from './modules/uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGODB_URI') ||
          'mongodb://localhost:27017/localhire',
        dbName: configService.get<string>('MONGODB_DB_NAME') || 'localhire',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    WorkersModule,
    ServiceProvidersModule,
    EmployersModule,
    ListingsModule,
    JobApplicationsModule,
    ServiceBookingsModule,
    ReviewsModule,
    NotificationsModule,
    SkillsModule,
    CategoriesModule,
    UploadsModule,
  ],
})
export class AppModule {}
