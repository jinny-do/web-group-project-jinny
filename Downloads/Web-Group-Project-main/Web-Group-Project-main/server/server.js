// server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth'); // ✅ 이거 한 번만

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 다른 라우터
const ocrRoutes = require('./routes/ocr');
const goalRoutes = require('./routes/goal');
const receiptRoutes = require('./routes/receipts');
const gptRoutes = require('./routes/gpt');
const expensesRoutes = require('./routes/expenses');
// const fullProcessRouter = require('./routes/fullProcess');

// 라우터 연결
app.use('/api/auth', authRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/goal', goalRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/gpt', gptRoutes);
app.use('/api/auth/expenses', expensesRoutes);
// app.use('/api/ocr', fullProcessRouter); // ocr/full-process 포함
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send('Smart Ledger Server is running.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
