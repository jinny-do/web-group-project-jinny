// /client/src/upload/Gallery.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Gallery.css';
import axios from 'axios';

export default function Gallery() {
    const [receipts, setReceipts] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/receipts/list', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const unique = Array.from(new Map(res.data.receipts.map((item) => [item.id, item])).values());
                setReceipts(unique);
            } catch (err) {
                console.error('이미지 목록 불러오기 실패:', err);
            }
        };

        fetchReceipts();
    }, []);

    // ✅ 삭제 기능만 남김
    const handleDelete = async (receiptId) => {
        const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/receipts/${receiptId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // 새로고침 없이 화면에서 제거
            setReceipts((prev) => prev.filter((item) => item.id !== receiptId));
            alert('삭제 완료!');
        } catch (err) {
            console.error('삭제 실패:', err);
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="gallery-wrapper">
            <h2 className="gallery-title">📂 업로드한 영수증 목록</h2>

            {receipts.length === 0 ? (
                <p className="no-image">서버에 업로드된 이미지가 없습니다.</p>
            ) : (
                <div className="image-grid">
                    {receipts.map((item) => (
                        <div key={item.id} className="image-item">
                            <img
                                src={`http://localhost:5000/${item.image_path}`}
                                alt={`receipt-${item.id}`}
                                className="receipt-image"
                                onClick={() => setSelectedImage(`http://localhost:5000/${item.image_path}`)}
                            />
                            <div className="info-box">
                                <div className="gallery-button-group">
                                    <button className="gallery-button small red" onClick={() => handleDelete(item.id)}>
                                        🧽 삭제하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 확대 모달 */}
            {selectedImage && (
                <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
                    <img
                        src={selectedImage}
                        alt="확대 이미지"
                        className="modal-image"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            {/* 하단 이동 버튼 */}
            <button className="gallery-button mt-4" onClick={() => navigate('/camera')}>
                📷 카메라로 가기
            </button>
            <button className="gallery-button mt-4" onClick={() => navigate('/upload')}>
                📤 업로드 페이지로 가기
            </button>
        </div>
    );
}

// // clinet/src/upload/Gallery.jsx

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Gallery.css';
// import axios from 'axios';

// export default function Gallery() {
//     const [receipts, setReceipts] = useState([]);
//     const [selectedImage, setSelectedImage] = useState(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchReceipts = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const res = await axios.get('http://localhost:5000/api/receipts/list', {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 console.log('📸 서버 응답 데이터:', res.data.receipts); // 👈 이거 추가

//                 // ✅ 중복 제거 결과를 setReceipts에 반영
//                 const unique = Array.from(new Map(res.data.receipts.map((item) => [item.id, item])).values());
//                 setReceipts(unique); // ✅ 이걸 사용해야 중복 안 뜸
//             } catch (err) {
//                 console.error('이미지 목록 불러오기 실패:', err);
//             }
//         };

//         fetchReceipts();
//     }, []);

//     const handleReanalyze = async (receiptId, imagePath) => {
//         try {
//             const token = localStorage.getItem('token');
//             await axios.post(
//                 'http://localhost:5000/api/ocr/full-process',
//                 { receiptId, imagePath },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
//             alert('분석 완료!');
//             window.location.reload();
//         } catch (err) {
//             console.error('재분석 실패:', err);
//             alert('재분석 중 오류가 발생했습니다.');
//         }
//     };

//     const handleDelete = async (receiptId) => {
//         const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
//         if (!confirmDelete) return;

//         try {
//             const token = localStorage.getItem('token');
//             await axios.delete(`http://localhost:5000/api/receipts/${receiptId}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             alert('삭제 완료!');
//             window.location.reload();
//         } catch (err) {
//             console.error('삭제 실패:', err);
//             alert('삭제 중 오류가 발생했습니다.');
//         }
//     };

//     return (
//         <div className="gallery-wrapper">
//             <h2 className="gallery-title">📂 업로드한 영수증 목록</h2>

//             {receipts.length === 0 ? (
//                 <p className="no-image">서버에 업로드된 이미지가 없습니다.</p>
//             ) : (
//                 <div className="image-grid">
//                     {receipts.map((item) => (
//                         <div key={item.id} className="image-item">
//                             <img
//                                 src={`http://localhost:5000/${item.image_path}`}
//                                 alt={`receipt-${item.id}`}
//                                 className="receipt-image"
//                                 onClick={() => setSelectedImage(`http://localhost:5000/${item.image_path}`)}
//                             />
//                             <div className="info-box">
//                                 <div className="ocr-status">
//                                     상태: {item.ocr_status === 'done' ? '✅ 처리 완료' : '⌛ 미처리'}
//                                 </div>

//                                 <div className="gallery-button-group">
//                                     {item.ocr_status === 'pending' && (
//                                         <button
//                                             className="gallery-button small"
//                                             onClick={() => handleReanalyze(item.id, item.image_path)}
//                                         >
//                                             🔍 분석하기
//                                         </button>
//                                     )}
//                                     <button className="gallery-button small red" onClick={() => handleDelete(item.id)}>
//                                         🧽 삭제하기
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {selectedImage && (
//                 <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
//                     <img
//                         src={selectedImage}
//                         alt="확대 이미지"
//                         className="modal-image"
//                         onClick={(e) => e.stopPropagation()}
//                     />
//                 </div>
//             )}

//             <button className="gallery-button mt-4" onClick={() => navigate('/camera')}>
//                 📷 카메라로 가기
//             </button>
//             <button className="gallery-button mt-4" onClick={() => navigate('/upload')}>
//                 📤 업로드 페이지로 가기
//             </button>
//         </div>
//     );
// }

// // import React, { useEffect, useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import './Gallery.css';
// // import { RiDeleteBin5Line } from 'react-icons/ri';
// // import axios from 'axios';

// // export default function Gallery() {
// //     const [receipts, setReceipts] = useState([]);
// //     const [selectedImage, setSelectedImage] = useState(null);
// //     const navigate = useNavigate();

// //     // 이미지 목록 불러오기
// //     useEffect(() => {
// //         const fetchReceipts = async () => {
// //             try {
// //                 const token = localStorage.getItem('token');
// //                 const res = await axios.get('http://localhost:5000/api/receipts/list', {
// //                     headers: { Authorization: `Bearer ${token}` },
// //                 });
// //                 setReceipts(res.data.receipts);
// //             } catch (err) {
// //                 console.error('이미지 목록 불러오기 실패:', err);
// //             }
// //         };

// //         fetchReceipts();
// //     }, []);

// //     // OCR 다시 분석하기
// //     const handleReanalyze = async (receiptId, imagePath) => {
// //         try {
// //             const token = localStorage.getItem('token');
// //             await axios.post(
// //                 'http://localhost:5000/api/ocr/full-process',
// //                 { receiptId, imagePath },
// //                 { headers: { Authorization: `Bearer ${token}` } }
// //             );
// //             alert('분석 완료!');
// //             window.location.reload();
// //         } catch (err) {
// //             console.error('재분석 실패:', err);
// //             alert('재분석 중 오류가 발생했습니다.');
// //         }
// //     };

// //     // 서버에서 영수증 삭제
// //     const handleDelete = async (receiptId) => {
// //         const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
// //         if (!confirmDelete) return;

// //         try {
// //             const token = localStorage.getItem('token');
// //             await axios.delete(`http://localhost:5000/api/receipts/${receiptId}`, {
// //                 headers: { Authorization: `Bearer ${token}` },
// //             });
// //             alert('삭제 완료!');
// //             window.location.reload();
// //         } catch (err) {
// //             console.error('삭제 실패:', err);
// //             alert('삭제 중 오류가 발생했습니다.');
// //         }
// //     };

// //     return (
// //         <div className="gallery-wrapper">
// //             <h2 className="gallery-title">📂 업로드한 영수증 목록</h2>

// //             {receipts.length === 0 ? (
// //                 <p className="no-image">서버에 업로드된 이미지가 없습니다.</p>
// //             ) : (
// //                 <div className="image-grid">
// //                     {receipts.map((item) => (
// //                         <div key={item.id} className="image-item">
// //                             <img
// //                                 src={`http://localhost:5000/${item.image_path}`}
// //                                 alt={`receipt-${item.id}`}
// //                                 className="receipt-image"
// //                                 onClick={() => setSelectedImage(`http://localhost:5000/${item.image_path}`)}
// //                             />
// //                             <div className="ocr-status">
// //                                 상태: {item.ocr_status === 'done' ? '✅ 처리 완료' : '⌛ 미처리'}
// //                             </div>

// //                             {/* 버튼 그룹 */}
// //                             <div className="gallery-button-group">
// //                                 {item.ocr_status === 'pending' && (
// //                                     <button
// //                                         className="gallery-button small"
// //                                         onClick={() => handleReanalyze(item.id, item.image_path)}
// //                                     >
// //                                         🔍 분석하기
// //                                     </button>
// //                                 )}
// //                                 <button className="gallery-button small red" onClick={() => handleDelete(item.id)}>
// //                                     <RiDeleteBin5Line /> 삭제
// //                                 </button>
// //                             </div>
// //                         </div>
// //                     ))}
// //                 </div>
// //             )}

// //             {/* 모달 */}
// //             {selectedImage && (
// //                 <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
// //                     <img
// //                         src={selectedImage}
// //                         alt="확대 이미지"
// //                         className="modal-image"
// //                         onClick={(e) => e.stopPropagation()}
// //                     />
// //                 </div>
// //             )}

// //             {/* 이동 버튼 */}
// //             <button className="gallery-button mt-4" onClick={() => navigate('/camera')}>
// //                 📷 카메라로 가기
// //             </button>
// //             <button className="gallery-button mt-4" onClick={() => navigate('/upload')}>
// //                 📤 업로드 페이지로 가기
// //             </button>
// //         </div>
// //     );
// // }

// // import React, { useEffect, useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import './Gallery.css';
// // import { RiDeleteBin5Line } from 'react-icons/ri';

// // export default function Gallery() {
// //     const [images, setImages] = useState([]);
// //     const [selectedImage, setSelectedImage] = useState(null); // 모달에 표시할 이미지
// //     const navigate = useNavigate(); // navigate를 사용해 페이지 이동

// //     useEffect(() => {
// //         const savedImages = JSON.parse(localStorage.getItem('receipts') || '[]');
// //         setImages(savedImages);
// //     }, []);

// //     // 이미지 삭제 함수
// //     const handleDeleteImage = (imageToDelete) => {
// //         // 확인 창을 띄워 사용자에게 삭제 여부를 묻기
// //         const userConfirmation = window.confirm('정말로 이 사진을 삭제하시겠습니까?');
// //         if (!userConfirmation) return;

// //         // 삭제할 이미지 제외한 새로운 목록을 만든 후 상태를 업데이트
// //         const updatedImages = images.filter((img) => img !== imageToDelete);
// //         setImages(updatedImages); // 상태 업데이트
// //         localStorage.setItem('receipts', JSON.stringify(updatedImages)); // 로컬스토리지에 업데이트된 목록 저장
// //     };

// //     return (
// //         <div className="gallery-wrapper">
// //             <h2 className="gallery-title">📂 업로드한 영수증 목록</h2>

// //             {images.length === 0 ? (
// //                 <p className="no-image">저장된 이미지가 없습니다.</p>
// //             ) : (
// //                 <div className="image-grid">
// //                     {images.map((src, idx) => (
// //                         <div key={idx} className="image-item">
// //                             <img
// //                                 src={src}
// //                                 alt={`receipt-${idx}`}
// //                                 className="receipt-image"
// //                                 onClick={() => setSelectedImage(src)} // 클릭 시 이미지 확대
// //                             />
// //                             {/* 이미지 삭제 버튼 */}
// //                             <button className="delete-button" onClick={() => handleDeleteImage(src)}>
// //                                 <RiDeleteBin5Line />
// //                             </button>
// //                         </div>
// //                     ))}
// //                 </div>
// //             )}

// //             {/* 모달 */}
// //             {selectedImage && (
// //                 <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
// //                     <img
// //                         src={selectedImage}
// //                         alt="확대 이미지"
// //                         className="modal-image"
// //                         onClick={(e) => e.stopPropagation()} // 이미지 클릭 시 모달이 닫히지 않도록
// //                     />
// //                 </div>
// //             )}

// //             {/* 카메라로 가기 버튼 */}
// //             <button className="gallery-button mt-4" onClick={() => navigate('/camera')}>
// //                 📷 카메라로 가기
// //             </button>

// //             {/* 업로드 페이지로 가기 버튼 */}
// //             <button className="gallery-button mt-4" onClick={() => navigate('/upload')}>
// //                 📤 업로드 페이지로 가기
// //             </button>
// //             {/* 일단 두 개 다 해놨는데 둘 중에 필요없다고 생각 되면 빼기  */}
// //         </div>
// //     );
// // }
