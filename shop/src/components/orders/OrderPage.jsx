import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Table, Alert, Card, Form, Button, InputGroup } from 'react-bootstrap'
import ModalAddress from '../users/ModalAddress';
import { v4 } from 'uuid';

const OrderPage = ({ books, setBooks }) => {
    const uuid = v4();
    const pid = uuid.substring(0, 13);
    const [total, setTotal] = useState(0);
    const [form, setForm] = useState({
        uid: '',
        uname: '',
        phone: '',
        address1: '',
        address2: '',
    });


    const { uid, uname, phone, address1, address2 } = form;
    const callAPI = async () => {
        const res = await axios.get(`/users/read/${sessionStorage.getItem('uid')}`);
        setForm(res.data);
    }

    useEffect(() => {
        callAPI();
    }, []);

    useEffect(() => {
        const data = books.filter(book => book.checked);
        let totalSum = 0;
        data.forEach(book => {
            if (book.checked) totalSum += book.price * book.qnt;
        })
        setTotal(totalSum);
        setBooks(data);
    }, []);

    const onChangeForm = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const onClickOrder = async () => {
        if (!window.confirm(`${books.length}개 도서를 주문하실래요?`)) return;
        //주문자 정보
        const res = await axios.post('/orders/purchase', {
            ...form, sum: total, pid, uid
        })
        if (res.data.result === 1) {
            let cnt = 0;
            books.forEach(async book => {
                //주문상품입력
                await axios.post('/orders/insert', { pid, bid: book.bid, price: book.price, qnt: book.qnt })
                await axios.post('/cart/delete', { uid, bid: book.bid });
                cnt++;
                if (cnt === books.length) {
                    alert("주문이 완료되었습니다.");
                    window.location.href = "/";
                }
            })
        }
    }

    return (
        <div>
            <h1 className='text-center'>주문하기</h1>
            <Table variant='success' striped bordered hover className='align-middle text-center'>
                <colgroup>
                    <col style={{ width: '3%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '5%' }} />
                    <col style={{ width: '5%' }} />
                    <col style={{ width: '10%' }} />

                </colgroup>
                <thead>
                    <tr>
                        <td>ID.</td>
                        <td>제목</td>
                        <td>가격</td>
                        <td>수량</td>
                        <td>금액</td>
                    </tr>
                </thead>
                <tbody>
                    {books.map(book =>
                        <tr key={book.bid}>
                            <td>{book.bid}</td>
                            <td>
                                <img src={book.image} width="30px" />
                                <span className='mx-2'>{book.title}</span>
                            </td>
                            <td>{book.fmtprice}원</td>
                            <td>{book.qnt}개</td>
                            <td>{book.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Alert variant='warning' className='text-end'>주문 합계 : {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</Alert>
            <Card>
                <Card.Header>
                    <h3 className='text-center'>주문자 정보</h3>
                </Card.Header>
                <Card.Body>
                    <div>주문 아이디 : {pid} </div>
                    <InputGroup className='mb-2 title'>
                        <InputGroup.Text>주문자이름</InputGroup.Text>
                        <Form.Control name='uname' value={uname} onChange={onChangeForm} />
                    </InputGroup>
                    <InputGroup className='mb-2'>
                        <InputGroup.Text>주문자전화</InputGroup.Text>
                        <Form.Control name='phone' value={phone} onChange={onChangeForm} />
                    </InputGroup>
                    <InputGroup className='mb-1'>
                        <InputGroup.Text>주문자주소</InputGroup.Text>
                        <Form.Control name='address1' value={address1} onChange={onChangeForm} />
                        <ModalAddress form={form} setForm={setForm} />
                    </InputGroup>
                    <Form.Control placeholder='상세주소' name='address2' value={address2} onChange={onChangeForm} />
                    <div className='text-center mt-3'>
                        <Button onClick={onClickOrder}
                            className='px-3' variant='success'>주문하기</Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default OrderPage