import { DataSource, EntityManager } from 'typeorm';
import { CampaignService } from '@/src/campagin-service/application/service/campaign.service';
import { CampaignRepository } from '@/src/campagin-service/domain/repository/campaign.repository';
import { CampaignTypeRepository } from '@/src/campagin-service/domain/repository/campaign-type-repository';
import { CampaignScheduleRepository } from '@/src/campagin-service/domain/repository/campaign-schedule.repository';
import { CampaignDomainService } from '@/src/campagin-service/domain/service/campaign.domain.service';
import { InfluencePlatformRepository } from '@/src/campagin-service/domain/repository/influence-platform.repository';
import { ScheduleTypeRepository } from '@/src/campagin-service/domain/repository/scehduel-type.repository';
import { ProductService } from '@/src/product-service/application/service/product.service';
import { CampaignQueryRepository } from '@/src/campagin-service/domain/repository/campaign.query.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { PaginatedCampaignListDto } from '@/src/campagin-service/ui/dto/paginated.campaign.list.dto';
import { CreateCampaignDto } from '@/src/campagin-service/ui/dto/create-campaign.dto';
import { Product } from '@/src/product-service/domain/product';
import { CampaignType, CampaignTypeCode } from '@/src/campagin-service/domain/campaign.type';
import { Campaign } from '@/src/campagin-service/domain/campaign';
import { ScheduleType, ScheduleTypeCode } from '@/src/campagin-service/domain/schedule.type';
import { InfluencerPlatform, InfluencerPlatformCode } from '@/src/campagin-service/domain/influencer.platform';
import { CampaignSchedule } from '@/src/campagin-service/domain/campaign.schedule';
import { CreateProductRequestDto } from '@/src/product-service/ui/create-product-request.dto';
import { ProductType, ProductTypeCode } from '@/src/product-service/domain/product.type';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CampaignDetailItemDto } from '@/src/campagin-service/ui/dto/campaign-detail-item.dto';
import { Gender } from '@/src/product-service/domain/gender';

const createMockRepository = () => ({
  withTransaction: jest.fn().mockReturnThis(), // Chainable for simplicity in tests
  save: jest.fn(),
  saveMany: jest.fn(),
  findByCodeOrThrow: jest.fn(),
  findByCampaignTypeAndPlatform: jest.fn(),
  findAllForList: jest.fn(),
});

const createMockService = () => ({
  createProduct: jest.fn(),
  createCampaign: jest.fn(),
  createCampaignSchedule: jest.fn(),
  validateSupportedScheduleTypes: jest.fn(),
  validateRequiredScheduleTypes: jest.fn(),
});

const createMockDataSource = () => ({
  transaction: jest.fn().mockImplementation(async (callback) => {
    const mockManager = createMockEntityManager();
    return await callback(mockManager);
  }),
});

const createMockEntityManager = (): EntityManager => ({}) as EntityManager;

type DeepMocked<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? jest.Mock
    : DeepMocked<T[K]>;
} & T;

describe('CampaignService 테스트', () => {
  let service: CampaignService;
  let dataSource: DeepMocked<DataSource>;
  let campaignRepository: DeepMocked<CampaignRepository>;
  let campaignTypeRepository: DeepMocked<CampaignTypeRepository>;
  let campaignScheduleRepository: DeepMocked<CampaignScheduleRepository>;
  let campaignDomainService: DeepMocked<CampaignDomainService>;
  let influencerPlatformRepository: DeepMocked<InfluencePlatformRepository>;
  let scheduleTypeRepository: DeepMocked<ScheduleTypeRepository>;
  let productService: DeepMocked<ProductService>;
  let campaignQueryRepository: DeepMocked<CampaignQueryRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignService,
        { provide: DataSource, useFactory: createMockDataSource },
        { provide: CampaignRepository, useFactory: createMockRepository },
        { provide: CampaignTypeRepository, useFactory: createMockRepository },
        {
          provide: CampaignScheduleRepository,
          useFactory: createMockRepository,
        },
        { provide: CampaignDomainService, useFactory: createMockService },
        {
          provide: InfluencePlatformRepository,
          useFactory: createMockRepository,
        },
        { provide: ScheduleTypeRepository, useFactory: createMockRepository },
        { provide: ProductService, useFactory: createMockService },
        { provide: CampaignQueryRepository, useFactory: createMockRepository },
      ],
    }).compile();

    service = module.get<CampaignService>(CampaignService);
    dataSource = module.get(DataSource) as DeepMocked<DataSource>;
    campaignRepository = module.get(
      CampaignRepository,
    ) as DeepMocked<CampaignRepository>;
    campaignTypeRepository = module.get(
      CampaignTypeRepository,
    ) as DeepMocked<CampaignTypeRepository>;
    campaignScheduleRepository = module.get(
      CampaignScheduleRepository,
    ) as DeepMocked<CampaignScheduleRepository>;
    campaignDomainService = module.get(
      CampaignDomainService,
    ) as DeepMocked<CampaignDomainService>;
    influencerPlatformRepository = module.get(
      InfluencePlatformRepository,
    ) as DeepMocked<InfluencePlatformRepository>;
    scheduleTypeRepository = module.get(
      ScheduleTypeRepository,
    ) as DeepMocked<ScheduleTypeRepository>;
    productService = module.get(ProductService) as DeepMocked<ProductService>;
    campaignQueryRepository = module.get(
      CampaignQueryRepository,
    ) as DeepMocked<CampaignQueryRepository>;

    campaignRepository.withTransaction.mockReturnThis();
    campaignTypeRepository.withTransaction.mockReturnThis();
    influencerPlatformRepository.withTransaction.mockReturnThis();
    scheduleTypeRepository.withTransaction.mockReturnThis();
    campaignScheduleRepository.withTransaction.mockReturnThis();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCampaign 테스트', () => {
    it('query repository 에서 페이지네이션된 캠페인 목록을 반환 한다.', async () => {
      //given
      const page = 1;
      const limit = 10;
      const expectedResult: PaginatedCampaignListDto = {
        items: [
          {
            id: 1,
            name: 'test_bid_youtube',
            budget: 20000,
            peopleCount: 3,
            createdAt: '2025-04-27T13:45:44Z',
            product: {
              productId: 1,
              productName: '곰곰 부대찌개',
              brandName: 'coupang',
              productTypeCode: 'SERVICE',
              briefDescription: '맛있어요',
              genderCode: 'M',
              isSponsored: false,
            },
            campaignType: {
              code: 'BID',
              label: '입찰형',
            },
            influencerPlatform: {
              code: 'YOUTUBE',
              label: '유튜브',
            },
            schedules: [
              {
                scheduleTypeCode: 'BID',
                startDate: '2025-06-01',
                endDate: null,
              },
              {
                scheduleTypeCode: 'CASTING',
                startDate: '2025-06-05',
                endDate: null,
              },
              {
                scheduleTypeCode: 'CONTENT_UPLOAD',
                startDate: '2025-06-10',
                endDate: '2025-06-20',
              },
            ],
          },
        ],
        totalCount: 1,
      };

      campaignQueryRepository.findAllForList.mockResolvedValue(expectedResult);

      //when
      const result = await service.getAllCampaign(page, limit);

      //then
      expect(result).toEqual(expectedResult);
      expect(campaignQueryRepository.findAllForList).toHaveBeenCalledTimes(1);
      expect(campaignQueryRepository.findAllForList).toHaveBeenCalledWith(
        page,
        limit,
      );
    });

    it('주어진 페이지에 캠페인이 없을 경우 빈 목록과 총 개수를 반환해야 한다', async () => {
      // given
      const page = 5;
      const limit = 20;

      const expectedResult: PaginatedCampaignListDto = {
        items: [],
        totalCount: 45,
      };
      campaignQueryRepository.findAllForList.mockResolvedValue(expectedResult);

      // when
      const result = await service.getAllCampaign(page, limit);

      // then
      expect(result).toEqual(expectedResult); // 구조 확인
      expect(campaignQueryRepository.findAllForList).toHaveBeenCalledTimes(1);
      expect(campaignQueryRepository.findAllForList).toHaveBeenCalledWith(
        page,
        limit,
      );
    });
  });

  describe('create 캠페인', () => {
    const testProductDto: CreateProductRequestDto = {
      brandName: '간결한 브랜드',
      productName: '간결한 상품',
      briefDescription: '설명',
      guide: '가이드',
      productTypeCode: ProductTypeCode.SERVICE,
      genderCode: 'M',
      isSponsored: false,
    };

    const testCampaignDto: CreateCampaignDto = {
      name: '읽기 쉬운 캠페인',
      budget: 10000,
      peopleCount: 5,
      product: testProductDto,
      campaignTypeCode: CampaignTypeCode.RECRUIT,
      influencerPlatformCode: InfluencerPlatformCode.INSTAGRAM,
      schedules: [
        { scheduleTypeCode: 'RECRUIT', startDate: new Date('2025-09-01'), endDate: new Date('2025-09-10') },
        { scheduleTypeCode: 'CONTENT_UPLOAD', startDate: new Date('2025-09-15'), endDate: new Date('2025-09-30') },
      ],
    };
    const createPartialMock = <T>(props: Partial<T>): T => props as T;
    let mockProduct: Product;
    let mockProductType: ProductType;
    let mockGender: Gender;
    let mockCampaignType: CampaignType;
    let mockPlatform: InfluencerPlatform;
    let mockSavedCampaign: Campaign;
    let mockValidScheduleTypes: ScheduleType[];
    let mockSchedulesToSave: CampaignSchedule[];

    beforeEach(() => {
      mockProductType = { id: 501, code: testProductDto.productTypeCode } as ProductType;
      mockGender = { id: 601, code: testProductDto.genderCode! } as Gender;
      mockProduct = {
        id: 1001, brandName: testProductDto.brandName, productName: testProductDto.productName,
        briefDescription: testProductDto.briefDescription, productType: mockProductType,
        gender: mockGender, address: null, isSponsored: testProductDto.isSponsored,
      } as Product;
      mockCampaignType = { id: 201, code: testCampaignDto.campaignTypeCode, label: '모집형' } as CampaignType;
      mockPlatform = { id: 301, code: testCampaignDto.influencerPlatformCode, label: '인스타그램' } as InfluencerPlatform;
      mockSavedCampaign = {
        id: 1, name: testCampaignDto.name, budget: testCampaignDto.budget, peopleCount: testCampaignDto.peopleCount,
        productId: mockProduct.id, campaignType: mockCampaignType, influencerPlatform: mockPlatform,
        createdAt: new Date('2025-08-01T10:00:00Z'),
      } as Campaign;
      mockValidScheduleTypes = testCampaignDto.schedules.map((s, i) => ({
        id: 401 + i, code: s.scheduleTypeCode } as ScheduleType)
      );
      mockSchedulesToSave = testCampaignDto.schedules.map((dto, index) => {
        const scheduleType = mockValidScheduleTypes[index];
        return { id: 5001 + index, campaignId: mockSavedCampaign.id, scheduleTypeId: scheduleType.id,
          scheduleType: scheduleType, startDate: dto.startDate, endDate: dto.endDate,
        } as CampaignSchedule;
      });

      // --- 2. 서비스 및 리포지토리 Mock 함수 설정 ---
      productService.createProduct.mockResolvedValue(mockProduct);
      campaignTypeRepository.findByCodeOrThrow.mockResolvedValue(mockCampaignType);
      influencerPlatformRepository.findByCodeOrThrow.mockResolvedValue(mockPlatform);
      scheduleTypeRepository.findByCampaignTypeAndPlatform.mockResolvedValue(mockValidScheduleTypes);
      campaignRepository.save.mockResolvedValue(mockSavedCampaign);
      campaignScheduleRepository.saveMany.mockResolvedValue(mockSchedulesToSave);

      // campaignDomainService.createCampaign 목 설정 (이전과 동일)
      campaignDomainService.createCampaign.mockReturnValue(
        { name: testCampaignDto.name, productId: mockProduct.id,
          campaignType: mockCampaignType, influencerPlatform: mockPlatform,
        } as Campaign
      );

      // --- !!! campaignDomainService.createCampaignSchedule 목 설정 수정 (mockImplementation 사용) !!! ---
      let scheduleCallCount = 0; // 호출 횟수 추적 변수
      campaignDomainService.createCampaignSchedule.mockImplementation(() => {
        // 호출될 때마다 mockSchedulesToSave 배열에서 다음 요소를 반환
        const scheduleToReturn = mockSchedulesToSave[scheduleCallCount];
        scheduleCallCount++; // 다음 호출을 위해 카운트 증가
        return scheduleToReturn; // 준비된 목 객체 반환
      });
      // --- !!! 수정 완료 !!! ---


      // 유효성 검증 목
      campaignDomainService.validateSupportedScheduleTypes.mockImplementation(() => {});
      campaignDomainService.validateRequiredScheduleTypes.mockImplementation(() => {});

      // --- 3. withTransaction 설정 (동일) ---
      campaignRepository.withTransaction.mockReturnValue({ save: campaignRepository.save } as any);
      campaignTypeRepository.withTransaction.mockReturnValue({ findByCodeOrThrow: campaignTypeRepository.findByCodeOrThrow } as any);
      influencerPlatformRepository.withTransaction.mockReturnValue({ findByCodeOrThrow: influencerPlatformRepository.findByCodeOrThrow } as any);
      scheduleTypeRepository.withTransaction.mockReturnValue({ findByCampaignTypeAndPlatform: scheduleTypeRepository.findByCampaignTypeAndPlatform } as any);
      campaignScheduleRepository.withTransaction.mockReturnValue({ saveMany: campaignScheduleRepository.saveMany } as any);

    });


    it('캠페인 생성 요청 시, 관련 정보(상품, 스케줄)를 포함하여 성공적으로 생성하고 저장된 캠페인을 반환해야 한다', async () => {
      // given
      const manager = createMockEntityManager();
      // No need to mock dataSource.transaction implementation if using the default mock

      // --- Define Expected DTO ---
      const expectedResultDto: CampaignDetailItemDto = {
        id: mockSavedCampaign.id,
        name: mockSavedCampaign.name,
        budget: Number(mockSavedCampaign.budget),
        peopleCount: mockSavedCampaign.peopleCount,
        createdAt: mockSavedCampaign.createdAt.toISOString(), // Use ISO string format
        product: {
          productId: mockProduct.id,
          brandName: mockProduct.brandName,
          productName: mockProduct.productName,
          productTypeCode: mockProduct.productType.code, // From mocked relation
          briefDescription: mockProduct.briefDescription,
          postalCode: mockProduct.address?.postalCode, // Use optional chaining
          roadName: mockProduct.address?.roadName,     // Use optional chaining
          genderCode: mockProduct.gender?.code,       // Use optional chaining
          isSponsored: mockProduct.isSponsored ?? false,
        },
        campaignType: {
          code: mockCampaignType.code,
          label: mockCampaignType.label,
        },
        influencerPlatform: {
          code: mockPlatform.code,
          label: mockPlatform.label,
        },
        schedules: mockSchedulesToSave.map(s => ({ // Map from the saved schedules
          scheduleTypeCode: s.scheduleType!.code, // Use non-null assertion or check
          startDate: s.startDate ? String(s.startDate) : '', // Format date to YYYY-MM-DD
          endDate: s.endDate ? String(s.endDate):'',      // Format date to YYYY-MM-DD
        })),
      };
      // --- End Define Expected DTO ---

      // when
      const result = await service.create(testCampaignDto);

      // then
      // --- Assertions ---
      expect(result).toEqual(expectedResultDto); // Compare with the expected DTO

      // Verify service/repository calls
      expect(productService.createProduct).toHaveBeenCalledWith(testCampaignDto.product, manager);
      expect(campaignTypeRepository.withTransaction).toHaveBeenCalledWith(manager);
      expect(campaignTypeRepository.findByCodeOrThrow).toHaveBeenCalledWith(testCampaignDto.campaignTypeCode);
      expect(influencerPlatformRepository.withTransaction).toHaveBeenCalledWith(manager);
      expect(influencerPlatformRepository.findByCodeOrThrow).toHaveBeenCalledWith(testCampaignDto.influencerPlatformCode);
      expect(campaignRepository.withTransaction).toHaveBeenCalledWith(manager);
      expect(campaignDomainService.createCampaign).toHaveBeenCalledWith({
        name: testCampaignDto.name,
        budget: testCampaignDto.budget,
        peopleCount: testCampaignDto.peopleCount,
        productId: mockProduct.id,
        product: mockProduct, // Passed to domain service
        campaignType: mockCampaignType,
        influencerPlatform: mockPlatform,
      });
      expect(campaignRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ // Check the object passed to save
          name: testCampaignDto.name,
          productId: mockProduct.id,
          campaignType: mockCampaignType, // Ensure relations are passed
          influencerPlatform: mockPlatform,
        })
      );

      // Verify schedule creation process
      expect(scheduleTypeRepository.withTransaction).toHaveBeenCalledWith(manager);
      expect(scheduleTypeRepository.findByCampaignTypeAndPlatform)
        .toHaveBeenCalledWith(mockCampaignType.id, mockPlatform.id);
      expect(campaignDomainService.validateSupportedScheduleTypes).toHaveBeenCalledWith(
        expect.objectContaining({ id: mockSavedCampaign.id }), // Pass campaign object
        ['RECRUIT', 'CONTENT_UPLOAD'], // requestedCodes
        mockValidScheduleTypes // validTypes
      );
      expect(campaignDomainService.validateRequiredScheduleTypes).toHaveBeenCalledWith(
        expect.objectContaining({ id: mockSavedCampaign.id }), // Pass campaign object
        mockValidScheduleTypes // validTypes
      );
      expect(campaignDomainService.createCampaignSchedule).toHaveBeenCalledTimes(mockSchedulesToSave.length);
      // Check calls for each schedule DTO
      testCampaignDto.schedules.forEach((scheduleDto, index) => {
        const expectedScheduleType = mockValidScheduleTypes[index];
        expect(campaignDomainService.createCampaignSchedule).toHaveBeenCalledWith(
          mockSavedCampaign.id,
          expectedScheduleType,
          scheduleDto.startDate,
          scheduleDto.endDate ?? null
        );
      });

      expect(campaignScheduleRepository.withTransaction).toHaveBeenCalledWith(manager);
      expect(campaignScheduleRepository.saveMany).toHaveBeenCalledTimes(1);
      // Check that the array passed to saveMany matches the array returned by createCampaignSchedule calls
      expect(campaignScheduleRepository.saveMany).toHaveBeenCalledWith(mockSchedulesToSave);


      expect(dataSource.transaction).toHaveBeenCalledTimes(1);
      // --- End Assertions ---
    });

    it('스케줄 정보가 없는 경우, 캠페인과 상품만 생성하고 스케줄 관련 로직은 실행하지 않아야 한다', async () => {
      // given
      const dtoWithoutSchedules = { ...testCampaignDto, schedules: [] }; // 스케줄 제거
      const manager = createMockEntityManager();

      const expectedDtoWithoutSchedules: CampaignDetailItemDto = {
        id: mockSavedCampaign.id,
        name: mockSavedCampaign.name,
        budget: Number(mockSavedCampaign.budget),
        peopleCount: mockSavedCampaign.peopleCount,
        createdAt: mockSavedCampaign.createdAt.toISOString(), // ISO 문자열 형식 사용
        product: {
          productId: mockProduct.id,
          brandName: mockProduct.brandName,
          productName: mockProduct.productName,
          productTypeCode: mockProduct.productType.code,
          briefDescription: mockProduct.briefDescription,
          postalCode: mockProduct.address?.postalCode,
          roadName: mockProduct.address?.roadName,
          genderCode: mockProduct.gender?.code,
          isSponsored: mockProduct.isSponsored ?? false,
        },
        campaignType: {
          code: mockCampaignType.code,
          label: mockCampaignType.label,
        },
        influencerPlatform: {
          code: mockPlatform.code,
          label: mockPlatform.label,
        },
        schedules: [],
      };


      // when
      const result = await service.create(dtoWithoutSchedules);

      // then
      expect(result).toEqual(expectedDtoWithoutSchedules);

      expect(productService.createProduct).toHaveBeenCalledTimes(1);
      expect(campaignRepository.save).toHaveBeenCalledTimes(1);


      expect(scheduleTypeRepository.findByCampaignTypeAndPlatform).not.toHaveBeenCalled();
      expect(campaignDomainService.validateSupportedScheduleTypes).not.toHaveBeenCalled();
      expect(campaignDomainService.createCampaignSchedule).not.toHaveBeenCalled();

      expect(campaignDomainService.validateRequiredScheduleTypes).not.toHaveBeenCalled();
      expect(campaignScheduleRepository.saveMany).not.toHaveBeenCalled();

      expect(dataSource.transaction).toHaveBeenCalledTimes(1); // transaction 호출 횟수 확인
    });

    it('존재하지 않는 캠페인 타입을 요청하면 NotFoundException 에러가 발생해야 한다', async () => {
      //given
      const error = new NotFoundException('캠페인 타입(INVALID_CODE)을 찾을 수 없습니다.');

      campaignTypeRepository.findByCodeOrThrow.mockRejectedValue(error);
      const invalidDto = { ...testCampaignDto, campaignTypeCode: 'INVALID_CODE' };
      const manager = createMockEntityManager();
      dataSource.transaction.mockImplementation(async (cb) => cb(manager));

      // when & then
      await expect(service.create(invalidDto)).rejects.toThrow(NotFoundException);


      expect(campaignRepository.save).not.toHaveBeenCalled();
      expect(campaignScheduleRepository.saveMany).not.toHaveBeenCalled();
    });

    it('스케줄 유효성 검증(DomainService) 실패 시 BadRequestException 에러가 발생해야 한다', async () => {
      // given
      const error = new BadRequestException('유효하지 않은 스케줄 타입입니다: INVALID_SCHEDULE');

      campaignDomainService.validateSupportedScheduleTypes.mockImplementation(() => {
        throw error;
      });
      const manager = createMockEntityManager();
      dataSource.transaction.mockImplementation(async (cb) => cb(manager));

      // when & then
      await expect(service.create(testCampaignDto)).rejects.toThrow(BadRequestException);


      expect(campaignRepository.save).toHaveBeenCalled();
      expect(campaignScheduleRepository.saveMany).not.toHaveBeenCalled();
    });


  });
});