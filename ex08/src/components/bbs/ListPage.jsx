import React, { useEffect, useState } from 'react'
import '../Paging.css'
import axios from 'axios'
import {Table, Row, Col, Button} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import  Pagination from 'react-js-pagination'

const ListPage = () => {
    const [bbs_List, setBBS_List] = useState([]);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [size, setSize] = useState(5);
    const [bbs_Total, setBbs_Total] = useState(0);

    const callList = async() => {
        const res = await axios.get(`/bbs/?page=${page}&size=${size}`)
        setBBS_List(res.data.bbs_List);
        setBbs_Total(res.data.bbs_Total)
    }

    useEffect(()=>{
        callList();
    },[page, size])

    const onClickInsert = () => {
        window.location="/bbs/insert"
    }

    return (
        <div className='my-5'>
            <h1 className='text-center my-5'>게시판</h1>
            <Row>
                <Col>
                    검색수 : <span>{bbs_Total}</span>
                </Col>
                <Col className='text-end mb-3'>
                    <Button onClick={onClickInsert}>글쓰기</Button>
                </Col>
            </Row>
            <Table>
                <thead>
                    <tr>
                        <td>번호</td>
                        <td>제목</td>
                        <td>내용</td>
                        <td>작성자</td>
                        <td>날짜</td>
                    </tr>
                </thead>
                <tbody>
                    {bbs_List.map(bbs =>
                        <tr key={bbs.bbs_key}>
                            <td>{bbs.bbs_key}</td>
                            <td><Link to={`/bbs/${bbs.bbs_key}`}>{bbs.bbs_title}</Link></td>
                            <td>{bbs.bbs_contents}</td>
                            <td>{bbs.bbs_writer}</td>
                            <td>{bbs.bbs_regDate}</td>
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
                    prevPageText={"‹"}
                    nextPageText={"›"}
                    onChange={ (e)=>setPage(e) }/>
                }
        </div>
    )
}

export default ListPage