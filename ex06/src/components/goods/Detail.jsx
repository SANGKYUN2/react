import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Button, Col, InputGroup, Row, Form, Badge, Table } from 'react-bootstrap'
import axios from 'axios';
import { useEffect, useState } from 'react';
import ModalRelated from './ModalRelated';

const Detail = ({form, setForm, gid, callAPI, good, fmtprice}) => {
    const style = {
        border : '1px solid gray',
        width : '100%'
    }
    const [files, setFiles] = useState([]);
    const [attaches, setAttaches] = useState([]);
    const [related, setRelated] = useState([]);

    const callAttach = async() => {
        const res = await axios.get(`/goods/attach/${form.gid}`);
        //console.log(res.data);
        setAttaches(res.data);
    }

    const callRelated = async() => {
        const res1 = await axios.get(`/goods/related/list/${form.gid}`);
        const data = res1.data.map(goods=>goods && {...goods, gid:goods.rid});
        //console.log(res1.data);
        setRelated(data);
    }

    useEffect(()=> {
        callAttach();
        callRelated();
    },[])
    
    const onClickSave = async() => {
        if(good.contents === form.contents) return;
        if(!window.confirm('상세정보를 저장하실래요?')) return;
        await axios.post('/goods/update/contents', 
            {gid:form.gid, contents:form.contents});
        alert("상세정보저장!");
        callAPI();
    }

    const onChangeFiles = (e) => {
        let selFiles=[]
        for(let i = 0; i < e.target.files.length; i++) {
            const file = {
                name:URL.createObjectURL(e.target.files[i]),
                byte:e.target.files[i]
            }
            selFiles.push(file);
        }
        setFiles(selFiles);
    }

    const onClickAttach = async() => {
        if(files.length === 0) return;
        if(!window.confirm(`${files.length}개 파일을 업로드 하실래요?`)) return;
        //첨부 파일 업로드
        const formData = new FormData();
        for(let i=0; i<files.length; i++) {
            formData.append('bytes', files[i].byte);
        }
        await axios.post(`/goods/attach/${form.gid}`, formData);
        alert("첨부파일 업로드!");
        callAttach();
        setFiles([]);
    }

    const onClickDelete = async(att) => {
        if(!window.confirm(`${att.aid}번 이미지를 삭제하실래요?`)) return;
        //첨부파일삭제
        await axios.post('/goods/attach/delete', att);
        alert("첨부파일삭제!");
        callAttach();
    }

    const onClickRelatedDelete = async(rid) => {
        if(!window.confirm(`${form.gid}-${rid} 삭제하실래요?`)) return;
        //관련상품삭제
        await axios.post('/goods/related/delete', {gid : form.gid, rid});
        alert("삭제완료!");
        callRelated();
    }

    return (
        <Tabs
          defaultActiveKey="home"
          id="uncontrolled-tab-example"
          className="mb-3">
          <Tab eventKey="home" title="상세정보">
            <div className='text-end mb-2'>
                <Button onClick={onClickSave}>상세 정보 저장</Button>
            </div>
                <CKEditor
                    editor={ClassicEditor}
                    data={form.contents}
                    onChange={(e, editor)=> setForm({...form, contents:editor.getData()})}/>
                    
          </Tab>
            <Tab eventKey="profile" title="파일첨부하기">
                <InputGroup>
                    <Form.Control onChange={onChangeFiles} 
                        type='file' multiple={true}/>
                    <Button onClick={onClickAttach}>첨부 파일 저장</Button>
                </InputGroup>
                <Row className='my-3'>
                    {files.map(file=>
                        <Col key={file.name} mx={3}>
                            <img src={file.name} width="100%" />
                        </Col>
                    )}
                </Row>
            </Tab>
            <Tab eventKey="attach" title="첨부한파일">
                <Row>
                    {attaches.map(att=>
                        <Col key={att.aid} xs={2} className='mb-3'>
                            <div style={{position:'relative'}}>
                                <Badge onClick={()=>onClickDelete(att)}
                                    bg='danger' style={{position:'absolute', top:'10px', right:'10px',  cursor:'pointer'}}>X</Badge>
                                <img src={att.filename} width="100%" style={style}/>   
                            </div>
                        </Col>
                    )}
                </Row>
            </Tab>
            <Tab eventKey="related" title="관련상품">
                <ModalRelated gid={form.gid} callRelated={callRelated}/>
                <Table className='mt-3'>
                    <thead className='table-dark'>
                        <tr>
                            <td className='text-center'>상품 코드</td>
                            <td>상품 이름</td>
                            <td className='text-center'>상품 가격</td>
                            <td className='text-center'>삭제</td>
                        </tr>
                    </thead>
                    <tbody>
                        {related.map(goods=>
                            <tr key={goods.rid}>
                                <td className='text-center'>{goods.rid}</td>
                                <td>{goods.title}</td>
                                <td className='text-center'>{goods.fmtprice}원</td>
                                <td className='text-center'><Button onClick={()=>onClickRelatedDelete(goods.rid)}
                                    size='sm' variant='danger'>삭제</Button></td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Tab>
        </Tabs>
    );
}

export default Detail