import { ScheduleItemDto } from '@/src/campagin-service/ui/dto/schedule-item.dto';

export class CampaignListItemDto {
  id!: number;
  name!: string;
  budget!: number;
  peopleCount!: number;
  createdAt!: string;   // ISO

  product!:{
    productId: number;
    brandName: string;
    productName: string;
    productTypeCode: string;
    briefDescription: string;
    postalCode?:string;
    roadName?:string;
    genderCode?:string;
    isSponsored:boolean;
  }

  campaignType!: {
    code: string;
    label: string;
  };

  influencerPlatform!: {
    code: string;
    label: string;
  };
  schedules!: ScheduleItemDto[];
}
