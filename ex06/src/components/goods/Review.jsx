import React, { useEffect, useState } from 'react'
import {Row, Col, Form, Button} from 'react-bootstrap'
import { Rating, listClasses } from '@mui/material'
import axios from 'axios';

const Review = ({gid}) => {
    const uid = sessionStorage.getItem('uid');
    const [rating, setRating] = useState(0);
    const [contents, setContents] = useState('');
    const [list, setList] = useState([]);

    const callAPI = async() => {
        const res = await axios.get(`/review/list/${gid}`);
        //console.log(res.data);
        const data = res.data.map(review=>review && {...review, isEdit : false, text:review.contents, num : review.rating});
        setList(data);
    }

    useEffect(()=> {
        callAPI();
    },[])

    const onInsert = async() => {
        if(contents==='') {
            alert('리뷰 내용을 입력하세요!');
            return;
        }
        //리뷰등록
        await axios.post('/review/insert', {gid, uid, rating, contents});
        alert('댓글등록!');
        setRating(0);
        setContents('');
        callAPI();
    }

    const onDelete = async(rid) => {
        if(!window.confirm(`${rid}번 댓글을 삭제하실래요?`)) return;
        await axios.post(`/review/delete/${rid}`);
        callAPI();
    }

    const onUpdate = (rid) => {
        const data = list.map(r=>r.rid===rid ? {...r, isEdit : true} : r);
        setList(data);
    }

    const onChangeContents = (e, rid) => {
        const data = list.map(r=>r.rid === rid ? {...r, contents : e.target.value} : r);
        setList(data);
    }

    const onChangeRating = (value, rid) => {
        alert(value)
        const data = list.map(r=>r.rid === rid ? {...r, rating : value} : r);
        setList(data);
    }

    const onSave = async(review) => {
        if(!window.confirm(`${review.rid}번 리뷰를 수정하실래요?`)) return;
        alert(review.rating)
        await axios.post('/review/update', {
            rid : review.rid,
            contents : review.contents,
            rating : review.rating
        });
        callAPI();
    }

    const onCancel = (rid) => {
        const data = list.map(r=>r.rid===rid ? {...r, isEdit : false, contents : r.text, rating : r.num} : r);
        setList(data);
    }

    return (
        <div className='mt-5'>
            <div>
                {sessionStorage.getItem('uid') ?
                    <div>
                        <Rating
                            name='hover-feedback'
                            value={rating}
                            precision={0.5}
                            size='large'
                            onChange={(e, newValue)=>setRating(newValue)}/>
                        <Form.Control value={contents}
                            onChange={(e)=>setContents(e.target.value)}
                            as='textarea' rows={5} placeholder='내용을 입력하세요!'/>
                        <div className='text-end'>
                            <Button onClick={onInsert} 
                                className='mt-2 px-3' variant='warning'>등록</Button>
                        </div>
                        </div>
                        :
                        <div>
                            <Button>리뷰작성</Button>
                        </div>
                    }   
                </div>
            <div className='my-3'>
                <hr />
                {list.map(review=>
                    <Row key={review.rid}>
                        <Col className='text-muted' style={{fontSize:'12px'}}>
                        <Rating
                                name='hover-feedback'
                                value={review.rating}
                                precision={0.5}
                                size='small' 
                                readOnly = {!review.isEdit}
                                onChange={(e, newValue)=>onChangeRating(newValue, review.rid)}/>
                            {review.uid} {review.regDate}
                        </Col>

                        {uid === review.uid && review.isEdit &&
                            <Col className='text-end'>
                                    <>
                                        <Button onClick={()=>onSave(review)}
                                            size='sm' variant='info' className='me-2 mb-2'>저장</Button>
                                        <Button onClick={()=>onCancel(review.rid)}
                                            size='sm' variant='secondary' className='mb-2'>취소</Button>
                                    </>
                            </Col>
                        }
                        {uid === review.uid && !review.isEdit &&
                            <Col className='text-end'>
                                    <>
                                        <Button onClick={()=>onUpdate(review.rid)}
                                            size='sm' variant='success' className='me-2'>수정</Button>
                                        <Button onClick={()=>onDelete(review.rid)} 
                                            size='sm' variant='danger'>삭제</Button>
                                    </>
        
                            </Col>
                        }
                        {review.isEdit ?
                            <Form.Control onChange={(e)=>onChangeContents(e, review.rid)}
                                as = 'textarea' value={review.contents} rows={5}/>   
                            :
                            <div className='my-3' style={{whiteSpace:'pre-wrap'}}>{review.contents}</div>
                        }
                        <hr />
                    </Row>
                )}
            </div>
        </div>
    )
}

export default Review