-- 캠페인 aggregate root 테이블
CREATE TABLE campaign
(
    id                     BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id             BIGINT         NOT NULL,
    campaign_type_id       BIGINT         NOT NULL,
    influencer_platform_id BIGINT         NOT NULL,
    name                   VARCHAR(200)   NOT NULL, -- 캠페인 명
    budget                 DECIMAL(15, 2) NOT NULL, -- 예산
    people_count           INT            NOT NULL, -- 모집,입찰등 인원 공통화,
    is_deleted             BOOLEAN        NOT NULL DEFAULT FALSE,
    created_at             TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at             TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- 캠페인 타입 테이블
CREATE TABLE campaign_type
(
    id         BIGINT PRIMARY KEY AUTO_INCREMENT,
    code       VARCHAR(50)  NOT NULL UNIQUE, -- 'RECRUIT', 'BID'
    label      VARCHAR(100) NOT NULL,        -- '모집형', '입찰형'
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 인플루언서 플랫폼 테이블
CREATE TABLE influencer_platform
(
    id         BIGINT PRIMARY KEY AUTO_INCREMENT,
    code       VARCHAR(50)  NOT NULL UNIQUE, -- 'INSTAGRAM','YOUTUBE'
    label      VARCHAR(100) NOT NULL,        -- '인스타그램','유튜브'
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 스케줄 타입 테이블
CREATE TABLE schedule_type
(
    id                     BIGINT PRIMARY KEY AUTO_INCREMENT,
    code                   VARCHAR(50)  NOT NULL UNIQUE,        -- 'RECRUIT', 'BID', 'CONTENT_UPLOAD', 'CASTING'
    label                  VARCHAR(100) NOT NULL,
    campaign_type_id       BIGINT       NOT NULL,               -- 어떤 캠페인 타입에 적용되는지
    influencer_platform_id BIGINT       NOT NULL,               -- 어떤 플랫폼에 적용되는지
    is_casting             BOOLEAN      NOT NULL DEFAULT FALSE,  -- 필수 여부
    is_indefinite          BOOLEAN      NOT NULL DEFAULT FALSE, -- 무기한 가능 여부
    created_at             TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at             TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_schedule_type (code, campaign_type_id, influencer_platform_id)
);

-- Campaign Schedule (통합 일정 테이블)
CREATE TABLE campaign_schedule
(
    id               BIGINT PRIMARY KEY AUTO_INCREMENT,
    campaign_id      BIGINT NOT NULL, -- campaign.id 참조 (FK 생략)
    schedule_type_id BIGINT NOT NULL,
    start_date       DATE,
    end_date         DATE,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_campaign_schedule (campaign_id, schedule_type_id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  AUTO_INCREMENT = 1001;


-- Product Aggregate
CREATE TABLE product
(
    id                BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_type_id   BIGINT       NOT NULL,
    brand_name        VARCHAR(200) NOT NULL,
    product_name      VARCHAR(200) NOT NULL,
    brief_description VARCHAR(500) NOT NULL,
    guide             VARCHAR(500) NOT NULL, -- 서비스, 장소 안내든 '안내'라는 행위 or 본질이니 공통으로 넣음
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  AUTO_INCREMENT = 101;


CREATE TABLE product_type
(
    id         BIGINT PRIMARY KEY AUTO_INCREMENT,
    code       VARCHAR(50)  NOT NULL UNIQUE, -- 'VISIT','SERVICE'
    label      VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE address
(
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    postal_code VARCHAR(20)  NOT NULL,
    road_name   VARCHAR(200) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE gender
(
    id         BIGINT PRIMARY KEY AUTO_INCREMENT,
    code       CHAR(1)     NOT NULL UNIQUE, -- 'M','F'
    label      VARCHAR(20) NOT NULL,        -- '남성','여성'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- VisitProduct 서브타입
CREATE TABLE visit_product
(
    product_id BIGINT PRIMARY KEY, -- Product.id (1:1)
    address_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  AUTO_INCREMENT = 10001;

-- ServiceProduct 서브타입
CREATE TABLE service_product
(
    product_id    BIGINT PRIMARY KEY,   -- Product.id (1:1)
    gender_id     BIGINT NOT NULL,
    is_sponsored  BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP            DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  AUTO_INCREMENT = 20001;

