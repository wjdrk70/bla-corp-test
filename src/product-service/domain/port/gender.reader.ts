import { Gender } from '@/src/product-service/domain/gender';

export interface GenderReader {
  findByCode(code: string): Promise<Gender | null>;

  findByCodeOrThrow(code: string): Promise<Gender>;
}
