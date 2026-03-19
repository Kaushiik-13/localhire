import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): MongooseModuleFactoryOptions => ({
  uri:
    configService.get<string>('MONGODB_URI') ||
    'mongodb://localhost:27017/localhire',
  dbName: configService.get<string>('MONGODB_DB_NAME') || 'localhire',
});
