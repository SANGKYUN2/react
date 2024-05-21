import React, { useState } from 'react'
import { Table } from 'react-bootstrap';

const Students = () => {
    const [students, setStudents] = useState([
        {no:100, name:'김길동', address:'서울 양천구 목동', phone:'010-1537-0998'},
        {no:101, name:'권청이', address:'서울 강서구 화곡동', phone:'010-0355-0998'},
        {no:102, name:'김감찬', address:'강원도 원주시 무실동', phone:'010-9689-0998'},
    ]);

    return (
        <div className='m-5'>
            <h1>학생목록</h1>
            <Table striped bordered hover variant="success">
                <thead>
                    <tr>
                        <td>학생번호</td>
                        <td>학생이름</td>
                        <td>학생주소</td>
                        <td>학생전화</td>
                    </tr>
                </thead>
                <tbody>
                    {students.map(s=>
                        <tr>
                            <td>{s.no}</td>
                            <td>{s.name}</td>
                            <td>{s.address}</td>
                            <td>{s.phone}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default Students