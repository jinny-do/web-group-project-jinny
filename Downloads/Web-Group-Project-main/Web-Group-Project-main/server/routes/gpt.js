// /server/routes/gpt.js

const express = require('express');
const router = express.Router();
const { askGptToClassify } = require('../services/gptService');
const verifyToken = require('../middlewares/authMiddleware');

// GPT 분류 API
router.post('/classify', verifyToken, async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ message: '텍스트가 필요합니다.' });
        }

        // ✅ GPT 결과는 이미 전처리된 객체 형태로 반환됨
        const result = await askGptToClassify(text);

        // ✅ 바로 반환
        res.status(200).json(result);
    } catch (error) {
        console.error('GPT 분류 오류:', error.message);
        res.status(500).json({ message: 'GPT 분류 실패' });
    }
});

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { askGptToClassify } = require('../services/gptService');
// const verifyToken = require('../middlewares/authMiddleware');

// router.post('/classify', verifyToken, async (req, res) => {
//     try {
//         const { text } = req.body;

//         if (!text) {
//             return res.status(400).json({ message: '텍스트가 필요합니다.' });
//         }

//         const result = await askGptToClassify(text);

//         // GPT 응답을 JSON으로 파싱
//         const parsed = JSON.parse(result);

//         res.status(200).json(parsed);
//     } catch (error) {
//         console.error('GPT 분류 오류:', error.message);
//         res.status(500).json({ message: 'GPT 분류 실패' });
//     }
// });

// module.exports = router;
