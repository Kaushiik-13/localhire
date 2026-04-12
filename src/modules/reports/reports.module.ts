import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Report, ReportSchema } from '../../schemas/report.schema';
import { Counter, CounterSchema } from '../../schemas/counter.schema';
import { UsersModule } from '../users/users.module';
import { ListingsModule } from '../listings/listings.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Report.name, schema: ReportSchema },
      { name: Counter.name, schema: CounterSchema },
    ]),
    UsersModule,
    ListingsModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
