import { InfluencerPlatform } from '@/src/campagin-service/domain/influencer.platform';


export interface InfluencePlatformReader {
  findByCodeOrThrow(code: string): Promise<InfluencerPlatform>;

  findByIdOrThrow(id: number): Promise<InfluencerPlatform>;


}