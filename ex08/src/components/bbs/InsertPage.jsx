import axios from 'axios';
import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const InsertPage = () => {
    const [bbsForm, setBBSForm] = useState({
        bbs_writer : 'Ronaldo',
        bbs_title : '',
        bbs_contents : ''
    })

    const {bbs_writer, bbs_title, bbs_contents} = bbsForm;

    const onChangeForm = (e) => {
        setBBSForm ({...bbsForm, [e.target.name] : e.target.value});
    }

    const onClickSubmit = async(e) => {
        e.preventDefault();
        if(bbs_title==='') {
            alert('제목을 입력하세요');
            return
        }
        const result = await axios.post(`/bbs/`, bbsForm)
        if(result.data === 'success') {
            window.location='/bbs/'
        }
        else{
            alert('실패')
        }

    }

    return (
        <div>
            <h1 className='text-center mt-3'>글쓰기</h1>
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
                    <Button onClick={onClickSubmit} className='me-2' type='submit'>등록</Button>
                    <Button type='cancel'>취소</Button>
                </div>
            </form>
        </div>
    )
}

export default InsertPage