import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SearchPage from '../components/goods/SearchPage'
import ListPage from '../components/goods/ListPage'
import UpdatePage from '../components/goods/UpdatePage'
import ReadPage from '../components/goods/ReadPage'


const GoodsRouter = () => {

    return (
        <Routes>
            <Route path='search' element={<SearchPage/>}></Route>
            <Route path='list' element={<ListPage/>}></Route>
            <Route path='update/:gid' element={<UpdatePage/>}></Route>
            <Route path='read/:gid' element={<ReadPage/>}></Route>
        </Routes>
    )
}

export default GoodsRouter