import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ProductTypeCode } from '@/src/product-service/domain/product.type';

export class CreateProductRequestDto {
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

  @IsEnum(ProductTypeCode)
  productTypeCode!: ProductTypeCode; // 'VISIT', 'SERVICE' 등


  @IsOptional() @IsString() postalCode?: string;
  @IsOptional() @IsString() roadName?: string;
  @IsOptional() @IsString() genderCode?: string;
  @IsOptional() @IsBoolean() isSponsored?: boolean;
}
