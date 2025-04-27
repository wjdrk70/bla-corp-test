// src/product-service/ui/dto/create-create-product-request.dto.ts
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  brandName: string;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsNotEmpty()
  briefDescription: string;

  @IsString()
  @IsNotEmpty()
  guide: string;

  @IsString()
  @IsNotEmpty()
  productTypeCode: string; // 'VISIT', 'SERVICE'

  // 방문형 상품 관련 필드
  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  roadName?: string;

  // 서비스형 상품 관련 필드
  @IsOptional()
  @IsString()
  genderCode?: string;

  @IsOptional()
  @IsBoolean()
  isSponsored?: boolean;
}