-- 데이터베이스 선택
USE smart_ledger;

-- 기존 테이블 제거 (순서 주의: FK 있는 순서 → 없는 순서)
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS receipts;
DROP TABLE IF EXISTS monthly_goal_amount;
DROP TABLE IF EXISTS users;

-- 사용자 테이블
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),                       -- ✅ 추가된 부분
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  age INT,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 영수증 테이블 (이미지 및 OCR 텍스트 저장)
CREATE TABLE receipts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  image_path VARCHAR(255) NOT NULL,  -- 업로드된 이미지 경로
  ocr_text TEXT,                     -- OCR 추출 텍스트
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 소비내역 테이블 (영수증 분석 결과 포함)
CREATE TABLE expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  receipt_id INT,                             -- 새로 추가된 외래키
  category VARCHAR(100) NOT NULL,
  amount INT NOT NULL,
  store_name VARCHAR(255),
  product_name VARCHAR(255),
  purchase_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (receipt_id) REFERENCES receipts(id)  -- 새로운 외래키 연결
);

-- 월별 목표 금액 테이블
CREATE TABLE monthly_goal_amount (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  target_amount INT NOT NULL,
  goal_year INT NOT NULL,             -- 예: 2025
  goal_month INT NOT NULL,            -- 예: 4
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

USE smart_ledger;
SELECT * FROM users;

ALTER TABLE receipts
ADD COLUMN ocr_status ENUM('pending', 'done') DEFAULT 'pending';
