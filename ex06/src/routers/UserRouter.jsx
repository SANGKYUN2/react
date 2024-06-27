import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LoginPage from '../components/users/LoginPage'
import JoinPage from '../components/users/JoinPage'

const UserRouter = () => {
    return (
        <Routes>
            <Route path='login' element={<LoginPage/>}></Route>
            <Route path='join' element={<JoinPage/>}></Route>
        </Routes>
    )
}

export default UserRouter