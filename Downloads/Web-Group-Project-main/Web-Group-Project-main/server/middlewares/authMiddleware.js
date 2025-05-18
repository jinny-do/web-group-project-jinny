// JWT 인증 미들웨어
//  /server/middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');

// 인증 미들웨어 함수
const verifyToken = (req, res, next) => {
    // 1. 요청 헤더에서 Authorization(토큰) 가져오기
    const authHeader = req.headers.authorization;

    // 2. 토큰이 없으면 거절
    if (!authHeader) {
        return res.status(401).json({ message: '토큰이 없습니다. 인증이 필요합니다.' });
    }

    // 3. "Bearer 토큰값" 형식이기 때문에 split해서 토큰만 꺼낸다
    const token = authHeader.split(' ')[1];

    // 4. 토큰 검증
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 5. 토큰이 유효하면 사용자 정보를 요청 객체(req.user)에 저장
        req.user = decoded; // { userId: 123 } 이런 식으로 저장됨

        // 6. 다음 미들웨어 또는 API로 이동
        next();
    } catch (error) {
        console.error('토큰 검증 실패:', error);
        return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
};

module.exports = verifyToken;
