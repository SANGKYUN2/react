import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Table, Button, Row, Col} from 'react-bootstrap';
import '../../common/Paging.css'
import Pagination from 'react-js-pagination';
import { Link } from 'react-router-dom';
import { BoxContext } from '../../contexts/BoxContext';

const ListPage = () => {
    const {setBox} = useContext(BoxContext);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [count, setCount] = useState(0);
    const [list, setList] = useState([]);

    const callAPI = async() => {
        const res = await axios.get(`/cou?page=${page}&size=${size}`);
        console.log(res.data);
        setList(res.data.list);
        setCount(res.data.total);
        const last=Math.ceil(res.data.total/size);
        if(page>last) setPage(page-1);
    }

    useEffect(()=> {
        callAPI();
    },[page]);

    const onDelete = (cou) => {
        if(cou.persons > 0 ) {
            setBox({
                show:true,
                message : `${cou.persons}명이 수강신청한 강좌입니다.`,
            });
            return;
        }

        setBox({
            show:true,
            message : `${cou.lname} 강좌를 삭제하실래요?`,
            action : async() => {
                await axios.post(`/cou/delete/${cou.lcode}`);
                callAPI();
            }
        })
    }

    return (
        <div>
            <h1 className='text-center mb-3'>강좌목록</h1>
            <Row>
                <Col>
                검색수 : {count} 명
                </Col>
                <Col className='text-end'>
                    <Link to='/cou/insert'>강좌등록</Link>
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
                <thead className='table-info'>
                    <tr>
                        <td>코드</td>
                        <td>교과목명</td>
                        <td>강의시간</td>
                        <td>강의실</td>
                        <td>인원제한</td>
                        <td>지도교수</td>
                        <td>삭제</td>
                    </tr>
                </thead>
                <tbody>
                    {list.map(cou=>
                        <tr key={cou.lcode}>
                            <td>{cou.lcode}</td>
                            <td><Link to={`/cou/read/${cou.lcode}`}>{cou.lname}</Link></td>
                            <td>{cou.hours}시간</td>
                            <td>{cou.room && `${cou.room}호`}</td>
                            <td>{cou.persons} / {cou.capacity}명 </td>
                            <td>{cou.pname && `${cou.pname} (${cou.instructor })`} </td>
                            <td><Button onClick={()=>onDelete(cou)}
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