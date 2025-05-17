// /client/src/report/Goal.jsx

import React, { useState, useEffect } from 'react';
import './goal.css';
import axios from 'axios';
import { format } from 'date-fns';

export default function GoalSettingPage() {
    const [input, setInput] = useState('');
    const [goal, setGoal] = useState('');

    // 현재 년-월 계산
    const now = new Date();
    const yearMonth = format(now, 'yyyy-MM');

    // ⬇️ 서버에서 이번 달 목표금액 불러오기
    useEffect(() => {
        const fetchGoal = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/goal?yearMonth=${yearMonth}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (res.data && res.data.amount) {
                    setGoal(res.data.amount);
                }
            } catch (error) {
                console.log('🎯 이번 달 목표 없음 or 오류', error.response?.data?.message || error.message);
            }
        };

        fetchGoal();
    }, [yearMonth]);

    // 입력값 숫자만
    const handleInputChange = (e) => {
        const onlyNums = e.target.value.replace(/[^0-9]/g, '');
        setInput(onlyNums);
    };

    // ⬇️ 목표 저장 버튼 클릭
    const handleConfirm = async () => {
        if (!input.trim()) {
            alert('⚠️ 목표 금액을 입력해 주세요!');
            return;
        }

        try {
            await axios.post(
                'http://localhost:5000/api/goal',
                {
                    yearMonth,
                    amount: parseInt(input),
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            alert('✅ 이번 달 목표가 저장되었습니다!');
            setGoal(input);
            setInput('');
        } catch (err) {
            console.error('❌ 목표 저장 실패:', err);
            alert('❌ 저장 실패! 다시 시도해주세요.');
        }
    };

    return (
        <div className="goal-setting-wrapper">
            <div className="goal">
                <label>📌 목표 금액 입력 :</label>
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="이번 달 목표 금액을 입력해 주세요! (숫자만 입력해 주세요)"
                />
                <button className="goal-button" onClick={handleConfirm}>
                    확인
                </button>
            </div>
        </div>
    );
}

// // clinet/src/report/Goal.jsx

// import React, { useState, useEffect } from 'react';
// import './goal.css';
// import axios from 'axios';

// export default function GoalSettingPage() {
//     const [input, setInput] = useState('');
//     const [goal, setGoal] = useState('');

//     useEffect(() => {
//         // const now = new Date();
//         // const year = now.getFullYear();
//         // const month = String(now.getMonth() + 1).padStart(2, '0');
//         // const key = `goal-${year}-${month}`;
//         // const savedGoal = localStorage.getItem(key);
//         // if (savedGoal) setGoal(savedGoal);
//         // MainPage.jsx useEffect 안에 추가해도 됨 (임시용)
//         const now = new Date();
//         const year = now.getFullYear();
//         const month = String(now.getMonth() + 1).padStart(2, '0');
//         const key = `goal-${year}-${month}`;
//         const tempGoal = localStorage.getItem(key);
//         if (tempGoal) setGoal(tempGoal);
//     }, []);

//     const handleConfirm = async () => {
//         if (!input.trim()) {
//             alert('⚠️ 목표 금액을 입력해 주세요!');
//             return;
//         }

//         const now = new Date();
//         const year = now.getFullYear();
//         const month = String(now.getMonth() + 1).padStart(2, '0');
//         const yearMonth = `${year}-${month}`;

//         setGoal(input);

//         try {
//             await axios.post('/api/goal', {
//                 userId: 3,
//                 yearMonth,
//                 amount: parseInt(input),
//             });

//             alert('✅ 이번 달 목표가 저장되었습니다!');
//         } catch (err) {
//             console.error('저장 실패:', err);
//             alert('❌ 저장 실패! 다시 시도해주세요.');
//         }
//     };

//     // 숫자만 입력 가능하게
//     const handleInputChange = (e) => {
//         const onlyNums = e.target.value.replace(/[^0-9]/g, '');
//         setInput(onlyNums);
//     };

//     return (
//         <div className="goal-setting-wrapper">
//             <div className="goal">
//                 <label>📌 목표 금액 입력 :</label>
//                 <input
//                     type="text"
//                     value={input}
//                     onChange={handleInputChange}
//                     placeholder="  이번 달 목표 금액을 입력해 주세요! (숫자만 입력해 주세요) "
//                 />
//                 <button className="goal-button" onClick={handleConfirm}>
//                     확인
//                 </button>
//             </div>
//         </div>
//     );
// }
