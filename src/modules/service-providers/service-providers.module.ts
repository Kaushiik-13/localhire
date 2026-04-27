import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceProvidersController } from './service-providers.controller';
import { ServiceProviderMeController } from './service-provider-me.controller';
import { ServiceProvidersService } from './service-providers.service';
import {
  ServiceProvider,
  ServiceProviderSchema,
} from '../../schemas/service-provider.schema';
import { User, UserSchema } from '../../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceProvider.name, schema: ServiceProviderSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ServiceProvidersController, ServiceProviderMeController],
  providers: [ServiceProvidersService],
  exports: [ServiceProvidersService],
})
export class ServiceProvidersModule {}
