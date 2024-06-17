import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Form, InputGroup, Button } from 'react-bootstrap'
import Pagination from 'react-js-pagination';
import './Paging.css'
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { TfiCommentAlt } from "react-icons/tfi";

const HomePage = () => {
    const uid = sessionStorage.getItem('uid');
    const [count, setCount] = useState(0)
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(6);
    const [key, setKey] = useState('title');
    const [word, setWord] = useState('');
    const callAPI = async () => {
        const res = await axios.get(`/books/list?page=${page}&size=${size}&key=${key}&word=${word}&uid=${uid}`);
        console.log(res.data);
        setBooks(res.data.documents);
        setCount(res.data.count);
    }

    useEffect(() => {
        callAPI();
    }, [page]);

    const onSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        callAPI();
    }
    const onClickLike = async (bid) => {
        if (uid) {
            //좋아요 저장
            const res = await axios.post('/books/likes/insert', { uid, bid });
            callAPI();
        } else {
            window.location.href = '/users/login';
        }
    }

    const onClickCancel = async (bid) => {
        //좋아요 취소
        const res = await axios.post('/books/likes/delete', { uid, bid });
        if(res.data.result===1) {
            callAPI();
        }
    }

    return (
        <div className='mt-5'>
            <Row className='mb-3 justify-content-end'>
                <Col xs={8} md={5} lg={4} className='text-end'>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Select className='me-2' value={key}
                                onChange={(e) => setKey(e.target.value)}>
                                <option value="title">제목</option>
                                <option value="author">저자</option>
                                <option value="publisher">출판사</option>
                            </Form.Select>
                            <Form.Control onChange={(e) => setWord(e.target.value)}
                                placeholder='검색어' value={word} />
                            <Button type='submit' variant='warning'>검색</Button>
                        </InputGroup>
                    </form>
                </Col>
            </Row>
            <Row>
                {books.map(book =>
                    <Col key={book.bid} xs={6} md={4} lg={2} className='mb-3'>
                        <Card>
                            <Card.Body>
                                <a href={`/books/read/${book.bid}`}>
                                    <img src={book.image} width="100%" />
                                </a>
                            </Card.Body>
                            <Card.Footer>
                                <Row>
                                    <Col>
                                        <div className='ellipsis' style={{ fontSize: '15px' }}>
                                            {book.title}
                                        </div>
                                        <div>{book.fmtprice}원</div>
                                    </Col>
                                    <Col className='text-end'>
                                        <>
                                            <TfiCommentAlt style={{fontSize : '20px'}}/>
                                            <span style={{fontSize : '12px'}} className='me-2'>{book.rcnt}</span>
                                        </>
                                        {book.ucnt === 0 ?
                                            <AiOutlineHeart className='heart'
                                                onClick={()=>onClickLike(book.bid)} />
                                            :
                                            <AiFillHeart className='heart' 
                                                onClick={()=>onClickCancel(book.bid)}/>
                                        }
                                        <span style={{fontSize:'10px'}} className='user-text'>{book.lcnt}</span>
                                    </Col>

                                </Row>
                            </Card.Footer>
                        </Card>
                    </Col>
                )}
            </Row>
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

export default HomePage