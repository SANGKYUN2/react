//리드페이지
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap'
import ModalAddress from './ModalAddress';
import ModalPhoto from './ModalPhoto';

const ReadPage = () => {
    const uid = sessionStorage.getItem('uid');
    const [form, setForm] = useState({
        uid: uid,
        uname: '',
        phone: '',
        address1: '',
        address2: '',
        photo: ''
    });
    const { uname, phone, address1, address2, photo } = form;

    const callAPI = async () => {
        const url = `/users/read/${uid}`
        const res = await axios.get(url);
        //console.log(res.data);
        setForm(res.data);
    }

    useEffect(() => {
        callAPI();
    }, [])

    const onChangeForm = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if (uname === "") {
            alert("이름은 반드시 입력해야 합니다.");
            return;
        }
        if (!window.confirm("수정내역을 저장하시겠습니까?")) return;
        //수정내역 저장
        const url = '/users/update';
        const res = await axios.post(url, form);
        if (res.data.result == 1) {
            alert("저장 완료.");
            callAPI();
        }
    }

    return (
        <Row className='justify-content-center my-5 readPage'>
            <Col xs={12} md={10} lg={8}>
                <Card>
                    <Card.Header>
                        <h3 className='text-center'>마이페이지</h3>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={4} className='my-5'>
                                <ModalPhoto uid={uid} photo={photo} callAPI={callAPI}/> 
                            </Col>
                            <Col className='my-5'>
                                <form onSubmit={onSubmit}>
                                    <InputGroup className='mb-2'>
                                        <InputGroup.Text className='title justify-content-center'>이름</InputGroup.Text>
                                        <Form.Control name="uname" value={uname}
                                            onChange={onChangeForm} />
                                    </InputGroup>
                                    <InputGroup className='mb-2'>
                                        <InputGroup.Text className='title justify-content-center'>전화</InputGroup.Text>
                                        <Form.Control name='phone' value={phone}
                                            onChange={onChangeForm} />
                                    </InputGroup>
                                    <InputGroup className='mb-2'>
                                        <InputGroup.Text className='title justify-content-center'>주소</InputGroup.Text>
                                        <Form.Control name='address1' value={address1}
                                            onChange={onChangeForm} />
                                        <ModalAddress form={form} setForm={setForm} />
                                    </InputGroup>
                                    <Form.Control name='address2' value={address2}
                                        onChange={onChangeForm} placeholder='상세주소' />
                                    <div className='text-center my-3'>
                                        <Button className='me-2' variant='success' type='submit'>저장</Button>
                                        <Button variant='secondary' onClick={callAPI}>취소</Button>
                                    </div>
                                </form>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default ReadPage