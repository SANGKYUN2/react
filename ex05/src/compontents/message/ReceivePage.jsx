import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap';

const ReceivePage = () => {
    const [checked, setChecked] = useState(0);
    const [list, setList] = useState([]);
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

    return (
        <div>
            <h1 className='text-center'>받은 메시지</h1>
            <Table variant='warning' striped bordered hover className='align-middle text-center'>
                <colgroup>
                <col style={{ width: '5%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '30%' }} />
                    <col style={{ width: '30%' }} />
                </colgroup>
                <thead>
                    <tr>
                        <td><input checked={checked===list.length}
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
                        <td>{msg.uname} ({msg.sender})</td>
                        <td width="50%">
                            <span className={msg.readDate || 'bold'}>
                                <a href={`/message/receive/${msg.mid}`}>{msg.message.substring(0, 30)}</a></span>
                           
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