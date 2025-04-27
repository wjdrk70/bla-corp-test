import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignModule } from '@/src/campagin-service/campaign.module';
import { DatabaseModule } from '@/src/databases/database.module';
import { ProductModule } from '@/src/product-service/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    DatabaseModule,
    CampaignModule,
    ProductModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
