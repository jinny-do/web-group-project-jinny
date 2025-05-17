// client/src/ledger/Detail.jsx

// client/src/ledger/Detail.jsx

import React, { useState, useEffect } from 'react';
import CalendarHeader from './CalendarHeader';
import { PiPencilLine } from 'react-icons/pi';
import { RiDeleteBin5Line } from 'react-icons/ri';
import axios from 'axios';
import './detail.css';
import { format } from 'date-fns'; // 상단에 꼭 추가

const categories = ['음식', '쇼핑', '교통', '문화생활', '의료/기타'];

export default function Detail() {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [spendingList, setSpendingList] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null); // 수정할 항목 저장

    const formattedDate = selectedDate
        ? format(new Date(selectedDate.getTime() + 9 * 60 * 60 * 1000), 'yyyy-MM-dd')
        : '';

    useEffect(() => {
        const fetchSpending = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(
                    `http://localhost:5000/api/auth/expenses/range?start=${formattedDate}&end=${formattedDate}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setSpendingList(res.data);
            } catch (err) {
                console.error('❌ 소비내역 불러오기 실패:', err);
            }
        };
        fetchSpending();
    }, [formattedDate]);

    const getTotal = (list) => list.reduce((acc, cur) => acc + cur.amount, 0);

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/auth/expenses/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSpendingList(spendingList.filter((item) => item.id !== id));
        } catch (err) {
            console.error('❌ 삭제 실패:', err);
        }
    };

    return (
        <div className="detail-container">
            <CalendarHeader selectedDate={selectedDate} onDateChange={setSelectedDate} />
            <hr></hr>
            <div className="category-grid">
                {categories.map((cat) => {
                    const catList = spendingList.filter((item) => item.category === cat);
                    const catTotal = getTotal(catList);

                    return (
                        <div className="category-box" key={cat}>
                            <div className="category-total-card">총합: {catTotal.toLocaleString()}원</div>
                            <div className="category-card">
                                <div className="category-title">{cat}</div>
                                <ul className="category-list">
                                    {catList.length === 0 ? (
                                        <li className="empty">내역 없음</li>
                                    ) : (
                                        catList.map((item) => (
                                            <li key={item.id} className="list-item">
                                                {item.store_name} : {item.amount.toLocaleString()}원
                                                <div className="action-btn">
                                                    <button
                                                        className="buttons edit-btn"
                                                        onClick={() => {
                                                            setEditItem(item); // 어떤 항목을 수정할지 저장
                                                            setShowModal(true); // 모달 열기
                                                        }}
                                                    >
                                                        <PiPencilLine />
                                                    </button>

                                                    <button
                                                        className="buttons delete-btn"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <RiDeleteBin5Line />
                                                    </button>
                                                </div>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 수정모달 */}

            {showModal && editItem && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h3>내역 수정</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                // TODO: axios.put() 요청 보내기
                                console.log('수정된 항목:', editItem);
                                setShowModal(false);
                            }}
                        >
                            <label>
                                가게명:
                                <input
                                    type="text"
                                    value={editItem.store_name}
                                    onChange={(e) => setEditItem({ ...editItem, store_name: e.target.value })}
                                />
                            </label>
                            <label>
                                금액:
                                <input
                                    type="number"
                                    value={editItem.amount}
                                    onChange={(e) => setEditItem({ ...editItem, amount: parseInt(e.target.value) })}
                                />
                            </label>
                            <div className="modal-btns">
                                <button type="submit">수정하기</button>
                                <button onClick={() => setShowModal(false)}>취소</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// import CalendarHeader from './CalendarHeader';
// import { PiPencilLine } from 'react-icons/pi';
// import { RiDeleteBin5Line } from 'react-icons/ri';

// import './detail.css';

// const categories = ['음식', '쇼핑', '교통', '문화생활', '의료/기타'];

// //  더미 데이터 (프론트에서만 테스트용)

// const dummyData = [
//     { id: 1, category: '음식', memo: '스타벅스', amount: 4500 },
//     { id: 2, category: '쇼핑', memo: '무신사 ', amount: 29000 },
//     { id: 3, category: '교통', memo: '지하철', amount: 1350 },
//     { id: 4, category: '문화생활', memo: '넷플릭스', amount: 17000 },
//     { id: 5, category: '음식', memo: '김밥천국', amount: 6500 },
//     { id: 6, category: '의료/기타', memo: '서구청보건소', amount: 3000 },
// ];

// export default function Detail() {
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [spendingList, setSpendingList] = useState(dummyData); // 여기!!

//     const getTotal = (list) => list.reduce((acc, cur) => acc + cur.amount, 0);

//     return (
//         <div className="detail-container">
//             <CalendarHeader selectedDate={selectedDate} onDateChange={setSelectedDate} />
//             <hr></hr>
//             <div className="category-grid">
//                 {categories.map((cat) => {
//                     const catList = spendingList.filter((item) => item.category === cat);
//                     const catTotal = getTotal(catList);

//                     return (
//                         <div className="category-box" key={cat}>
//                             <div className="category-total-card">총합: {catTotal.toLocaleString()}원</div>
//                             <div className="category-card">
//                                 <div className="category-title">{cat}</div>
//                                 <ul className="category-list">
//                                     {catList.length === 0 ? (
//                                         <li className="empty">내역 없음</li>
//                                     ) : (
//                                         catList.map((item) => (
//                                             <li key={item.id} className="list-item">
//                                                 {item.memo} : {item.amount.toLocaleString()}원
//                                                 <div className="action-btn">
//                                                     <button className="buttons edit-btn">
//                                                         <PiPencilLine />
//                                                     </button>
//                                                     <button className="buttons delete-btn">
//                                                         <RiDeleteBin5Line />
//                                                     </button>
//                                                 </div>
//                                             </li>
//                                         ))
//                                     )}
//                                 </ul>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }
