// server/routes/goal.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const Goal = require('../models/Goal');

/** ✅ 목표금액 저장 (존재 시 업데이트, 없으면 생성) */
router.post('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { yearMonth, amount } = req.body;

        if (!yearMonth || !amount) {
            return res.status(400).json({ message: 'yearMonth와 amount가 필요합니다.' });
        }

        const [year, month] = yearMonth.split('-');
        const existing = await Goal.getByUserIdAndMonth(userId, year, month);

        if (existing) {
            await Goal.updateByUserIdAndMonth(userId, year, month, amount);
        } else {
            await Goal.create(userId, amount, year, month);
        }

        res.status(200).json({ message: '목표 금액 저장 또는 수정 완료' });
    } catch (err) {
        console.error('POST /goal 에러:', err);
        res.status(500).json({ message: '서버 오류' });
    }
});

/** ✅ 해당 월 목표금액 조회 */
router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { yearMonth } = req.query;

        if (!yearMonth) {
            return res.status(400).json({ message: 'yearMonth 쿼리 파라미터가 필요합니다.' });
        }

        const [year, month] = yearMonth.split('-');
        const result = await Goal.getByUserIdAndMonth(userId, year, month);

        if (!result) {
            return res.status(404).json({ message: '목표 금액이 설정되어 있지 않습니다.' });
        }

        res.status(200).json({ amount: result.amount });
    } catch (err) {
        console.error('GET /goal 에러:', err);
        res.status(500).json({ message: '서버 오류' });
    }
});

module.exports = router;
