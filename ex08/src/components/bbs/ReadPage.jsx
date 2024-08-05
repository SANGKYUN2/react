import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import UpdatePage from './UpdatePage'

const ReadPage = () => {
    const [bbs, setBBS] = useState('');
    const {bbs_key} = useParams()

    const callRead = async() => {
        const res = await axios.get(`/bbs/${bbs_key}`)
        console.log(res.data);
        setBBS(res.data);
    }

    useEffect(()=>{
        callRead();
    },[])

    const onClickUpdate = () => {
        window.location=`/bbs/update/${bbs_key}`
    }

    const onClickDelete = async() => {
        if(!window.confirm(`${bbs_key}번 게시글을 삭제하시겠습니까?`)) return;
        const res = await axios.delete(`/bbs/${bbs_key}`)
        if(res.data === 'success') {
            alert(`${bbs_key}번 게시글이 삭제되었습니다.`)
            window.location="/bbs/"
        }
        else {
            alert('게시글 삭제를 실패했습니다.')
        }
    }

    return (
        <div>
            <h1 className='text-center mt-3'>게시글 정보</h1>
            <div>
                <h5>게시글 번호 : {bbs_key}</h5>
                <hr />
                <div>게시글 제목 : {bbs.bbs_title}</div>
                <div>게시글 내용 : {bbs.bbs_contents}</div>
                <div>게시글 작성자 : {bbs.bbs_writer}</div>
                <div>게시글 날짜 : {bbs.bbs_regDate}</div>
            </div>
            <hr />
            <div className='text-end'>
                <Button onClick={onClickUpdate} className='me-2'>수정</Button>
                <Button onClick={onClickDelete}>삭제</Button>
            </div>
        </div>
    )
}

export default ReadPage