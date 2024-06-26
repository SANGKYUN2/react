import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {Table, Button} from 'react-bootstrap'

const DeletePage = () => {
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(0);
    const uid=sessionStorage.getItem('uid');
    const [list, setList] = useState([]);
    const callAPI = async () => {
        const res = await axios.get(`/message/delete/list/${uid}`);
        console.log(res.data);
        const data = res.data.map(msg=>msg && {...msg, checked : false, type : uid===msg.sender ? 'send' : 'receive'});
        setList(data);
    }

    const onChangeAll = (e) => {
        const data = list.map(msg=>msg && {...msg, checked:e.target.checked});
        setList(data);
    }

    const onChangeSingle = (e, mid) => {
        const data = list.map(msg => msg.mid===mid ? {...msg, checked : e.target.checked} : msg);
        setList(data);
    }

    useEffect(()=> {
        callAPI();
    },[]);

    useEffect(()=> {
        let cnt = 0;
        list.forEach(msg=>msg.checked && cnt++);
        setChecked(cnt);
    },[list])

    const onReset = () => {
        if(checked===0) {
            alert("복원할 메시지를 선택하세요!");
            return;
        }
        let cnt = 0;
        setLoading(true);
        list.forEach(async msg=> {
            if(msg.checked) {
                await axios.post(`/message/reset/delete/${msg.mid}?type=${msg.type}`);
                cnt++;
            }
            if(cnt===checked) callAPI();
            setTimeout(()=>{
                setLoading(false);
            }, 1000);
            
        })
    }

    if(loading) return <h1 className='text-center my-5'>로딩중.................</h1>
    return (
        <div>
            <h1 className='text-center'>휴지통</h1>
            <Table variant='warning' striped bordered hover className='align-middle text-center'>
                <colgroup>
                    <col style={{ width: '2%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '20%' }} />
                </colgroup>
                <thead>
                    <tr>
                        <td><input onChange={onChangeAll} checked={list.length>0 && checked===list.length}
                        type="checkbox" className='mx-3'/></td>
                        <td><Button  
                    className='mx-2' size='sm' variant='danger'>완전 삭제</Button>
                <Button onClick={onReset} 
                    className='px-4' size='sm' variant='success'>복원</Button></td>
                    <td>내용</td>
                    <td>발신일</td>
                    </tr>
                </thead>
                <tbody>
                    {list.map(msg=>
                        <tr key={msg.mid}>
                            <td><input onChange={(e)=>onChangeSingle(e, msg.mid)} 
                                type="checkbox" checked={msg.checked}/></td>
                            <td>{msg.mid} {msg.sendDelete===1 ? `보낸 메시지 : ${msg.receiver}` : `받은 메시지 : ${msg.sender}`}</td>
                            <td>{msg.message.substring(0, 30)}</td>
                            <td>{msg.sendDate}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default DeletePage