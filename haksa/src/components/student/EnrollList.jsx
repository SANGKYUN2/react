import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Table, Card, Form, Button, Row, Col } from 'react-bootstrap'
import { BoxContext } from '../../contexts/BoxContext'

const EnrollList = ({list, scode, callCourses}) => {
    const {setBox} = useContext(BoxContext);
    const [course, setCourse] = useState('');
    const [cous, setCous] = useState([]);
    const callAPI = async() => {
        const res = await axios.get('/cou?page=1&size=100')
        //console.log('강좌목록', res.data.list);
        setCous(res.data.list);
    }

    useEffect(()=>{
        callAPI();
    },[])

    const onInsert = () => {
        
        if(course.lcode === '') {
            setBox({
                show : true,
                message : '신청할 강좌를 선택하세요!'
            });
            return;
        }
        if(course.persons===course.capacity) {
            setBox({
                show : true,
                message : '이미 마감된 강좌입니다'
            });
            return;
        }
        setBox({
            show : true,
            message : `'${course.lname}' 강좌를 수강신청하실래요?`,
            action : async() => {
                const res = await axios.post('/enroll/insert', {lcode:course.lcode, scode});
                if(res.data === 0) {
                    callCourses();
                    callAPI();
                }
                else {
                    setBox({
                        show : true,
                        message : '이미 수강신청된 강좌입니다.'
                    })
                }
            }
        });
    }

    const onDelete = (lcode, lname) => {
        setBox ({
            show : true,
            message : `${lname} 강좌를 수강취소하실래요?`,
            action : async () => {
                await axios.post('/enroll/delete', {lcode, scode});
                callAPI();
                callCourses();
            }
        })
    }

    return (
        <div>
            <h1 className='text-center my-3'>수강 신청 목록</h1>
            <Card>
                <Card.Body>
                    <Row>
                        <Col>
                            <Form.Select onChange={(e)=>setCourse(JSON.parse(e.target.value))}>
                                {cous.map(cou=>
                                    <option key={cou.lcode} value={JSON.stringify(cou)}>
                                        {cou.lname} ({cou.lcode} {cou.pname} {cou.dept} {cou.persons}/{cou.capacity}명)
                                    </option>
                                )}
                            </Form.Select>
                        </Col>
                        <Col>
                            <Button onClick={onInsert} 
                                variant='outline-primary' className='px-3'>수강신청</Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <Table className='text-center'>
                <colgroup>
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                </colgroup>
                <thead className='table-dark'>
                    <tr>
                        <td>강좌 코드</td>
                        <td>교과목명</td>
                        <td>지도 교수</td>
                        <td>강의실</td>
                        <td>인원제한</td>
                        <td>강의시간</td>
                        <td>점수</td>
                        <td>수강 신청 날짜</td>
                        <td>수강 신청 취소</td>
                    </tr>
                </thead>
                <tbody>
                    {list.map(cou=>
                        <tr key={cou.lcode}>
                            <td>{cou.lcode}</td>
                            <td>{cou.lname}</td>
                            <td>{cou.pname ? `${cou.pname} (${cou.instructor })`:'-'}</td>
                            <td>{cou.room && `${cou.room}호`}</td>
                            <td>{cou.persons} / {cou.capacity}명</td>
                            <td>{cou.hours}시간</td>
                            <td>{cou.grade}점</td>
                            <td>{cou.edate}</td>
                            <td><Button onClick={()=>onDelete(cou.lcode, cou.lname)} 
                                size='sm' variant='danger'>취소</Button></td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default EnrollList