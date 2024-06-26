import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Card, InputGroup, Button, Form , Col, Row} from 'react-bootstrap';
import { BoxContext } from '../../contexts/BoxContext';

const UpdatePage = () => {
    const [form, setForm] = useState('');
    const [course, setCourse] = useState('');
    const {lcode} = useParams();
    const {lname, hours, room, instructor, capacity, persons, dept, pname} = form;

    const navi = useNavigate();
    const {setBox} = useContext(BoxContext);
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);

    const callAPI = async() => {
        setLoading(true);
        const res = await axios.get(`/cou/${lcode}`);
        console.log(res.data);
        setForm(res.data);
        setCourse(res.data);

        const res1 = await axios.get(`/pro?page=1&size=100&word=${res.data.dept}`);
        setList(res1.data.list);
        setLoading(false);
    }

    useEffect(()=>{
        callAPI();
    },[]);


    const onChangeForm = (e) => {
        setForm({...form, [e.target.name] : e.target.value})
    }

    const onClickCancel = () => {
        if(JSON.stringify(course)===JSON.stringify(form)) return;
        setBox({
            show : true,
            message : '정말로 취소하실래요?',
            action : () => setForm(course)
        })

    }

    const onClickUpdate =() => {
        if(JSON.stringify(course)===JSON.stringify(form)) return;
        console.log(form)
        //console.log(form)
        setBox({
            show:true,
            message : '변경된 정보를 수정하실래요?',
            action : async() => {
                await axios.post('/cou/update', form);
                navi(`/cou/read/${lcode}`);
            }
        })
    }

    if(loading) return <h1 className='my-3 text-center'>로딩중............</h1>
    return (
        <div>
            <Row className='justify-content-center'>
                <Col xs={12} md={10} lg={8}>
                    <h1 className='text-center my-3'>정보수정</h1>
                    <Card>
                        <Card.Body>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text className='title justify-content-center'>강좌 번호</InputGroup.Text>
                                <Form.Control value={lcode} readOnly/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text className='title justify-content-center'>강좌 이름</InputGroup.Text>
                                <Form.Control value={lname} name='lname' onChange={onChangeForm}/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text className='title justify-content-center'>강의 장소</InputGroup.Text>
                                <Form.Control value={room} name="room" onChange={onChangeForm}/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text className='title justify-content-center'>인원 제한</InputGroup.Text>
                                <Form.Control value={capacity} name="capacity" onChange={onChangeForm}/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text className='title justify-content-center'>강의 시간</InputGroup.Text>
                                <Form.Control value={hours} name="hours" onChange={onChangeForm}/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text className='title justify-content-center'>개설 학과</InputGroup.Text>
                                <Form.Control value={dept} name="dept" readOnly/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text className='title justify-content-center'>지도 교수</InputGroup.Text>
                                <Form.Select value={instructor} name='instructor' onChange={onChangeForm}>
                                    {list.map(pro=>
                                        <option key={pro.pcode} value={pro.pcode}>
                                            {pro.pname} : {pro.dept}
                                        </option>
                                    )}
                                </Form.Select>
                            </InputGroup>
                            <div className='text-center mt-3'>
                                <Button onClick={onClickUpdate}
                                    className='me-2' variant='warning'>정보 수정</Button>
                                <Button onClick={onClickCancel} 
                                    variant='secondary'>수정 취소</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            
        </div>
    )
}

export default UpdatePage