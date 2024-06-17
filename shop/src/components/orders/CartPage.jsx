import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Table, Button, Row, Col, Alert } from 'react-bootstrap'
import { CountContext } from '../CountContext';
import OrderPage from './OrderPage';

const CartPage = () => {
    const [isOrder, setIsOrder] = useState(false);
    const [chk, setChk] = useState(0);
    const { setCount } = useContext(CountContext);
    const [books, setBooks] = useState([]);
    const [total, setTotal] = useState(0);
    const uid = sessionStorage.getItem('uid');

    useEffect(() => {
        let checkCount = 0;
        books.forEach(book => book.checked && checkCount++);
        console.log('....................', checkCount);
        setChk(checkCount);
    }, [books]);

    const callAPI = async () => {
        const res = await axios.get(`/cart/list?uid=${uid}`);
        const data = res.data.map(book => book && { ...book, sum: book.qnt * book.price, checked: false });
        setBooks(data);
        setCount(data.length);

        let totalSum = 0;
        data.forEach(book => {
            totalSum += book.sum;
        })
        setTotal(totalSum);
    }

    useEffect(() => {
        callAPI();
    }, []);

    const onChangeQnt = (bid, e) => {
        const result = e.target.value.replace(/[^0-9]/g, '');
        const data = books.map(book => book.bid == bid ?
            { ...book, qnt: result } : book);
        setBooks(data);
    }

    const onUpdateQnt = async (bid, qnt) => {
        if (!window.confirm(`${bid}번 도서의 수량을 ${qnt}개로 변경하실래요?`)) return;
        //수량수정
        const res = await axios.post('/cart/update',
            { uid: sessionStorage.getItem('uid'), bid, qnt });
        if (res.data.result === 1) {
            callAPI();
        }
    }

    const onClickDelete = async (bid) => {
        const res = await axios.post('/cart/delete',
            { uid: sessionStorage.getItem('uid'), bid }
        )
        if (res.data.result === 1) {
            callAPI();
        }
    }

    const onChangeAll = (e) => {
        const data = books.map(book => book && { ...book, checked: e.target.checked });
        setBooks(data);
    }

    const onChangeSingle = (e, bid) => {
        const data = books.map(book => book.bid === bid ? { ...book, checked: e.target.checked } : book);
        setBooks(data);

    }

    const onCheckedDelete = () => {
        if (chk === 0) {
            alert("삭제할 도서들을 선택하세요!")
            return;
        }
        if (!window.confirm(`${chk}개 도서들을 삭제하실래요?`)) return;
        //선택 도서 삭제
        let deleted = 0;
        books.forEach(async book => {
            if (book.checked) {
                deleted++;
                const res = await axios.post('/cart/delete', { bid: book.bid, uid });
            }
        });
        if (chk === deleted) callAPI();
    }

    const onOrder = () => {
        if (chk === 0) {
            alert("주문할 상품들을 선택하세요!");
        }
        else {
            //주문페이지로 이동
            setIsOrder(true);
        }
    }

    return (
        <Row className='justify-content-center my-5'>
            <Col xs={12} md={10} lg={8}>
                {!isOrder ?
                    <>
                        <h1 className='text-center mb-3'>장바구니</h1>
                        <div className='mb-2'>
                            <Button onClick={() => onCheckedDelete()} variant="danger">선택 도서 삭제</Button>
                        </div>
                        <Table variant='success' striped bordered hover className='align-middle text-center'>
                            <colgroup>
                                <col style={{ width: '3%' }} />
                                <col style={{ width: '3%' }} />
                                <col style={{ width: '20%' }} />
                                <col style={{ width: '5%' }} />
                                <col style={{ width: '10%' }} />
                                <col style={{ width: '10%' }} />
                                <col style={{ width: '3%' }} />

                            </colgroup>
                            <thead>
                                <tr>
                                    <td><input checked={chk === books.length} onChange={onChangeAll} type="checkbox" /></td>
                                    <td>ID.</td>
                                    <td>도서명</td>
                                    <td>가격</td>
                                    <td>수량</td>
                                    <td>금액</td>
                                    <td>삭제</td>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map(book =>
                                    <tr key={book.bid}>
                                        <td><input onChange={(e) => onChangeSingle(e, book.bid)} type="checkbox" checked={book.checked} /></td>
                                        <td>{book.bid}</td>
                                        <td>
                                            <img src={book.image} width="30px" />
                                            <span className='mx-2'>{book.title}</span>
                                        </td>
                                        <td>{book.fmtprice}원</td>
                                        <td><input onChange={(e) => onChangeQnt(book.bid, e)}
                                            value={book.qnt} size={2} className='text-end me-1' />
                                            <Button onClick={() => onUpdateQnt(book.bid, book.qnt)}
                                                variant='warning' size='sm'>수정</Button></td>
                                        <td>{book.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</td>
                                        <td><Button onClick={() => onClickDelete(book.bid)}
                                            variant='danger' size='sm'>삭제</Button></td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                        <Alert variant='warning' className='text-end'>총 합계 : {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</Alert>
                        <div className='text-center'>
                            <Button onClick={onOrder} className='me-2 px-3' variant='success'>주문하기</Button>
                            <a href="/"><Button className='px-3' variant='warning'>쇼핑 계속 하기</Button></a>
                        </div>
                    </>
                    :
                    <OrderPage books={books} setBooks={setBooks}/>
                }
            </Col>
        </Row>
    )
}

export default CartPage