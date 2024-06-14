import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import {Col, Row, Card, InputGroup, Form, Button} from 'react-bootstrap'
import AddressModal from '../common/AddressModal';
import PassModal from './PassModal';

const ReadPage = () => {
    const refFile = useRef();
    const photoStyle = {
        borderRadius : '10px',
        cursor : 'pointer',
        border:'3px solid gray'
    }

    const [user, setUser] = useState('');
    const uid = sessionStorage.getItem('uid');
    const {uname, address1, address2, phone, photo} = user;

    const [image, setImage] = useState({
        fileName : '',
        file : null
    });

    const onChangeFile = (e) => {
        setImage({
            fileName:URL.createObjectURL(e.target.files[0]),
            file : e.target.files[0]
        })
    }

    const {file, fileName} = image;

    const callAPI = async () => {
        const res = await axios.get(`/users/${uid}`);
        console.log(res.data);
        setUser(res.data);
        setImage({...image, fileName:res.data.photo && `/display?file=${res.data.photo}`});
    }

    useEffect(()=> {
        callAPI();
    },[])

    const onChangeFrom = (e) => {
        setUser({...user, [e.target.name] : e.target.value });
    }

    const onInsert = async() => {
        if(!window.confirm('변경된 정보를 수정하실래요?')) return;
        await axios.post('/users/update', user);
        alert("정보수정완료!")
    }

    const onUploadImage = async() => {
        if(file) {
            if(!window.confirm("변경된 이미지를 저장하실래요?")) return;
            //이미지 업로드
            const formData = new FormData();
            formData.append("file", file);
            const config = {
                Headers : {'content-type':'multipart/form-data'}
            }
            await axios.post(`/users/photo/${uid}`, formData, config);
            alert("이미지가 변경되었습니다!");
            callAPI();
        }
    }

    return (
        <Row className='my-5 justify-content-center'>
            <Col xs={12} md={10} lg={8}>
                <Card>
                    <Card.Header>
                        <h3 className='text-center'>프로필 수정</h3>
                    </Card.Header>
                    <Card.Body>
                        <Row className='mb-3'>
                            <Col md={2} className='align-items-center mb-3'>
                                <img style={photoStyle} onClick={()=>refFile.current.click()}
                                    src={fileName || 'http://via.placeholder.com/50x50'} width='100%'/>
                                <input ref = {refFile}
                                    type='file' onChange={onChangeFile} style={{display:'none'}}/>
                                <Button onClick={onUploadImage} 
                                    variant='warning' className='w-100 mt-1' size='sm'>이미지 저장</Button>
                            </Col>
                            <Col>
                                 <InputGroup className='mb-2'>
                                    <InputGroup.Text className='title justify-content-center'>가입일</InputGroup.Text>
                                    <Form.Control name="regDate" value={user.regDate}/>
                                </InputGroup>
                                <InputGroup className='mb-2'>
                                    <InputGroup.Text className='title justify-content-center'>이름</InputGroup.Text>
                                    <Form.Control name= "uname" value={uname} onChange={onChangeFrom}/>
                                    <PassModal/>
                                </InputGroup>
                                <InputGroup className='mb-2'>
                                    <InputGroup.Text className='title justify-content-center'>전화</InputGroup.Text>
                                    <Form.Control name="phone" value={phone} onChange={onChangeFrom}/>
                                </InputGroup>
                                <InputGroup className='mb-2'>
                                    <InputGroup.Text className='title justify-content-center'>주소</InputGroup.Text>
                                    <Form.Control name="address1" value={address1} onChange={onChangeFrom}/>
                                    <AddressModal setForm={setUser} form={user}/>
                                </InputGroup>
                                <Form.Control name="address2" value={address2} placeholder='상세주소' onChange={onChangeFrom}/>
                                <div className='text-center mb mt-3'>
                                    <Button onClick={onInsert} 
                                        variant='success' className='px-3 me-2' size='sm'>적용</Button>
                                    <Button variant='secondary' className='px-3' size='sm'>취소</Button>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default ReadPage