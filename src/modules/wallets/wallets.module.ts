import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Payout } from './entities/payout.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Payout])],
  exports: [TypeOrmModule],
})
export class WalletsModule {}

