// /server/routes/fullProcess.js

const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');

const { extractTextFromImage } = require('../controllers/ocrController');
const { askGptToClassify } = require('../services/gptService');
const Expense = require('../models/Expense');

// OCR → GPT → DB 저장 통합 처리
router.post('/full-process', verifyToken, async (req, res) => {
    try {
        const { imagePath } = req.body;
        const user_id = req.user.userId;

        if (!imagePath) {
            return res.status(400).json({ message: '이미지 경로가 필요합니다.' });
        }

        // ✅ 1. OCR 수행
        const text = await extractTextFromImage(imagePath);
        console.log('🔍 OCR 추출 텍스트:', text);

        // ✅ 2. GPT 분류
        const result = await askGptToClassify(text);
        console.log('🧠 GPT 결과:', result);

        const { store, amount, date, category } = result;

        // ✅ 3. DB 저장
        const newExpense = await Expense.create({
            user_id,
            store_name: store,
            amount,
            category,
            purchase_date: date,
            receipt_id: null, // 필요시 연결 가능
        });

        console.log('✅ 최종 저장 성공:', newExpense);
        res.status(201).json({ message: '성공적으로 저장되었습니다.', data: newExpense });
    } catch (error) {
        console.error('❌ 전체 파이프라인 오류:', error.message);
        res.status(500).json({ message: '전체 파이프라인 처리 실패' });
    }
});

module.exports = router;
