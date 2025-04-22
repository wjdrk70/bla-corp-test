-- 1) 통합 Lookup 테이블
CREATE TABLE reference_data
(
    category   VARCHAR(50)  NOT NULL, -- lookup 종류 구분
    code       VARCHAR(50)  NOT NULL, -- 실제 값 (ex. 'INSTAGRAM','RECRUIT','BIDDING', ...)
    label      VARCHAR(100) NOT NULL, -- 화면 표시용
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (category, code)
)ENGINE=InnoDB
 DEFAULT CHARSET=utf8mb4
 AUTO_INCREMENT=201;


-- 2) Campaign Aggregate
CREATE TABLE campaign
(
    id                       BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id               BIGINT         NOT NULL, -- Product.id 참조 (FK 생략)
    campaign_type_code       VARCHAR(50)    NOT NULL, -- reference_data.category='CAMPAIGN_TYPE'
    influencer_platform_code VARCHAR(50)    NOT NULL, -- reference_data.category='INFLUENCER_PLATFORM'
    name                     VARCHAR(200)   NOT NULL,
    budget                   DECIMAL(15, 2) NOT NULL,
    is_indefinite            BOOLEAN        NOT NULL DEFAULT FALSE,
    created_at               TIMESTAMP               DEFAULT CURRENT_TIMESTAMP,
    updated_at               TIMESTAMP               DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3) Product Aggregate
CREATE TABLE product
(
    id                BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_type_code VARCHAR(50)  NOT NULL, -- reference_data.category='PRODUCT_TYPE'
    brand_name        VARCHAR(200) NOT NULL,
    product_name      VARCHAR(200) NOT NULL,
    brief_description VARCHAR(500) NOT NULL,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)ENGINE=InnoDB
 DEFAULT CHARSET=utf8mb4
 AUTO_INCREMENT=101;

-- 4) VisitProduct 서브타입
CREATE TABLE visit_product
(
    product_id     BIGINT PRIMARY KEY, -- Product.id (1:1)
    location_guide TEXT         NOT NULL,
    province       VARCHAR(100) NOT NULL,
    city           VARCHAR(100) NOT NULL,
    street         VARCHAR(200) NOT NULL,
    building_no    VARCHAR(50)  NOT NULL,
    unit           VARCHAR(50),
    postal_code    VARCHAR(20)  NOT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)  DEFAULT CHARSET=utf8mb4
   AUTO_INCREMENT=10001;

-- 5) ServiceProduct 서브타입
CREATE TABLE service_product
(
    product_id    BIGINT PRIMARY KEY,   -- Product.id (1:1)
    service_guide TEXT        NOT NULL,
    gender_code   VARCHAR(50) NOT NULL, -- reference_data.category='GENDER'
    is_sponsored  BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP            DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)  DEFAULT CHARSET=utf8mb4
   AUTO_INCREMENT=20001;

-- 6) Campaign Schedule (통합 일정 테이블)
CREATE TABLE campaign_schedule
(
    id                 BIGINT PRIMARY KEY AUTO_INCREMENT,
    campaign_id        BIGINT      NOT NULL, -- campaign.id 참조 (FK 생략)
    schedule_type_code VARCHAR(50) NOT NULL, -- reference_data.category='SCHEDULE_TYPE'
    start_date         DATE,
    end_date           DATE,
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_campaign_schedule (campaign_id, schedule_type_code)
)ENGINE=InnoDB
 DEFAULT CHARSET=utf8mb4
 AUTO_INCREMENT=1001;
