import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployersController } from './employers.controller';
import { EmployersService } from './employers.service';
import { Employer, EmployerSchema } from '../../schemas/employer.schema';
import { User, UserSchema } from '../../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employer.name, schema: EmployerSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [EmployersController],
  providers: [EmployersService],
  exports: [EmployersService],
})
export class EmployersModule {}
