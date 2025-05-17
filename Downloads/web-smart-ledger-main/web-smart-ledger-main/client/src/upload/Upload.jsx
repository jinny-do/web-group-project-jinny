// // clinet/src/upload/Upload.jsx

// /client/src/upload/Upload.jsx

import React, { useRef } from 'react';
import { FaCameraRetro } from 'react-icons/fa';
import './upload.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; //  axios 추가

export default function Upload() {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const openFilePicker = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const token = localStorage.getItem('token');

            // 1️⃣ 이미지 업로드
            const uploadRes = await axios.post('http://localhost:5000/api/receipts/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            const { imagePath, receiptId } = uploadRes.data;
            console.log(uploadRes.data);

            // 2️⃣ OCR + GPT + DB 저장 요청
            await axios.post(
                'http://localhost:5000/api/ocr/full-process',
                {
                    imagePath: imagePath,
                    receiptId: receiptId, // ✅ 필수! 같이 전달해야 400 오류 안 남
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (err) {
            console.error('❌ 업로드 또는 분석 실패:', err);
            alert('이미지 처리 중 오류가 발생했습니다.');
        }
    };

    return (
        <div>
            <p className="text">[영수증 사진을 직접 촬영하거나, 파일을 업로드해 주세요!]</p>
            <div className="camera-icon">
                <FaCameraRetro />
            </div>

            <div className="camera-button-group">
                <button className="camera-button" onClick={openFilePicker}>
                    갤러리에서 이미지 불러오기
                </button>
                <button className="camera-button" onClick={() => navigate('/camera')}>
                    촬영하기
                </button>

                <button className="camera-button" onClick={() => navigate('/gallery')}>
                    업로드한 영수증 보기
                </button>

                <button className="camera-button" onClick={() => navigate('/')}>
                    뒤로가기
                </button>
            </div>

            {/* 숨겨진 파일 업로드 input */}
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </div>
    );
}
