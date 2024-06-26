import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Table, Button } from 'react-bootstrap';
import { BoxContext } from '../../contexts/BoxContext';

const EnrollList = ({lcode}) => {
    const [checked, setChecked] = useState(0);
    const {setBox} = useContext(BoxContext);
    const [enroll, setEnroll] = useState([]);
    const [list, setList] = useState([]);

    useEffect(()=> {
        let cnt = 0;
        list.forEach(stu=>stu.checked && cnt++);
        setChecked(cnt);
    }, [list])

    const callAPI = async() => {
        const res = await axios.get(`/enroll/lcode/${lcode}`);
        const data = res.data.map(stu=>stu && {...stu, num:stu.grade, checked:false});
        setList(data);
        setEnroll(data);
    }

    useEffect(()=>{
        callAPI();
    },[])

    const onchangeGrade = (e, scode) => {
        let grade = e.target.value.replace(/[^0-9]/g,'');
        if(grade > 100) {
            grade=100;
        }
        const data = list.map(stu=>stu.scode===scode ? {...stu, grade}:stu);
        setList(data);
    }

    const onClickUpdate = (stu) => {
        if(stu.num===stu.grade) return;
        setBox({
            show : true,
            message : '점수를 수정하실래요?',
            action : async()=> {
                await axios.post('/enroll/update', {lcode, scode:stu.scode, grade:stu.grade});
                callAPI();
            }
        })
    }

    const onChangeAll = (e) => {
        const data = list.map(stu=>stu && {...stu, checked : e.target.checked});
        setList(data);
    }

    const onChangeSingle = (e, scode) => {
        const data = list.map(stu=>stu.scode===scode ? {...stu, checked:e.target.checked}:stu);
        setList(data);
    }

    const onCheckedUpdate = () => {
        if(checked === 0) {
            setBox({
                show : true,
                message : '수정할 학생을 선택하세요.'
            });
            return;
        }
        setBox({
            show:true,
            message : '변경된 성적을 저장하실래요?',
            action : () => {
                let cnt = 0;
                list.forEach(async stu => {
                    if(stu.checked && stu.grade !== stu.num) {
                        await axios.post('/enroll/update', {lcode, scode:stu.scode, grade:stu.grade});
                        cnt++;
                    }
                    if(cnt===checked) callAPI();
                })
            }
        })
    }

    return (
        <div>
            <h1 className='text-center my-3'>수강 신청 학생 목록</h1>
            <Button onClick={onCheckedUpdate} 
                className='mb-2' variant='outline-primary'>선택 항목 저장</Button>
            <Table className='text-center'>
                <colgroup>
                    <col style={{ width: '3%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                </colgroup>
                <thead className='table-dark'>
                    <tr>
                        <td><input type="checkbox" checked={list.length===checked} onChange={onChangeAll}/></td>
                        <td>학생 번호</td>
                        <td>학생 이름</td>
                        <td>학과</td>
                        <td>학년</td>
                        <td>생년월일</td>
                        <td>점수</td>
                        
                    </tr>
                </thead>
                <tbody>
                    {list.map(stu=>
                        <tr key={stu.scode}>
                            <td><input onChange={(e)=>onChangeSingle(e, stu.scode)}
                                type="checkbox" checked={stu.checked}/></td>
                            <td>{stu.scode}</td>
                            <td>{stu.sname}</td>
                            <td>{stu.dept} (지도교수 : {stu.pname})</td>
                            <td>{stu.year}학년</td>
                            <td>{stu.birthday}</td>
                            <td>
                                <input onChange={(e)=>onchangeGrade(e, stu.scode)} 
                                    value={stu.grade} size={3} className='text-end pe-1 me-1' />
                                <Button onClick={()=>onClickUpdate(stu)}
                                    variant='success' className='me-2' size='sm'>수정</Button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default EnrollList