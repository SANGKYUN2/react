import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {Form, Button} from 'react-bootstrap'

const UpdatePage = () => {
    const {bbs_key} = useParams();
    const [bbsForm, setBBSForm] = useState('')
    const callUpdate = async() => {
        const res = await axios.get(`/bbs/${bbs_key}`)
        setBBSForm(res.data)
    }

    useEffect(()=>{
        callUpdate();
    },[])

    const {bbs_writer, bbs_title, bbs_contents} = bbsForm;

    const onChangeForm = (e) => {
        setBBSForm ({...bbsForm, [e.target.name] : e.target.value});
    }

    const onClickSave = async(e) => {
        e.preventDefault();
        if(!window.confirm(`${bbs_key}번 게시글을 수정하시겠습니까?`)) return;
        const res =await axios.put(`/bbs/`, bbsForm);
        if(res.data==='success') {
            alert(`${bbs_key}번 게시글 수정 완료`)
            window.location=`/bbs/${bbs_key}`
        }
        else {
            alert('게시글 수정 실패')
        }
    }

    return (
        <div>
            <h1 className='text-center mt-3'>게시글 수정</h1>
            <form>
                <Form.Control
                    value={bbs_title}
                    name='bbs_title'
                    className='mb-3' 
                    placeholder='제목을 입력하세요.'
                    onChange={onChangeForm}
                />
                <Form.Control
                    value={bbs_contents}
                    name='bbs_contents' 
                    rows={5} as="textarea" 
                    placeholder='내용을 입력하세요.'
                    onChange={onChangeForm}
                />
                <div className='text-end mt-2'>
                    <Button onClick={onClickSave} className='me-2' type='save'>저장</Button>
                    <Button type='cancel'>취소</Button>
                </div>
            </form>
        </div>
    )
}

export default UpdatePage