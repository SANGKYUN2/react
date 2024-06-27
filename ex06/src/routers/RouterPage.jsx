import React from 'react'
import { Route, Routes } from 'react-router-dom'
import GoodsRouter from './GoodsRouter'
import HomePage from '../common/HomePage'
import UserRouter from './UserRouter'
import LoginPage from '../components/users/LoginPage'

const RouterPage = () => {
    return (
        <Routes>
            <Route path='/user/login' element={<LoginPage/>}/>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/goods/*' element={<GoodsRouter/>}/>
            <Route path='/users/*' element={<UserRouter/>}/>
        </Routes>
    )
}

export default RouterPage