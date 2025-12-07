import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillsMatrix } from './entities/skills-matrix.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SkillsMatrix])],
  exports: [TypeOrmModule],
})
export class SkillsModule {}

