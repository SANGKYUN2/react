import React, { useState } from 'react'
import { Row, Col, Card, Form, InputGroup, Button } from 'react-bootstrap'
import { app } from '../../firebaseInit'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const JoinPage = () => {
    const auth = getAuth(app);
    const navi = useNavigate();
    const [ form, setForm ] = useState({
        email: 'kcal@test.com',
        pass: '12341234'
    });

    const { email, pass } = form;
    const onChangeForm = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if(email==='' || pass==='') {
            alert('이메일과 패스워드를 입력하세요!');
        }
        else {
            createUserWithEmailAndPassword(auth, email, pass)
            .then(success=>{
                navi("/user/login");
            })
            .catch(error=>{
                alert("회원가입 오류 : " + error);
            })
        }
    }
    return (
        <div className='my-5 userLogin'>
            <Row className='justify-content-center'>
                <Col xs={8} md={6} lg={4}>
                    <Card>
                        <Card.Header><h3 className='text-center'>회원가입</h3></Card.Header>
                        <Card.Body>
                            <form onSubmit={onSubmit}>
                                <InputGroup className='mb-2'>
                                    <InputGroup.Text className='title jutify-content-center'>아이디</InputGroup.Text>
                                        <Form.Control name="email" value={email}  onChange={onChangeForm}
                                            placeholder='아이디를 입력해 주세요.' />
                                </InputGroup>
                                <InputGroup className='mb-2'>
                                    <InputGroup.Text className='title jutify-content-center'>비밀번호</InputGroup.Text>
                                        <Form.Control name="pass" type="password" value={pass}  onChange={onChangeForm}
                                            placeholder='비밀번호를 입력해 주세요.' />
                                </InputGroup>
                                <Form.Check
                                    label="아이디 저장" />
                                <Button type='submit' variant='success' className='w-100 mt-2'>회원가입</Button>
                            </form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}


export default JoinPage