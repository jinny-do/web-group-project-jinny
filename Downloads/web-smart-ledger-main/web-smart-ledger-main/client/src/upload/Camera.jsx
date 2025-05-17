// clinet/src/upload/Camera.jsx
// /client/src/upload/Camera.jsx

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './camera.css';
import axios from 'axios';

export default function Camera() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                    streamRef.current = stream;
                }
            } catch (err) {
                console.error('카메라 접근 실패:', err);
                alert('카메라를 사용할 수 없습니다.');
                navigate('/gallery');
            }
        };

        startCamera();

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, [navigate]);

    // 📸 사진 찍고 서버로 업로드
    const takeAndUploadPicture = async () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const base64 = canvas.toDataURL('image/jpeg');

        // base64 → Blob 변환
        const blob = await fetch(base64).then((res) => res.blob());
        const formData = new FormData();
        formData.append('image', blob, 'camera.jpg');

        try {
            const token = localStorage.getItem('token');

            // 1️⃣ 서버 업로드
            const uploadRes = await axios.post('http://localhost:5000/api/receipts/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            const { imagePath, receiptId } = uploadRes.data;

            // 2️⃣ OCR + GPT 분석
            await axios.post(
                'http://localhost:5000/api/ocr/full-process',
                { imagePath, receiptId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert('사진 업로드 및 분석 완료!');
        } catch (err) {
            console.error('업로드 또는 분석 실패:', err);
            alert('업로드 또는 분석 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="camera-wrapper">
            <h2 className="camera-title">📷 카메라 촬영</h2>

            <video ref={videoRef} autoPlay playsInline muted className="camera-video" />

            <canvas ref={canvasRef} style={{ display: 'none' }} />

            <br />
            <button className="camera-button" onClick={takeAndUploadPicture}>
                📤 사진 찍고 업로드하기
            </button>
            <button className="camera-button" onClick={() => navigate('/upload')}>
                ← 돌아가기
            </button>
        </div>
    );
}

// import React, { useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './camera.css';

// export default function Camera() {
//     const videoRef = useRef(null);
//     const canvasRef = useRef(null);
//     const navigate = useNavigate();
//     const streamRef = useRef(null);

//     useEffect(() => {
//         const startCamera = async () => {
//             try {
//                 const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//                 if (videoRef.current) {
//                     videoRef.current.srcObject = stream;
//                     videoRef.current.play();
//                     streamRef.current = stream;
//                 }
//             } catch (err) {
//                 console.error('카메라 접근 실패:', err);
//                 alert('카메라를 사용할 수 없습니다.');
//                 navigate('/upload');
//             }
//         };

//         startCamera();

//         return () => {
//             if (streamRef.current) {
//                 streamRef.current.getTracks().forEach((track) => track.stop());
//             }
//         };
//     }, [navigate]);

//     // 사진 찍기
//     const takePicture = () => {
//         const canvas = canvasRef.current;
//         const video = videoRef.current;

//         // Canvas에 비디오 이미지를 그리기
//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;
//         const context = canvas.getContext('2d');
//         context.drawImage(video, 0, 0, canvas.width, canvas.height);

//         // 이미지 데이터를 상태에 저장
//         const imageUrl = canvas.toDataURL('image/png');

//         // 기존 이미지 불러오기
//         const savedImages = JSON.parse(localStorage.getItem('receipts') || '[]');

//         // 새로 찍은 이미지를 기존 목록에 추가
//         savedImages.push(imageUrl);

//         // 로컬 스토리지에 저장
//         localStorage.setItem('receipts', JSON.stringify(savedImages));

//         // 사진이 찍히면 알림을 띄운다
//         alert('사진이 저장되었습니다!');
//     };

//     return (
//         <div className="camera-wrapper">
//             <h2 className="camera-title">📷 카메라 촬영</h2>

//             <video ref={videoRef} autoPlay playsInline muted className="camera-video" />

//             {/* 촬영한 이미지를 보여줄 캔버스 */}
//             <canvas ref={canvasRef} style={{ display: 'none' }} />

//             <br />
//             <button className="camera-button" onClick={takePicture}>
//                 📸 사진 찍기
//             </button>
//             <button className="camera-button" onClick={() => navigate('/upload')}>
//                 ← 돌아가기
//             </button>
//         </div>
//     );
// }
