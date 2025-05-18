// 회원가입/로그인용 모델
// server/models/User.js
const db = require('../config/db');

const User = {
    // ✅ name 포함
    create: async (name, email, phone, age, passwordHash) => {
        const sql = 'INSERT INTO users (name, email, phone, age, password_hash) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.execute(sql, [name, email, phone, age, passwordHash]);
        return result;
    },

    findByEmail: async (email) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.execute(sql, [email]);
        return rows[0];
    },
};

module.exports = User;

// const db = require('../config/db');

// const User = {
//     create: async (email, phone, age, passwordHash) => {
//         const sql = 'INSERT INTO users (email, phone, age, password_hash) VALUES (?, ?, ?, ?)';
//         const [result] = await db.execute(sql, [email, phone, age, passwordHash]);
//         return result;
//     },

//     findByEmail: async (email) => {
//         const sql = 'SELECT * FROM users WHERE email = ?';
//         const [rows] = await db.execute(sql, [email]);
//         return rows[0];
//     },
// };

// module.exports = User;
