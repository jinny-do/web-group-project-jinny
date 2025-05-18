// client/src/Main/Register.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Reg.css';
import axios from 'axios'; // ✅ axios 추가

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            // ✅ 백엔드 회원가입 요청
            const res = await axios.post('http://localhost:5000/api/auth/register', {
                name: form.name,
                email: form.email,
                password: form.password,
            });

            alert('회원가입 완료! 로그인 해주세요.');
            navigate('/login');
        } catch (err) {
            console.error('❌ 회원가입 실패:', err);
            alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className="register-background">
            <img src="./images/logo3.png" alt="로고" className="logo-r" onClick={() => navigate('/')} />

            <div className="register-card">
                <h2 className="register-title">회원가입</h2>
                <form onSubmit={handleSubmit} className="register-form">
                    <label>이름</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required />
                    <label>이메일 주소</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required />
                    <label>비밀번호</label>
                    <input type="password" name="password" value={form.password} onChange={handleChange} required />
                    <label>비밀번호 확인</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="register-button">
                        가입하기
                    </button>
                </form>

                <div className="divider">
                    <span>OR</span>
                </div>
                <p className="go-login" onClick={() => navigate('/')}>
                    계정이 이미 있습니까?
                </p>
            </div>
        </div>
    );
}

export default Register;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Reg.css';

// function Register() {
//     const navigate = useNavigate();
//     const [form, setForm] = useState({
//         name: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setForm({ ...form, [name]: value });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (form.password !== form.confirmPassword) {
//             alert('비밀번호가 일치하지 않습니다.');
//             return;
//         }
//         alert('회원가입 완료!');
//         navigate('/login');
//     };

//     return (
//         <div className="register-background">
//             <img src="./images/logo3.png" alt="로고" className="logo-r" onClick={() => navigate('/')} />

//             <div className="register-card">
//                 <h2 className="register-title">회원가입</h2>
//                 <form onSubmit={handleSubmit} className="register-form">
//                     <label>이름</label>
//                     <input type="text" name="name" value={form.name} onChange={handleChange} required />
//                     <label>이메일 주소</label>
//                     <input type="email" name="email" value={form.email} onChange={handleChange} required />
//                     <label>비밀번호</label>
//                     <input type="password" name="password" value={form.password} onChange={handleChange} required />
//                     <label>비밀번호 확인</label>
//                     <input
//                         type="password"
//                         name="confirmPassword"
//                         value={form.confirmPassword}
//                         onChange={handleChange}
//                         required
//                     />
//                     <button type="submit" className="register-button">
//                         가입하기
//                     </button>
//                 </form>

//                 <div className="divider">
//                     <span>OR</span>
//                 </div>
//                 <p className="go-login" onClick={() => navigate('/')}>
//                     계정이 이미 있습니까?
//                 </p>
//             </div>
//         </div>
//     );
// }

// export default Register;
