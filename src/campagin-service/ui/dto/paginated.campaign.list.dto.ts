import { CampaignDetailItemDto } from '@/src/campagin-service/ui/dto/campaign-detail-item.dto';

export class PaginatedCampaignListDto {
  items: CampaignDetailItemDto[];
  totalCount: number;
}