import React from 'react'
import Recently from './Recently'

const HomePage = () => {
    return (
        <div>
            <h1 className='text-center my-3'>홈페이지</h1>
            <h3 className='my-3'>최근상품</h3>
            <Recently/>
        </div>
    )
}

export default HomePage