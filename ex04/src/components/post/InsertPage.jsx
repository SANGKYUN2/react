import React, { useState } from 'react'
import {Row,Col,Button,Form} from 'react-bootstrap'
import {app}from '../../firebaseInit'
import {getFirestore,addDoc,collection} from 'firebase/firestore'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

import { doc, updateDoc } from "firebase/firestore";

const InsertPage = () => {
  
    const[loading,setLoading] =useState(false);
    const navi= useNavigate();
    const db=getFirestore(app);
    const [form, setForm] = useState({
        title:'',
        body:'',
        
    });
    const {title,body} = form; //비구조할당
    const onChangeForm = (e)=>{
        setForm({...form,[e.target.name]:e.target.value});
    }
    const onSubmit=async(e)=>{
        e.preventDefault();
        if(title===""){
            alert("제목을 입력하세요!");
            return;
        }
        if(!window.confirm("게시글을 등록하실래요?")) return;
        //게시글등록
        const now = new Date();
        const date=moment(now).format('YYYY-MM-DD HH:mm:ss');
        const email = sessionStorage.getItem("email");
        setLoading(true);

        await addDoc(collection(db,'posts'),{...form,date,email});
        setLoading(false);
        navi('/post/list');

    }
  if(loading) return <h1 className='text-center my-5'>로딩중...</h1>
  return (
    <div className='my-5'>
        <h1 className='text-center'>글쓰기</h1>
        <Row className='justify-content-center'>
            <Col xs={10} md={8} lg={7}>
                <form onSubmit={onSubmit}>
                    <Row>
                        <Col xs={5} md={5} lg={4}><Form.Control name='name'  /></Col>
                    </Row>
                    <Form.Control name='title' value={title} onChange={onChangeForm} placeholder='제목을 입력하세요.' className='mb-2'/>
                    <Form.Control name='body' value={body} onChange={onChangeForm}  placeholder='내용을 입력하세요.' as="textarea" rows={10}/>
                    <div className='mt-3 text-center'>
                        <Button type='reset' className='px-5 mx-3' variant='outline-secondary'>취소</Button>
                        <Button type='submit' className='px-5' variant='outline-primary'>등록</Button>
                    </div>    
                </form>
            </Col>
        </Row>
    </div>
  )
}

export default InsertPage