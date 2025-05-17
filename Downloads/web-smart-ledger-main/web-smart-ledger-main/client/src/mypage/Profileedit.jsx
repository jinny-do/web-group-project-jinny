// clinet/src/mypage/Profileedit.jsx

import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import './Edit.css';

export default function Profileedit({ show, handleClose }) {
    return (
        <Modal show={show} onHide={handleClose} centered className="my-modal">
            <Modal.Header closeButton className="modal-header-custom">
                <Modal.Title>회원정보 수정</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body-custom">
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>이름</Form.Label>
                        <Form.Control type="text" placeholder="이름 입력" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>이메일</Form.Label>
                        <Form.Control type="email" placeholder="이메일 입력" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>비밀번호</Form.Label>
                        <Form.Control type="password" placeholder="새 비밀번호 입력" />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    닫기
                </Button>
                <Button className="pink-button">저장</Button>
            </Modal.Footer>
        </Modal>
    );
}
