import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Card, InputGroup, Button, Form , Col, Row} from 'react-bootstrap';
import { BoxContext } from '../../contexts/BoxContext';

const UpdatePage = () => {
    const navi = useNavigate();
    const {setBox} = useContext(BoxContext);
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [student, setStudent] = useState('');
    const [form, setForm] = useState('');
    const {scode} = useParams();
    const {sname, dept, birthday, pname, advisor, year} = form;

    const callAPI = async() => {
        setLoading(true);
        const res = await axios.get(`/stu/${scode}`);
        console.log(res.data);
        setForm(res.data);
        setStudent(res.data);

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
        if(JSON.stringify(student)===JSON.stringify(form)) return;
        setBox({
            show : true,
            message : '정말로 취소하실래요?',
            action : () => setForm(student)
        })

    }

    const onClickUpdate =() => {
        if(JSON.stringify(student)===JSON.stringify(form)) return;
        //console.log(form)
        setBox({
            show:true,
            message : '변경된 정보를 수정하실래요?',
            action : async() => {
                await axios.post('/stu/update', form);
                navi(`/stu/read/${scode}`);
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
                                <InputGroup.Text className='title justify-content-center'>학생 학번</InputGroup.Text>
                                <Form.Control value={scode} readOnly/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text className='title justify-content-center'>학생 이름</InputGroup.Text>
                                <Form.Control value={sname} name='sname' onChange={onChangeForm}/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text className='title justify-content-center'>학생 학과</InputGroup.Text>
                                <Form.Select value={dept}>
                                    <option value="전산">전산기사</option>
                                    <option value="전자">전자기사</option>
                                    <option value="건축">건축기사</option>
                                </Form.Select>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text className='title justify-content-center'>생년 월일</InputGroup.Text>
                                <Form.Control name='birthday' onChange={onChangeForm} value={birthday || '2005-01-01'} type='date'/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text className='title justify-content-center'>학생 학년</InputGroup.Text>
                                <Form.Control name='year' onChange={onChangeForm} value={year}/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text className='title justify-content-center'>지도 교수</InputGroup.Text>
                                <Form.Select name='advisor' onChange={onChangeForm} value={advisor}>
                                    {list.map(pro=>
                                        <option value={pro.pcode} key={pro.pcode}>{pro.pname} ({pro.pcode} : {pro.dept})</option>
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