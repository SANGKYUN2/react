import React, { useContext, useState } from 'react'
import {Row, Col, Card, InputGroup, Form, Button, Table} from 'react-bootstrap';
import { BoxContext } from '../../contexts/BoxContext';
import axios from 'axios';

const GmarketPage = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const {setBox} = useContext(BoxContext);
    const [query, setQuery] = useState('');


    const onSubmit = async(e) => {
        e.preventDefault();
        if(query==='') {
            setBox({
                show : true,
                message : '검색어를 입력하세요!'
            })
            return;
        }
        setLoading(true);
        const res = await axios.get(`/crawl/gmarket?query=${query}`);
        console.log(res.data);
        setList(res.data);
        setLoading(false);
    }

    if(loading) return <h1 className='text-center my-3'>로딩중..................</h1>
    return (
        <div>
            <h1 className='text-center my-3'>지마켓 상품검색</h1>
            <Row>
                <Col xs={6} md={4} lg={3} className='mb-2'>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control placeholder='검색어' value={query} onChange={(e)=>setQuery(e.target.value)}/>
                            <Button type='submit' variant='warning'>검색</Button>
                        </InputGroup>
                    </form>
                </Col>
                <hr />
                <Table>
                    <thead className='table-dark'>
                        <tr>
                            <td className='text-center'>상품 이미지</td>
                            <td className='text-center'>상품 코드</td>
                            <td>상품 이름</td>
                            <td>상품 가격</td>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((pro, index)=>
                            <tr key={index}>
                                <td className='text-center'><img src={pro.image} width="50px" /></td>
                                <td className='text-center'>{pro.code}</td>
                                <td>{index + 1}. {pro.title}</td>
                                <td>{pro.price ? `${pro.price} `:'-'}원</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Row>
        </div>
    )
}

export default GmarketPage