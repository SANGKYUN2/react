import React, { useState } from 'react'
import { Row, Col, Button } from 'react-bootstrap'

const Message = () => {
    const [message, setMessage] = useState ('');
    const [textColor, setTextColor] = useState('black');

    //RAFCE
    return (
        <>
            <Row className='my-5'>
                <Col>
                    <h1 style={{color:textColor}}>{message}</h1>
                    <Button variant="warning" onClick={()=>setMessage('안녕하세요!')} className='m-3'>입장</Button>
                    <Button variant="info" onClick={()=>setMessage('안녕히가세요!')} className='m-3'>퇴장</Button>
                    <br />
                    <Button onClick={(()=>setTextColor('red'))} variant="danger" className='m-3'>빨강</Button>
                    <Button onClick={(()=>setTextColor('blue'))} variant="primary" className='m-3'>파랑</Button>
                    <Button onClick={(()=>setTextColor('green'))} variant="success" className='m-3'>초록</Button>
                </Col>
            </Row>
        </>
    )
}

export default Message
