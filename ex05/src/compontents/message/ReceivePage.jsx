import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ReceivePage = () => {
    const [checked, setChecked] = useState(0);
    const [list, setList] = useState([]);
    const navigate = useNavigate();
    const uid=sessionStorage.getItem('uid');

    const callAPI = async () => {
        const res = await axios.get(`/message/receive.json/${uid}`);
        const data = res.data.map(msg => msg && {...msg, checked : false});
        console.log(data);
        setList(data);
    }

    useEffect(()=> {
        callAPI();
    },[])

    const onClickRow = (mid) => {
        navigate(`/message/receive/${mid}`)
    }

    const onChangeAll = (e) => {
        const data = list.map(msg=>msg && {...msg, checked:e.target.checked});;
        setList(data);
    }

    const onChangeSingle = (e, mid) => {
        const data = list.map(msg=>msg.mid===mid ? {...msg, checked:e.target.checked} : msg);
        setList(data);
    }

    useEffect(()=>{
        let cnt = 0;
        list.forEach(msg=>msg.checked && cnt++);
        setChecked(cnt);
    }, [list]);

    const onDelete = () => {
        if(checked===0) {
            alert("삭제할 메시지를 선택하세요!");
            return;
        }
        let cnt = 0;
        list.forEach(async(msg)=> {
            if(msg.checked) {
                await axios.post(`/message/receive/delete/${msg.mid}`);
                cnt++;
            }
            if(cnt===checked) callAPI();
        });
    }

    return (
        <div>
            <h1 className='text-center'>받은 메시지</h1>
            <div className='mb-2'>
                <Button onClick={onDelete} variant='danger'>선택 삭제</Button>
            </div>
            <Table variant='warning' striped bordered hover className='align-middle text-center'>
                <colgroup>
                    <col style={{ width: '5%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '20%' }} />
                </colgroup>
                <thead>
                    <tr>
                        <td><input checked={list.length > 0 && checked===list.length}
                            type="checkbox" onChange={onChangeAll}/></td>
                        <td>보낸이</td>
                        <td>내용</td>
                        <td>발신일</td>
                        <td>수신일</td>
                    </tr>
                </thead>
                <tbody>
                {list.map(msg=>
                    <tr key={msg.mid}>
                        <td><input onChange={(e)=>onChangeSingle(e, msg.mid)} 
                            type="checkbox" checked={msg.checked}/></td>
                        <td>{msg.mid} {msg.uname} ({msg.sender})</td>
                        <td onClick={()=>onClickRow(msg.mid)}>
                        <div className='ellipsis' style={{ fontWeight: msg.readDate ? 'normal' : 'bold', cursor: 'pointer', whiteSpace:'pre-wrap'}} onClick={() => onClickRow(msg.mid)}>
                            {msg.message}
                        </div>
                           
                        </td>
                        <td>{msg.sendDate}</td>
                        <td>{msg.readDate || '읽지 않음'}</td>
                    </tr>
                )}
                </tbody>
            </Table>
        </div>
    )
}

export default ReceivePage