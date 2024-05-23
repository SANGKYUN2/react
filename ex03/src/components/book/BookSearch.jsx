import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {Row, Col, Card, InputGroup, Form, Button} from 'react-bootstrap'
import ModalBook from './ModalBook';
import { IoCartOutline } from "react-icons/io5"
import { app } from '../../firebaseInit'
import { getDatabase, ref, set, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

const BookSearch = () => {
    const navi = useNavigate();
    const uid = sessionStorage.getItem("uid");
    const db = getDatabase(app);

    const [count, setCount] = useState(0);
    const [isEnd, setIsEnd] = useState(false);

    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('자바');
    const [books, setBooks] = useState([]);
    const callAPI = async() => {
        const url=`https://dapi.kakao.com/v3/search/book?target=title&query=${query}&size=12&page=${page}`;
        const config={
            headers : {"Authorization" : "KakaoAK 9a5fa7c035339e405f49a5347ceb488f"}
        };
        const res = await axios(url, config);
        console.log(res);
        setBooks(res.data.documents);
        setCount(res.data.meta.pageable_count);
        setIsEnd(res.data.meta.is_end);
    }
    
    useEffect(()=>{
        callAPI();
    }, [page]);

    const onSubmit = (e) => {
        e.preventDefault();
        if(query==="") {
            alert("검색어를 입력하세요!");
        }
        else {
            setPage(1);
            callAPI();
        }
    }

        const onClickCart = async(book) => {
        //장바구니에 있는지 유무 체크
        await get(ref(db, `cart/${uid}/${book.isbn}`))
        .then(async(snapshot)=> {
            if(snapshot.exists()) {
                alert("장바구니에 이미 존재합니다.")
            }
            else {
                //장바구니에 등록
                if(uid) {
                    if(window.confirm("장바구니에 저장하실래요?")) {
                        await set(ref(db, `cart/${uid}/${book.isbn}`),
                            {...book, email:sessionStorage.getItem("email")});
                        if (window.confirm("장바구니로 이동하실래요?")) {
                            navi('/book/cart');
                        }
                    }
                }
                else {
                    sessionStorage.setItem("target", "/book/search");
                    navi('/user/login');
                }
            }
        });
    
    }

    return (
        <div className='my-5 bookSearch'>
            <h1 className='text-center my-5'>도서검색</h1>
            <Row className='mb-2'>
                <Col xs={5} md={4} lg={3}>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control 
                                    value={query} onChange={(e)=>setQuery(e.target.value)} placeholder='검색어'/>
                                <Button type='submit' variant='warning'>검색</Button>
                        </InputGroup>
                    </form>
                </Col>
                <Col>
                    <div>검색수 : {count}권</div>
                </Col>
            </Row>
            <Row>
                {books.map((book, index)=>
                    <Col xs={6} md={4} lg={2} className='mb-3' key={index}>
                        <Card>
                            <Card.Body>
                                <ModalBook book={book}/>
                            </Card.Body>
                            <Card.Footer>
                                <Row>
                                    <Col xs={8}>
                                        <div className='ellipsis title'>{book.title}</div>
                                    </Col>
                                    <Col className='text-end'>
                                        <IoCartOutline className="cart"
                                            onClick={()=> onClickCart(book)}/>
                                    </Col>
                                </Row>
                            </Card.Footer>
                        </Card>
                    </Col>
                )}
            </Row>
            {count > 12 &&
                <div className='text-center my-3'>
                    <Button onClick={()=>setPage(page-1)} disabled={page===1} variant='warning'>이전</Button>
                    <span className='mx-3'>{page}</span>
                    <Button onClick={()=>setPage(page+1)} disabled={isEnd} variant='success'>다음</Button>
                </div>
            }
        </div>
    )
}

export default BookSearch