import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles_decorator = (...roles: Role[]) =>
  SetMetadata(ROLES_KEY, roles);
