import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformSettings } from './entities/platform-settings.entity';
import { AdminAuditLog } from './entities/admin-audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformSettings, AdminAuditLog])],
  exports: [TypeOrmModule],
})
export class AdminModule {}

