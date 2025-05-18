// smart-ledger-project/server/test/ocrTest.js
// OCR 테스트 코드

const path = require('path');
const { extractTextFromImage } = require('../controllers/ocrController');

const testOCR = async () => {
    try {
        // 테스트용 이미지 경로 (예: uploads/1/파일이름.jpg)
        const imagePath = path.join(__dirname, '..', 'uploads', '1', 'sample-receipt.jpg');

        const text = await extractTextFromImage(imagePath);
        console.log('✅ OCR 추출된 텍스트:\n', text);
    } catch (error) {
        console.error('❌ OCR 실행 중 오류:', error.message);
    }
};

testOCR();
