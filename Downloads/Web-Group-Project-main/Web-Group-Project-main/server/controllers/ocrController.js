// /server/controllers/ocrController.js
const vision = require('@google-cloud/vision');
const path = require('path');
const { askGptToClassify } = require('../services/gptService'); // ✨ 추가
const pool = require('../config/db'); // ✨ DB 연결 추가

// 1. 서비스 계정 키 경로 설정 // 안전하게 경로 불러오기
const keyFilename = path.join(__dirname, '..', 'config', 'service-account-key.json');

// 2. Vision API 클라이언트 생성
const client = new vision.ImageAnnotatorClient({ keyFilename });

/**
 * 이미지 파일에서 텍스트 추출하는 함수
 */
const extractTextFromImage = async (imagePath) => {
    try {
        const [result] = await client.textDetection(imagePath);
        const detections = result.textAnnotations;

        if (detections.length > 0) {
            // 첫 번째 항목이 전체 추출 텍스트입니다.
            return detections[0].description;
        } else {
            return '';
        }
    } catch (error) {
        console.error('OCR 오류:', error);
        throw new Error('OCR 실패');
    }
};

const processFullPipeline = async (req, res) => {
    const { imagePath, receiptId } = req.body;
    const userId = req.user.userId;

    if (!imagePath || !receiptId) {
        return res.status(400).json({ message: 'imagePath와 receiptId가 필요합니다.' });
    }

    try {
        // 1. OCR
        const ocrText = await extractTextFromImage(imagePath);

        // 2. GPT 분석 및 전처리 완료 결과
        const gptResult = await askGptToClassify(ocrText);

        // ✅ 이미 전처리된 결과 사용
        const { store, amount, date, category } = gptResult;

        // ✅ 카테고리 필터링 (추가 검증)
        const allowedCategories = ['음식', '쇼핑', '교통', '문화생활', '의료/기타'];
        if (!allowedCategories.includes(category)) {
            return res.status(400).json({
                message: '분석된 카테고리가 허용되지 않습니다.',
                result: gptResult,
            });
        }

        // 3. DB 저장
        const conn = await pool.getConnection();
        const sql = `
            INSERT INTO expenses (user_id, receipt_id, store_name, amount, category, purchase_date)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        await conn.query(sql, [userId, receiptId, store, amount, category, date]);
        conn.release();

        res.status(200).json({ message: '성공적으로 저장되었습니다.', result: gptResult });
    } catch (err) {
        console.error('❌ 전체 처리 실패:', err.message);
        res.status(500).json({ message: '전체 처리 중 오류 발생', error: err.message });
    }
};

module.exports = { extractTextFromImage, processFullPipeline };
