import axios from 'axios';
import React, { useState } from 'react'
import {Row, Col, Card, Form, Button} from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

const JoinPage = () => {
    const navi = useNavigate();
    const [form, setForm] = useState({
        uid : 'red',
        upass : 'pass',
        uname : '김레드'
    });
    const {uid, upass, uname} = form;
    const onChangeForm = (e) => {
        setForm({...form, [e.target.name] : e.target.value});
    }

    const onSubmit = async(e) => {
        e.preventDefault();
        if(!window.confirm('정말가입하실래요?')) return;
        await axios.post('/users/insert', form);
        alert('회원가입완료!');
        navi('/users/login');
    }

    return (
        <Row className='justify-content-center my-3'>
            <Col xs={8} md={6} lg={4}>
                <Card>
                    <Card.Header><h3 className='text-center'>회원가입</h3></Card.Header>
                    <Card.Body>
                        <form onSubmit={onSubmit}>
                            <Form.Control value={uid} name='uid' onChange={onChangeForm}
                                placeholder='아이디' className='mb-2' />
                            <Form.Control value={upass} name='upass' onChange={onChangeForm}
                                placeholder='비밀번호' type='password' className='mb-2'/>
                            <Form.Control value={uname} name='uname' onChange={onChangeForm}
                                placeholder='이름' className='mb-2'/>
                            <Button type='submit' variant='success' className='w-100'>회원가입</Button>
                        </form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default JoinPage