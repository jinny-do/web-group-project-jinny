// /server/models/Expense.js

const pool = require('../config/db');

const Expense = {
    async create(user_id, receipt_id, category, amount, store_name, product_name, purchase_date) {
        const [result] = await pool.query(
            `INSERT INTO expenses (user_id, receipt_id, category, amount, store_name, product_name, purchase_date)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [user_id, receipt_id, category, amount, store_name, product_name, purchase_date]
        );
        return result;
    },

    async getAllByUserId(user_id) {
        const [rows] = await pool.query('SELECT * FROM expenses WHERE user_id = ? ORDER BY purchase_date DESC', [
            user_id,
        ]);
        return rows;
    },

    async update(id, user_id, updates) {
        const fields = [];
        const values = [];

        for (const key in updates) {
            fields.push(`${key} = ?`);
            values.push(updates[key]);
        }

        values.push(user_id, id); // WHERE user_id = ? AND id = ?

        const sql = `
            UPDATE expenses SET ${fields.join(', ')}
            WHERE user_id = ? AND id = ?
        `;

        const [result] = await pool.query(sql, values);
        return result;
    },

    async delete(id, user_id) {
        const [result] = await pool.query(`DELETE FROM expenses WHERE id = ? AND user_id = ?`, [id, user_id]);
        return result;
    },

    async getByDateRange(user_id, startDate, endDate) {
        const [rows] = await pool.query(
            `SELECT * FROM expenses
             WHERE user_id = ? AND DATE(purchase_date) BETWEEN ? AND ?
             ORDER BY purchase_date ASC`,
            [user_id, startDate, endDate]
        );
        return rows;
    },
};

module.exports = Expense;

// // const pool = require('../config/db');

// // // ✅ 소비내역 저장
// // async function create(user_id, receipt_id, category, amount, store_name, product_name, purchase_date) {
// //     const [result] = await pool.query(
// //         `INSERT INTO expenses (user_id, receipt_id, category, amount, store_name, product_name, purchase_date)
// //          VALUES (?, ?, ?, ?, ?, ?, ?)`,
// //         [user_id, receipt_id, category, amount, store_name, product_name, purchase_date]
// //     );
// //     return result;
// // }

// // // ✅ 전체 소비내역 조회 (user_id 기준)
// // async function getAllByUserId(user_id) {
// //     const [rows] = await pool.query(`SELECT * FROM expenses WHERE user_id = ? ORDER BY purchase_date DESC`, [user_id]);
// //     return rows;
// // }

// // module.exports = {
// //     create,
// //     getAllByUserId,
// // };

// const express = require('express');
// const router = express.Router();
// const verifyToken = require('../middlewares/authMiddleware');
// const Expense = require('../models/Expense');
// // /server/models/Expense.js

// const pool = require('../config/db');

// const Expense = {
//     async getAllByUserId(userId) {
//         const [rows] = await pool.query('SELECT * FROM expenses WHERE user_id = ? ORDER BY purchase_date DESC', [
//             userId,
//         ]);
//         return rows;
//     },
// };

// module.exports = Expense;

// // 소비내역 저장 API
// router.post('/', verifyToken, async (req, res) => {
//     try {
//         let { store, amount, date, category, receipt_id } = req.body;
//         const user_id = req.user.userId;

//         // ✅ 1. 로그: 원본 입력값 확인
//         console.log('🧾 원본 파라미터:', { store, amount, date, category });

//         // ✅ 2. 금액 전처리 (예: "5,000원" → 5000)
//         if (typeof amount === 'string') {
//             const parsedAmount = parseInt(amount.replace(/[^\d]/g, ''), 10);
//             amount = isNaN(parsedAmount) ? null : parsedAmount;
//         }

//         // ✅ 3. 날짜 전처리 (예: "2024-08-21" → "2024-08-21 00:00:00")
//         if (typeof date === 'string') {
//             const parsedDate = new Date(date);
//             date = isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString().slice(0, 19).replace('T', ' ');
//         }

//         // ✅ 4. 필수 필드 확인
//         if (!store || !amount || !category || !date) {
//             console.error('❌ 필수 필드 누락 또는 전처리 실패:', {
//                 store,
//                 amount,
//                 date,
//                 category,
//             });
//             return res.status(400).json({ message: '필수 항목 누락 또는 형식 오류' });
//         }

//         // ✅ 5. 최종 저장 파라미터 로그
//         console.log('🚨 저장 전 파라미터:', {
//             user_id,
//             receipt_id: receipt_id || null,
//             category,
//             amount,
//             store_name: store,
//             product_name: null,
//             purchase_date: date,
//         });

//         // ✅ 6. DB 저장 (정확한 순서로 인자 전달)
//         const newExpense = await Expense.create(
//             user_id,
//             receipt_id || null,
//             category,
//             amount,
//             store,
//             null, // product_name은 아직 없음
//             date
//         );

//         console.log('✅ 저장 성공:', newExpense);
//         res.status(201).json(newExpense);
//     } catch (error) {
//         console.error('❌ 소비내역 저장 오류:', error);
//         res.status(500).json({ message: '소비내역 저장 실패' });
//     }
// });

// module.exports = router;
