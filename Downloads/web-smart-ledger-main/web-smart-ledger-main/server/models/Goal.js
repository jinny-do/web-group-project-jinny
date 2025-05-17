const db = require('../config/db');

const Goal = {
    create: async (userId, targetAmount, goalYear, goalMonth) => {
        const sql = `
            INSERT INTO monthly_goal_amount
                (user_id, target_amount, goal_year, goal_month)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.execute(sql, [userId, targetAmount, goalYear, goalMonth]);
        return result;
    },

    getAllByUserId: async (userId) => {
        const sql = `
            SELECT id, target_amount, goal_year, goal_month, created_at
            FROM monthly_goal_amount
            WHERE user_id = ?
            ORDER BY goal_year DESC, goal_month DESC
        `;
        const [rows] = await db.execute(sql, [userId]);
        return rows;
    },

    getById: async (id, userId) => {
        const sql = `
            SELECT id, target_amount, goal_year, goal_month, created_at
            FROM monthly_goal_amount
            WHERE id = ? AND user_id = ?
        `;
        const [rows] = await db.execute(sql, [id, userId]);
        return rows[0];
    },

    update: async (id, userId, targetAmount, goalYear, goalMonth) => {
        const sql = `
            UPDATE monthly_goal_amount
            SET target_amount = ?, goal_year = ?, goal_month = ?
            WHERE id = ? AND user_id = ?
        `;
        const [result] = await db.execute(sql, [targetAmount, goalYear, goalMonth, id, userId]);
        return result;
    },

    delete: async (id, userId) => {
        const sql = `
            DELETE FROM monthly_goal_amount
            WHERE id = ? AND user_id = ?
        `;
        const [result] = await db.execute(sql, [id, userId]);
        return result;
    },

    /** ✅ 특정 사용자 + 연도 + 월 조합으로 목표 조회 */
    getByUserIdAndMonth: async (userId, year, month) => {
        const sql = `
            SELECT target_amount AS amount
            FROM monthly_goal_amount
            WHERE user_id = ? AND goal_year = ? AND goal_month = ?
        `;
        const [rows] = await db.execute(sql, [userId, year, month]);
        return rows[0];
    },

    /** ✅ 특정 사용자 + 연도 + 월 조합으로 목표금액 수정 */
    updateByUserIdAndMonth: async (userId, year, month, amount) => {
        const sql = `
            UPDATE monthly_goal_amount
            SET target_amount = ?
            WHERE user_id = ? AND goal_year = ? AND goal_month = ?
        `;
        const [result] = await db.execute(sql, [amount, userId, year, month]);
        return result;
    },
};

module.exports = Goal;
