# 캠페인 API

## 기능

* **캠페인 생성:** 다양한 조건(캠페인 타입, 플랫폼, 상품 정보, 스케줄 등)을 포함하는 새로운 광고 캠페인을 등록합니다. (POST /campaign)
* **캠페인 목록 조회:** 생성된 캠페인 목록을 페이지네이션을 통해 조회합니다. 각 캠페인의 상세 정보(상품 정보, 스케줄 포함)를 함께 제공합니다. (GET /campaign)

## 실행 및 테스트

### 환경 설정

* **사전 설정:** 데이터베이스 연결 정보(호스트, 포트, 사용자 이름, 비밀번호, DB 이름)는 로컬 실행 편의를 위해 `docker-compose.yml` 파일 내 `app` 서비스의 `environment`
  섹션에 직접 설정되어 있습니다. 별도의 `.env` 파일 설정은 필요하지 않습니다. (운영 환경에서는 환경 변수 관리 방식을 사용하는 것이 좋습니다.)

### 실행 (Docker Compose 사용)

1. **의존성 설치 (최초 1회 또는 변경 시):**
   ```bash
   docker-compose build
   ```
2. **컨테이너 실행 (백그라운드):**
   ```bash
   docker-compose up -d
   ```

### 테스트 실행

* **모든 테스트 실행:**
    ```bash
   npm run test:unit  
    ```

## API 엔드포인트

### `POST /campaign`

* **설명:** 새로운 광고 캠페인을 생성합니다.
* **요청 본문 (Request Body):** `CreateCampaignDto`
* **응답 본문 (Response Body):** `CampaignDetailItemDto` (생성된 캠페인 상세 정보)
* **요청 본문 예시 (Request Body Example - 방문형 상품):**
    ```json
    {
      "name": "쿠팡 캠페인",
      "budget": 10000,
      "peopleCount": 5,
      "campaignTypeCode": "RECRUIT",
      "influencerPlatformCode": "INSTAGRAM",
      "product": {
        "brandName": "쿠팡",
        "productName": "곰곰 부대찌개",
        "briefDescription": "맛있어요",
        "guide": "끼리먹으세요",
        "productTypeCode": "VISIT",
        "postalCode": "12345",
        "roadName": "서울시 강남구 테헤란로 123"
      },
      "schedules": [
        {
          "scheduleTypeCode": "RECRUIT",
          "startDate": "2025-05-01",
          "endDate": "2025-05-10"
        }
      ]
    }
    ```

* **응답 본문 예시 (Response Body Example):**
    ```json
    {
        "id": 8,
        "name": "쿠팡 캠페인",
        "budget": 10000,
        "peopleCount": 5,
        "createdAt": "2025-04-28T15:30:00Z", 
        "product": {
            "productId": 8,  
            "productName": "곰곰 부대찌개",
            "brandName": "쿠팡",
            "productTypeCode": "VISIT",
            "briefDescription": "맛있어요",
            "postalCode": "12345",
            "roadName": "서울시 강남구 테헤란로 123",
            "genderCode": null, 
            "isSponsored": false
        },
        "campaignType": {
            "code": "RECRUIT",
            "label": "모집형"
        },
        "influencerPlatform": {
            "code": "INSTAGRAM",
            "label": "인스타그램"
        },
        "schedules": [
            {
                "scheduleTypeCode": "RECRUIT",
                "startDate": "2025-05-01",
                "endDate": "2025-05-10"
            }
        ]
    }
    ```

### `GET /campaign`

* **설명:** 생성된 캠페인 목록을 페이지네이션하여 조회합니다.
* **쿼리 파라미터:** `page`, `limit`
* **응답 본문 (Response Body):** `PaginatedCampaignListDto` (캠페인 목록 및 전체 개수)

* **응답 본문 예시 (Response Body Example):**
    ```json
    {
        "items": [
            {
                "id": "7",
                "name": "캠페인테스트6",
                "budget": 10000,
                "peopleCount": 10,
                "createdAt": "2025-04-28T04:54:45Z",
                "product": {
                    "productId": "7",
                    "productName": "곰곰 부대찌개",
                    "brandName": "coupang",
                    "productTypeCode": "VISIT",
                    "briefDescription": "맛있어요",
                    "postalCode": "4890",
                    "roadName": "부산시 50-14번지",
                    "isSponsored": 0 
                },
                "campaignType": {
                    "code": "RECRUIT",
                    "label": "모집형"
                },
                "influencerPlatform": {
                    "code": "YOUTUBE",
                    "label": "유튜브"
                },
                "schedules": [
                    {
                        "scheduleTypeCode": "RECRUIT",
                        "startDate": "2025-05-01",
                        "endDate": "2025-05-10"
                    }
                ]
            }
          
        ],
        "totalCount": 5
    }
    ```

## 데이터베이스 설계

### ERD

![erd](https://lh3.googleusercontent.com/fife/ALs6j_FMEX3_i_wTLHKVDOPwjQCyuo-gyjj2ItY6gwUOmypIrhDwDk53ElF_ink72fmaf2AKFNu_R6QX072SWJB9WURadduig-EuWTjNoM_DZVCUOCkmxfehnAAWLRayCdc8FhGWSr-CzailvUgIlQgxO4Y-MU4pukSSCRmzaAWKwmaY8xE6xSCXbV4g4hGjVA8wJAKFxlKQcchEHBWH4kakw95NUw6IzFRgY2UQmqjhrCSg262gxOpcx_fcOVf171Je_ApgRk27p7Y5U9W-lm0qHAphxbFIk_1D8jpPjkAFXs3-59iKZAMtdB41CId2r0mv82LnU0IaHrLC09P-ueS2rgSp9Gbj3A01Jeaxcx3glxvtIaizp0uPDq46bSvG0ixyYFbXMmHRPBcKZETT8U2FO3ooUgvYGSQTr2Z_H3yvvHq1Nf4Hat0I5WmQdFhojewJ89GV9sLVvH2YtR4vvOFd9KGhZfninCe1HNdrWz7FyII75O5sRusv_ECep1d6v38yp3OUTQPlbGe1x6yfR1N4-L5MHhuxcPwsQ_SRUr_kvY_aCxjaXzJb0oROQkxqn8phVlvMY8p08BYtJjK-v1fnK1hiZX_GQAsx3pUrH404vIaMeWb907xqTfGzCnwwPNqdsTKly3_8cnUkfKjM8abIbwFCBRSmWMuwD9m3U-D_p1HXxrH_SyPEDUQiSWZ8zLvcbtoLjnvvqi6tilvJ2G3a2ybdo6oSjs4SeQHz2RhO1bohd-nx5W6khGvoDCnCaDLaBOAy8TV2YX6OqdYFaB6qHQVJVfDXRrUIvqQQnkAHsN4GwCMXBQhPxcTzeODLmqSSJsgEsTDq7tSZCrSmA6kJ0JOtIz8UPgJEq_ZIXR4DdBS7bo7nB2BrAK7WuwHbK2nUeiqs-1zhMg1nTP0p8AOK_K9HmrLdNzDlX4OXfqgNbblmBr_Bn5P7ZRxgA0YVuyL4AngXFNwSZAg5SU4cFBLyQkrjc6R6Fef1FpIcj5jC4bia6TSK5BGDQqkAFswLQzuj-avcYrGhbHFnh1qqmGUg9UdeMJbUtEd8KwBjeJPwCQbj-_fYH8NLnqh66qXBu3V4zTGchRIYNsPF4dJl3-nzeRktmIp3JFY2NLSwoaroLAqFl0bPZH2A6X7aZydcQqfWR2H_eMQO-l8vsEMP1TYTkMNCf4UpY7yE6A5aXsBgSmxez1koeopi3kL1Ze5Ve94n18_917_MFZBb8YCfPQC6jBFQXTwqqRHHJI-_BZFCuZ4iPgg-0WgwSCgLRhCB-Gh0otgefc71am_e3BK0c3SV03HcY-Tzb6rYYl7YX-245UnB3R9DE8MjLCDUHkLM0A8IcaB3GwkpVMD4O5l2CBeu5rdX2HB9a1K1YcC_mbyXhEOYq01iXVGQ0_JB0ZLR9puyRPVCj5UlRI3mqWfVRSjtaUK64Ynt6uNKgiyUr0HzEf5YCp6l5W8GO13mO3zzgLInuVfKdxKDzdfJOiXc1iKaA0R8QBL6M_k5SUjE3Z1-6wlCwQlBIKTVeLA0VXDVuQHpZWrl-EoaawP2o9d-xEI7Lwk-jNgKokPYvTs70fa-PybZCsq2D3UxFmqsZKljwyKMSE8-wZi3ug=w1115-h934?auditContext=forDisplay)

### 설계 원칙 및 정규화

* **참조 무결성 및 일관성 강화:** `campaign_type`, `influencer_platform`, `product_type`, `gender`, `schedule_type` 와 같이 미리 정의된 값들의
  집합(예: 'RECRUIT', 'BID')은 별도의 **룩업 테이블(Lookup Table)**로 분리했습니다.
    * **이점:**
        * 각 타입의 코드(Code)와 설명(Label)을 중앙에서 관리하여 데이터 일관성을 유지합니다. (예: 'RECRUIT' 코드 오타 방지)
        * 새로운 타입 추가/수정이 용이해집니다. (예: 새로운 플랫폼 추가 시 `influencer_platform` 테이블만 수정)
* **정규화 및 관계 설정:**
    * 주요 데이터 테이블(`campaign`, `product`, `campaign_schedule`)에서는 위 룩업 테이블의 기본 키(ID)를 참조합니다. (예: `campaign` 테이블의
      `campaign_type_id`가 `campaign_type` 테이블의 `id` 참조)
    * 이를 통해 데이터 중복을 최소화하고(예: `campaign` 테이블에 '모집형' 문자열을 반복 저장하지 않음), 관계형 데이터베이스의 정규화 원칙을 준수하여 데이터 무결성을 높였습니다.
    * `product` 테이블은 상품 타입에 따라 `address_id` 또는 `gender_id` 중 하나만 가질 수 있도록 설계되었습니다 (Nullable 외래 키 사용).
    * `campaign`과 `campaign_schedule`은 1:N 관계를 가집니다.

## 아키텍처 설계

### 트랜잭션 스크립트 패턴 (캠페인 생성)

* `POST /campaign` API는 `CampaignService` 내에서 **트랜잭션 스크립트 패턴**을 사용합니다.
* 상품 생성, 캠페인 생성, 스케줄 생성 등 여러 데이터베이스 작업을 `dataSource.transaction`으로 묶어 단일 트랜잭션으로 처리합니다.
* 이 과정에서 하나라도 실패하면 모든 변경 사항이 **롤백(Rollback)** 되어 데이터 정합성을 보장합니다.

### Reader/Writer 포트(Port) 분리

* 애플리케이션 서비스(`CampaignService`, `ProductService`)는 도메인 로직을 처리할 때 데이터 조회(Read)와 변경(Write) 책임을 분리하는 **Reader/Writer 인터페이스(
  Port)**를 사용합니다.
    * 예: `CampaignTypeReader` (조회), `CampaignWriter` (저장/수정)
* 실제 데이터베이스 접근 로직을 담은 리포지토리(`CampaignRepository` 등)가 이 인터페이스를 구현합니다.
* 서비스는 리포지토리 구현체 대신 인터페이스에 의존하며, 트랜잭션 내에서는 `repository.withTransaction(manager)`를 통해 해당 트랜잭션에 맞는 Reader/Writer 구현을 받아
  사용합니다. 이는 코드의 응집도를 높이고 테스트 용이성을 개선합니다.

## 프로젝트 구조

```
src
├── campaign-service # 캠페인 도메인 관련 로직
│ ├── application # 응용 서비스 (비즈니스 레이어)
│ ├── domain # 도메인 모델, 서비스, 포트(인터페이스), 리포지토리
│ └── ui # API 컨트롤러, DTOs
├── product-service # 상품 도메인 관련 로직 (캠페인 서비스와 같은 레이어 구조)
├── databases # 데이터베이스 연결, 트랜잭션 관리 유틸리티
├── app.module.ts # NestJS 메인 모듈
└── main.ts # 애플리케이션 시작점
```

* 각 주요 도메인(`campaign`, `product`)별로 폴더를 분리하여 관리합니다.
* 각 서비스 폴더 내부는 계층형 아키텍처(UI - Application - Domain)를 따릅니다.
* `domain/port` 디렉토리에 정의된 인터페이스를 통해 계층 간 의존성을 관리합니다.

## 아키텍처 및 개선 제안

### 읽기 성능 최적화 (Query Repository)

* 현재 캠페인 목록 조회(`GET /campaign`)는 `CampaignQueryRepository`에서 여러 테이블을 조인(Join)하고 DTO로 가공하는 방식으로 구현되어 있습니다.
* 관계형 데이터베이스에서 조인은 데이터 양이 많아질수록 성능 저하의 원인이 될 수 있습니다.
* 만약 트래픽이 크게 증가하여 목록 조회 성능이 중요해진다면, **읽기 전용 저장소(Read Model)** 를 별도로 구축하는 것을 고려할 수 있습니다.
* 예를 들어, 캠페인이 생성/수정될 때 필요한 목록 정보를 트랜잭션시 **도큐먼트 기반 NoSQL 데이터베이스(예: MongoDB, Elasticsearch)** 에 저장해두면, 조회 시 복잡한 조인 없이 빠르게
  데이터를 가져올 수 있습니다. (CQRS 패턴의 일부로 볼 수 있습니다.)

## ETC

* 요구사항에 명시된 대로 캠페인 지원 관련 기능은 모델링 범위에서 제외되었습니다.
* 클라이언트와 서버 간 인터페이스 공유를 위해 DTO (`CampaignDetailItemDto` 등)를 사용합니다.

## 회고

* 현재는 레이어드 아키텍처 내에서 포트(Port)를 사용하여 의존성을 관리하고 있습니다.
* 향후 **도메인 모듈**과 **API 모듈(애플리케이션 모듈)**을 명확히 분리하는 구조로 개선하는게 좋을거 같습니다.
* 개발 과정에서 레이어드 아키텍처의 잠재적인 순환 참조 문제를 인지하고 이를 피하려고 노력했습니다. 하지만 더 나은 구조를 위해서는 향후 **도메인 로직을 담당하는
  '도메인 모듈'**과 **API 인터페이스 및 애플리케이션 흐름을 담당하는 'API(애플리케이션) 모듈'**로 명확하게 분리하는 것이 역시 좋은거 같습니다.
