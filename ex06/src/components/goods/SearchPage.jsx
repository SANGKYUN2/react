import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import {Table, Row, Col, InputGroup, Button, Form} from 'react-bootstrap'
import '../../common/Paging.css'
import Pagination from 'react-js-pagination';
import { BoxContext } from '../../common/BoxContext';

const SearchPage = () => {
    const [checked, setChecked] = useState(0);
    const {setBox} = useContext(BoxContext);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [query, setQuery] = useState('남자 향수');
    const [count, setCount] = useState(0);
    const [goods, setGoods] = useState([]);


    const callAPI = async() => {
        const res = await axios.get(`/goods/search?query=${query}&page=${page}&size=${size}`);
        //console.log(res.data);
        setGoods(res.data.items);
        const data = res.data.items.map(good=>good && {...good, checked : false});
        setGoods(data);
        setCount(res.data.total > 100 && 100);
      }

      useEffect(()=>{
        let cnt=0;
        goods.map(good=>good.checked && cnt++);
        setChecked(cnt);
    },[goods]);

    useEffect(()=>{
        callAPI();
    },[page]);

    const onSubmit = (e) => {
        e.preventDefault();
        if(query === '') {
            setBox({
                show : true,
                message : '검색어를 입력하세요!',
                action2 : ()=>{
                    setGoods([])
                    setCount(0)
                }
            });
        }
        else {
            setPage(1);
            callAPI();
        }
    }

    const onInsert = (good) => {
        setBox({
            show : true,
            message : `${removeTags(good.title)}를 등록하실래요?`,
            action : async() => {
                const res = await axios.post('/goods/insert', {
                    gid : good.productId,
                    title : removeTags(good.title),
                    image : good.image,
                    maker : good.maker,
                    brand : good.brand,
                    price : good.lprice
                });
                if(res.data===1) {
                    setBox({
                        show : true,
                        message : '상품이 등록되었습니다'
                    });
                }
                else {
                    setBox ({
                        show : true,
                        message : '이미 등록된 상품입니다.'
                    });
                }
            }
        })
    }

    const onChangeAll = (e) => {
        const data = goods.map(good=>good && {...good, checked : e.target.checked});
        setGoods(data);
    }

    const onChangeSingle = (e, id) => {
        const data = goods.map(good=>good.productId===id ? {...good, checked : e.target.checked} : good);
        setGoods(data);
    }

    const onCheckedInsert = () => {
        if(checked === 0) {
            setBox ({
                show : true,
                message : '등록할 상품을 선택하세요!'
            })
            return;
        }

        setBox({
            show : true,
            message : `${checked}개 상품을 등록하실래요?`,
            action : () => {
                let cnt = 0;
                let inserted = 0;
                goods.forEach(async good=>{
                    if(good.checked) {
                        const res = await axios.post('/goods/insert', {
                            gid : good.productId,
                            title : removeTags(good.title),
                            image : good.image,
                            maker : good.maker,
                            brand : good.brand,
                            price : good.lprice
                        })
                        if(res.data===1) inserted++;
                        cnt++;
                        if(checked === cnt) {
                            setBox ({
                                show : true,
                                message : `${inserted}개 상품(들)이 등록되었습니다!.`,
                                action2 : () => {
                                    const data = goods.map(good => good && {...good, checked : false});
                                    setGoods(data);
                                }
                            });
                        }
                    }
                });
            }
        });
    }

    const onClickImage = async(image) => {
        if(!window.confirm(`${image} 다운로드 하실래요?`)) return;
        await axios.post(`/download?file=${image}`);
        alert("다운로드 완료!");
    }

    const removeTags = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    }

    return (
        <div>
            <h1 className='text-center my-3'>상품검색</h1>
            <Row>
                <Col>
                    <Button onClick={onCheckedInsert} variant='success'>선택상품등록</Button>
                </Col>
                <Col xs={5} md={4} lg={3}  className='text-end'>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control value={query} onChange={(e)=>setQuery(e.target.value)}/>
                            <Button type='submit' variant='success'>검색</Button>
                        </InputGroup>
                    </form>
                </Col>
            </Row>
            <Table className='mt-3'>
                <colgroup>
                    <col style={{ width: '3%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '30%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />

                </colgroup>
                <thead className='table-dark'>
                    <tr>
                        <td className='text-center'><input checked={goods.length===checked} 
                            type="checkbox" className='mx-2' onChange={onChangeAll}/></td>
                        <td className='text-center'>상품 사진</td>
                        <td>상품 코드</td>
                        <td>상품명</td>
                        <td>상품 가격</td>
                        <td>메이커</td>
                        <td>브랜드</td>
                        <td className='text-center'>상품 등록</td>
                    </tr>
                </thead>
                <tbody>
                    {goods.map(good=>
                        <tr key={good.productId}>
                            <td className='text-center'><input onChange={(e)=>onChangeSingle(e, good.productId)}
                                type="checkbox" checked={good.checked} /></td>
                            <td className='text-center'><img onClick={()=>onClickImage(good.image)}
                            src={good.image} width="70px"/></td>
                            <td>{good.productId}</td>
                            <td><div dangerouslySetInnerHTML={{__html:good.title}}/></td>
                            <td>{good.lprice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</td>
                            <td>{good.maker ? `${good.maker}` : '-'} </td>
                            <td>{good.brand ? `${good.brand}` : '-'}</td>
                            <td className='text-center'>
                                <Button onClick={()=>onInsert(good)} variant='warning' size='sm'>상품 등록</Button>
                            </td>
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

export default SearchPage