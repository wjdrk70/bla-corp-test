export interface RawCampaignBase {
  // Campaign
  id: number;
  name: string;
  budget: string;
  peopleCount: number;
  createdAt: string; // ISO Format
  // Product (Base + FKs)
  productId: number;
  productName: string;
  brandName: string;
  briefDescription: string;
  isSponsored?: boolean | null;
  productTypeId: number; // FK
  addressId?: number | null;  // FK (Nullable)
  genderId?: number | null;   // FK (Nullable)
  // Campaign Type
  campaignTypeCode: string;
  campaignTypeLabel: string;
  // Influencer Platform
  influencerPlatformCode: string;
  influencerPlatformLabel: string;
}

// 후속 쿼리 타입들
export interface RawSchedule {
  campaignId: number; // 그룹핑을 위해 campaignId 포함
  scheduleTypeCode: string;
  startDate: string;
  endDate: string | null;
}

export interface RawAddress {
  addressId: number; // 매핑을 위해 id 포함
  postalCode: string;
  roadName: string;
}

export interface RawGender {
  genderId: number; // 매핑을 위해 id 포함
  genderCode: string;
  // genderLabel: string; // 필요시 추가
}

export interface RawProductType {
  productTypeId: number; // 매핑을 위해 id 포함
  productTypeCode: string;
  // productTypeLabel: string; // 필요시 추가
}