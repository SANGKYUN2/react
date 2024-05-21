import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Row, Col, Card, InputGroup, Form, Button, Spinner } from 'react-bootstrap'
import ModalBook from './ModalBook';

const BookSearch = () => {
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [last, setLast] = useState(false);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('소설');
    const [books, setBooks] = useState([]);
    const callAPI = async () => {
        setLoading(true);
        const url = `https://dapi.kakao.com/v3/search/book?target=title&query=${query}&size=12&page=${page}`;
        const config = {
            headers: { "Authorization": "KakaoAK 9a5fa7c035339e405f49a5347ceb488f" }
        }
        const res = await axios.get(url, config);
        console.log(res.data);
        setBooks(res.data.documents);
        setLast(res.data.meta.is_end);
        setTotal(res.data.meta.pageable_count);

        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }

    useEffect(() => {
        callAPI();
    }, [page]);

    const onSubmit = (e) => {
        e.preventDefault();
        if (query === "") {
            alert("검색어를 입력하세요!");
        }
        else {
            setPage(1);
            callAPI();
        }
    }

    if (loading) {
        return (
            <>
                <div className='text-center mt-5'>
                    <Button variant="success" disabled>
                        <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                        Loading...
                    </Button>
                </div>
            </>
        );
    }
    return (
        <div className='my-5 text-center bookSearch'>
            <h1>도서검색</h1>
            <Row className='mb-2'>
                <Col xs={4} md={3} lg={2}>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control onChange={(e) => setQuery(e.target.value)}
                                value={query} placeholder='검색어' />
                            <Button type="submit" variant='success'>검색</Button>
                        </InputGroup>
                    </form>
                </Col>
                <Col>
                    <div className='mt-2 text-end'>검색수 : {total}권</div>
                </Col>
            </Row>
            <Row>
                {books.map(book =>
                    <Col xs={4} md={3} lg={2} className='mb-3'>
                        <Card>
                            <Card.Body>
                                <ModalBook book={book} />
                            </Card.Body>
                            <Card.Footer>
                                <div className='ellipsis title'>{book.title}</div>
                            </Card.Footer>
                        </Card>
                    </Col>
                )}
            </Row>
            {total > 12 &&
                <div className='text-center'>
                    <Button onClick={() => setPage(page - 1)} disabled={page === 1} variant='warning'>이전</Button>
                    <span className='mx-3'>{page}</span>
                    <Button onClick={() => setPage(page + 1)} disabled={last} variant='success'>다음</Button>
                </div>
            }
        </div>
    )
}

export default BookSearch