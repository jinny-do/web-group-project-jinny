// /server/test/gptTest.js

const { askGptToClassify } = require('../services/gptService');

const sampleText = `
[영수증 예시]
스타벅스 홍대점
결제일: 2024-05-11 13:22
총액: 7,800원
항목: 아이스아메리카노 1잔
`;

(async () => {
    try {
        const result = await askGptToClassify(sampleText);
        console.log('✅ GPT 응답 결과:\n', result);
    } catch (error) {
        console.error('❌ 테스트 중 오류 발생:', error.message);
    }
})();
