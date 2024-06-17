import React from 'react'
import { Route, Routes } from 'react-router-dom'
import InsertPage from '../message/InsertPage'
import SendPage from '../message/SendPage'
import ReceivePage from '../message/ReceivePage'
import ReadSend from '../message/ReadSend'
import ReadReceive from '../message/ReadReceive'

const MessageRouter = () => {
    return (
        <Routes>
            <Route path='insert' element={<InsertPage/>}></Route>
            <Route path='send' element={<SendPage/>}></Route>
            <Route path='receive' element={<ReceivePage/>}></Route>
            <Route path='send/:mid' element={<ReadSend/>}></Route>
            <Route path='receive/:mid' element={<ReadReceive/>}></Route>
        </Routes>
    )
}

export default MessageRouter