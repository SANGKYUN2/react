import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Table, Button, Row, Col} from 'react-bootstrap';
import '../../common/Paging.css'
import Pagination from 'react-js-pagination';
import { BoxContext } from '../../contexts/BoxContext';
import { Link } from 'react-router-dom';

const ListPage = () => {
    const {setBox} = useContext(BoxContext);

    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [list, setList] = useState([]);
    const [count, setCount] = useState(0);

    const callAPI = async() => {
        const url =`/stu?page=${page}&size=${size}&key=dept&word=`;
        const res = await axios.get(url);
        console.log(res.data);
        setList(res.data.list);
        setCount(res.data.total);
    }

    useEffect(()=>{
        callAPI();
    },[page]);

    const onClickDelete = (scode) => {
        setBox({
            show : true,
            message : `${scode}번 학생을 삭제하실래요?`,
            action : ()=>onDelete(scode)
        })
    }

    const onDelete = async(scode) => {
        await axios.post(`/stu/delete/${scode}`)
            .then(()=>{
                setPage(1);
                callAPI();
            })
            .catch(err=>{
                alert('에러발생');
                console.log(err)
            })

    }

    return (
        <div className='my-5'>
            <h1 className='text-center mb-3'>학생목록</h1>
            <Row>
                <Col>
                    검색수 : {count} 명
                </Col>
                <Col className='text-end'>
                    <Link to='/stu/insert'>학생등록</Link>
                </Col>
            </Row>
            <hr />
            <Table className='align-middle text-center'>
                <colgroup>
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '3%' }} />
                </colgroup>
                <thead className='table-warning'>
                    <tr>
                        <td>학생 번호</td>
                        <td>학생 이름</td>
                        <td>학과</td>
                        <td>학년</td>
                        <td>생년월일</td>
                        <td>지도교수</td>
                        <td>삭제</td>
                    </tr>
                </thead>
                <tbody>
                    {list.map(stu=>
                        <tr key={stu.scode}>
                            <td><Link to={`/stu/read/${stu.scode}`}>{stu.scode}</Link></td>
                            <td>{stu.sname}</td>
                            <td>{stu.dept}</td>
                            <td>{stu.year}학년</td>
                            <td>{stu.birthday}</td>
                            <td>{stu.pname && `${stu.pname} (${stu.advisor })`} </td>
                            <td><Button onClick={()=>onClickDelete(stu.scode)}
                                size='sm' variant='danger'>삭제</Button></td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {count > size &&
                <Pagination
                    activePage={page}
                    itemsCountPerPage={size}
                    totalItemsCount={count}
                    pageRangeDisplayed={5}
                    prevPageText={"<"}
                    nextPageText={">"}
                    onChange={(e) => setPage(e)} />
            }
        </div>
    )
}

export default ListPage