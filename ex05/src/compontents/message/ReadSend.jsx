import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLoaderData, useParams } from 'react-router-dom'

const ReadSend = () => {
    const [msg, SetMsg] = useState('');
    const {mid} = useParams();
    const callAPI = async() => {
        const url = `/message/send/${mid}`;
        const res = await axios.get(url);
        console.log(res.data);
        SetMsg(res.data);
    }

    useEffect (()=> {
        callAPI();
    },[])
  return (
    <div>
        <div>받은이 : {msg.uname} ({msg.receiver})</div>
        <div>발신일 : {msg.sendDate}</div>
        <div>수신일 : {msg.readDate || '읽지않음'}</div>
        <hr/>
        <div style={{whiteSpace : "pre-wrap"}}>{msg.message}</div>

    </div>
  )
}

export default ReadSend