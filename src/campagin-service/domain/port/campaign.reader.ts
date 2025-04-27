import { PaginatedCampaignListDto } from '@/src/campagin-service/ui/dto/paginated.campaign.list.dto';

export interface CampaignReader {
  findAllForList(page: number, limit: number): Promise<PaginatedCampaignListDto>;

}