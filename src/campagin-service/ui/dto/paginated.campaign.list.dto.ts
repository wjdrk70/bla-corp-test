import { CampaignListItemDto } from '@/src/campagin-service/ui/dto/campaign-list-item.dto';

export class PaginatedCampaignListDto {
  items: CampaignListItemDto[];
  totalCount: number;
}