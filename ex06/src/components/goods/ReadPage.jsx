import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {Card, InputGroup, Button, Row, Col, Form} from 'react-bootstrap'
import GoodsInfo from './GoodsInfo';
import Recently from '../../common/Recently';

const ReadPage = () => {
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(false);
    const [goods, setGoods] = useState('');
    const param = useParams();
    const {gid} = param; //비구조할당
    const {title, image, brand, maker, price, regDate, fmtprice} = goods;  //비구조할당
   
    const callAPI = async() => {
        setLoading(true);
        const res = await axios.get(`/goods/read/${gid}`);
        //console.log(res.data);
        const data={...res.data, 
            fmtprice:res.data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        setGoods(data);
        setLoading(false);
    }

    const callRelated = async() => {
        const res1 = await axios.get(`/goods/related/list/${gid}`);
        //console.log(res1.data);
        setRelated(res1.data);
    }

    useEffect(()=>{
        callAPI();
        callRelated();
    },[])

    if(loading) return <h1 className='text-center my-5'>로딩중..............</h1>

    return (
        <div className='my-3' style={{height : '1500px'}}>
            <Card>
                <Card.Body>
                    <Row>
                        <Col className='text-center'>
                            <img src={image} width='450px'/>
                        </Col>
                        <Col style={{fontSize:'1.5rem'}} className='py-5'>
                            <div>[{gid}] {title}</div>
                            <hr />
                            <InputGroup className='mb-2'>
                                <InputGroup.Text>상품가격</InputGroup.Text>
                                <Form.Control name='fmtprice' value={fmtprice} readOnly/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text>제조사명</InputGroup.Text>
                                <Form.Control name='maker' value={maker} readOnly/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text>브랜드명</InputGroup.Text>
                                <Form.Control name='brand' value={brand} readOnly/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text>등록날짜</InputGroup.Text>
                                <Form.Control name='regDate' value={regDate} readOnly/>
                            </InputGroup>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            {related.length >=5 &&
                <div className='mt-5'>
                    <h3>관련 상품</h3>
                    <Recently goods={related}/>
                </div>
            }
            <GoodsInfo goods={goods}/>
        </div>
    )
}

export default ReadPage