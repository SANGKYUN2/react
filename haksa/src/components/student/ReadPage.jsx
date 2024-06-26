import axios from 'axios';
import React, { useEffect, useRef, useState, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Table } from 'react-bootstrap';
import EnrollList from './EnrollList';
import { BoxContext } from '../../contexts/BoxContext';
import {app} from '../../filebaseInit'
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage';

const ReadPage = () => {
    const storage = getStorage(app);
    const {setBox} = useContext(BoxContext);
    const [list, setList] = useState([]);
    const style = {
        width : '50px',
        cursor : 'pointer',
        border : '1px solid gray'
    }
    const [student, setStudent] = useState('');
    const {scode} = useParams();
    const {sname, dept, birthday, pname, advisor, year} = student;
    const [file, setFile] = useState({
        fileBytes : null,
        fileName : ''
    })
    const refFile = useRef(null);
    const {fileBytes, fileName} = file;

    const callAPI = async() => {
        const res = await axios.get(`/stu/${scode}`);
        //console.log(res.data);
        setStudent(res.data);
        setFile({file:null, fileName:res.data.photo});
        callCourses();
    }

    const callCourses = async() => {
        const res1 = await axios.get(`/enroll/scode/${scode}`);
        setList(res1.data);
    }

    useEffect(()=>{
        callAPI();
    },[]);

    const onChangeFile = (e) => {
        setFile({
            fileBytes : e.target.files[0],
            fileName : URL.createObjectURL(e.target.files[0])
        })
    }

    const onUploadPhoto= async()=>{
        if(!fileBytes){
            setBox({
                show:true,
                message:'업로드할 이미지를 선택하세요.'
            });
            return;
        }
        //사진업로드
        const snapshot = await uploadBytes(ref(storage, `/photo/${scode}/${Date.now()}.jpg`), fileBytes);
        const url = await getDownloadURL(snapshot.ref);
        console.log(url);
        alert("이미지저장완료!");
        await axios.post('/stu/update/photo', {scode, photo:url});
        callAPI();
    }

    return (
        <div>
            <h1 className='text-center mb-3'>{scode} 학생정보</h1>
            <div className='text-end my-2'>
                <Link to={`/stu/update/${scode}`}>정보수정</Link>
            </div>
            <Table bordered>
                <colgroup>
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '15%' }} />
                </colgroup>
                <tbody>
                    <tr>
                        <td rowSpan={2} className='text-center align-middle'>
                            <img src={fileName || 'http://via.placeholder.com/50x50'}
                                style={style} onClick={()=>refFile.current.click()} />
                            <input type="file" onChange={onChangeFile} 
                                ref={refFile} style={{display:'none'}}/>
                            <div>
                                <Link to='#' onClick={onUploadPhoto}>이미지저장</Link>
                            </div>
                        </td>
                        <td className='text-center table-info'>학생 번호</td>
                        <td>{scode}</td>
                        <td className='text-center table-info'>학생 이름</td>
                        <td>{sname}</td>
                        <td className='text-center table-info'>학과</td>
                        <td>{dept}</td>
                    </tr>
                    <tr>
                        <td className='text-center table-info'>학년</td>
                        <td>{year}학년</td>
                        <td className='text-center table-info'>생년월일</td>
                        <td>{birthday}</td>
                        <td className='text-center table-info'>지도교수</td>
                        <td>{pname} ({advisor})</td>
                    </tr>
                </tbody>
            </Table>
            <EnrollList list={list} scode={scode} callCourses={callCourses}/>
        </div>
    )
}

export default ReadPage