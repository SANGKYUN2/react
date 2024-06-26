import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Table } from 'react-bootstrap';
import EnrollList from './EnrollList';

const ReadPage = () => {
    const [course, setCourse] = useState('');
    const {lcode} = useParams();
    const {lname, room, instructor, pname, persons, capacity, hours, dept} = course;
    const callAPI = async()=> {
        const res = await axios.get(`/cou/${lcode}`);
        console.log(res.data);
        setCourse(res.data);
    }

    useEffect(()=> {
        callAPI();
    },[]);

    return (
        <div>
            <h1 className='text-center mb-3'>강좌정보</h1>
            <div className='my-2'>
                <Link to={`/cou/update/${lcode}`}>정보수정</Link>
            </div>
            <Table bordered>
                <colgroup>
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                </colgroup>
                <tbody>
                    <tr className='text-center'>
                        <td className='text-center table-warning'>코드</td>
                        <td>{lcode}</td>
                        <td className='text-center table-warning'>교과목명</td>
                        <td colSpan={3}>{lname}</td>
                        <td className='text-center table-warning'>개설 학과</td>
                        <td>{dept}</td>
                    </tr>
                    <tr className='text-center'>
                        <td className='text-center table-warning'>강의실</td>
                        <td>{room ? `${room}호` : '-'}</td>
                        <td className='text-center table-warning'>강의 시간</td>
                        <td>{hours}시간</td>
                        <td className='text-center table-warning'>인원제한</td>
                        <td>{persons} / {capacity} 명</td>
                        <td className='text-center table-warning'>지도교수</td>
                        <td>{pname ? `${pname} (${instructor })`:'-'}</td>
                    </tr>
                </tbody>
            </Table>
            <EnrollList lcode={lcode} />
        </div>
    )
}

export default ReadPage