import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './HomePage'
import ListPage from './bbs/ListPage'
import LoginPage from './users/LoginPage'
import InsertPage from './bbs/InsertPage'
import ReadPage from './bbs/ReadPage'
import UpdatePage from './bbs/UpdatePage'

const RouterPage = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/bbs" element={<ListPage/>}/>
            <Route path='/bbs/insert' element={<InsertPage/>}/>
            <Route path='/bbs/:bbs_key' element={<ReadPage/>}/>
            <Route path='/bbs/update/:bbs_key' element={<UpdatePage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
        </Routes>
    )
}

export default RouterPage