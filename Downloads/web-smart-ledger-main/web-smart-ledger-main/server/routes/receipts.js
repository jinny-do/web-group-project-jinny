// smart-ledger-project/server/routes/receipts.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const verifyToken = require('../middlewares/authMiddleware');
const db = require('../config/db');

// 사용자별 업로드 디렉토리 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.user.userId;
        const userDir = path.join('uploads', String(userId));
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }
        cb(null, userDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}${ext}`;
        cb(null, filename);
    },
});

const upload = multer({ storage });

// POST /api/receipts/upload
router.post('/upload', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const userId = req.user.userId;
        const relativePath = path.join('uploads', String(userId), req.file.filename);
        const sql = 'INSERT INTO receipts (user_id, image_path) VALUES (?, ?)';

        const [result] = await db.execute(sql, [userId, relativePath]);

        res.status(201).json({
            message: '이미지 업로드 완료',
            imagePath: relativePath,
            receiptId: result.insertId, // ✅ 이제 정상
        });
    } catch (error) {
        console.error('이미지 업로드 실패:', error);
        res.status(500).json({ message: '서버 오류' });
    }
});

// GET /api/receipts/list
router.get('/list', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const sql = `
            SELECT id, image_path, ocr_status, created_at
            FROM receipts
            WHERE user_id = ?
            ORDER BY created_at DESC
        `;
        const [rows] = await db.execute(sql, [userId]);
        res.status(200).json({ receipts: rows });
    } catch (error) {
        console.error('리스트 불러오기 실패:', error);
        res.status(500).json({ message: '리스트 조회 중 오류 발생' });
    }
});

// 갤러리에서 사진 삭제
// DELETE /api/receipts/:id
// DELETE /api/receipts/:id
router.delete('/:id', verifyToken, async (req, res) => {
    const userId = req.user.userId;
    const receiptId = req.params.id;

    try {
        // ✅ 1. 해당 영수증에 연결된 소비내역 먼저 삭제
        await db.execute('DELETE FROM expenses WHERE receipt_id = ? AND user_id = ?', [receiptId, userId]);

        // ✅ 2. 이미지 경로 조회
        const [[receipt]] = await db.execute('SELECT image_path FROM receipts WHERE id = ? AND user_id = ?', [
            receiptId,
            userId,
        ]);

        if (!receipt) {
            return res.status(404).json({ message: '영수증을 찾을 수 없습니다.' });
        }

        // ✅ 3. receipts 테이블에서 삭제
        await db.execute('DELETE FROM receipts WHERE id = ? AND user_id = ?', [receiptId, userId]);

        // ✅ 4. 이미지 파일 삭제
        const absolutePath = path.join(__dirname, '..', receipt.image_path);
        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
        }

        res.status(200).json({ message: '영수증 및 소비내역 삭제 완료' });
    } catch (error) {
        console.error('영수증 삭제 실패:', error);
        res.status(500).json({ message: '서버 오류로 삭제 실패' });
    }
});

// router.delete('/:id', verifyToken, async (req, res) => {
//     const userId = req.user.userId;
//     const receiptId = req.params.id;

//     try {
//         // 1. 이미지 경로 조회
//         const [[receipt]] = await db.execute('SELECT image_path FROM receipts WHERE id = ? AND user_id = ?', [
//             receiptId,
//             userId,
//         ]);

//         if (!receipt) {
//             return res.status(404).json({ message: '영수증을 찾을 수 없습니다.' });
//         }

//         // 2. DB에서 삭제
//         await db.execute('DELETE FROM receipts WHERE id = ? AND user_id = ?', [receiptId, userId]);

//         // 3. 파일 삭제
//         const absolutePath = path.join(__dirname, '..', receipt.image_path);
//         if (fs.existsSync(absolutePath)) {
//             fs.unlinkSync(absolutePath);
//         }

//         res.status(200).json({ message: '영수증 삭제 완료' });
//     } catch (error) {
//         console.error('영수증 삭제 실패:', error);
//         res.status(500).json({ message: '서버 오류로 삭제 실패' });
//     }
// });

module.exports = router;
