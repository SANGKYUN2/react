import axios from 'axios';
import React, { useState } from 'react'
import { InputGroup, Form, Button, Card, Col, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navi = useNavigate();
    const [form, setForm] = useState({
        uid : 'green',
        upass : 'pass'
    });

    const { uid, upass } = form;
    const onChangeForm = (e) => {
        setForm({...form, [e.target.name] : e.target.value});
    }

    const onSubmit = async(e) => {
        e.preventDefault();
        const res = await axios.get(`/users/${uid}`);
        console.log(res.data);

        if(!res.data) {
            alert("아이디가 존재하지 않습니다!")
        }
        else if (upass === res.data.upass) {
            alert("성공!");
            sessionStorage.setItem('uid', res.data.uid);
            sessionStorage.setItem('uname', res.data.uname);
            if(sessionStorage.getItem('target')) {
                window.location.href=sessionStorage.getItem('target');
            }
            else {
                window.location.href="/";
            }    
        }
        else {
            alert ("비밀번호가 일치하지 않습니다!")
        }
    }

    return (
        <Row className='justify-content-center my-5 userLogin'>
            <Col xs={8} md={6} lg={4}>
                <Card>
                    <Card.Header><h3 className='text-center'>로그인</h3></Card.Header>
                    <Card.Body>
                        <form onSubmit={onSubmit}>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text className='title justify-content-center'>아이디</InputGroup.Text>
                                <Form.Control name="uid" value={uid} onChange={onChangeForm} />
                            </InputGroup>
                            <InputGroup className='mb-3'>
                                <InputGroup.Text className='title justify-content-center'>비밀번호</InputGroup.Text>
                                <Form.Control name="upass" value={upass} onChange={onChangeForm} type="password"/>
                            </InputGroup>
                            <Button className='w-100' variant='success' type="submit">로그인</Button>
                        </form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default LoginPage