import React, { useEffect, useState } from 'react'
import { app } from '../../firebaseInit'
import { getDatabase, ref, onValue, remove } from 'firebase/database'
import { Table, Button } from 'react-bootstrap'
import ModalMap from './ModalMap'

const FavoritePage = () => {
  const [loading, setLoading] = useState(false);
  const [locals, setLocals] = useState([]);
  const db = getDatabase(app);
  const uid = sessionStorage.getItem('uid');

  const callAPi = () => {
    setLoading(true);
    onValue(ref(db, `favorite/${uid}`), res=> {
      let rows = [];
      let count = 0;
      res.forEach(row=>{
        count++;
        rows.push({no:count, key:row.key, ...row.val()});
      });
      console.log(rows);
      setLocals(rows);
      setLoading(false);
    });
  }

  useEffect(()=> {
    callAPi();
  }, []);

  const onClickDelete = (local) => {
    if(window.confirm(`"${local.place_name}" 삭제하실래요?`)) {
      remove(ref(db, `favorite/${uid}/${local.key}`))
    }
  }

  if(loading) {
    return 
  }
  <h1 className='text-center my-5'>로딩중..........</h1>

  return (
    <div className='my-5'>
    <h1 className='text-center'>즐겨찾기</h1>
    <Table striped bordered hover variant="success" className='text-center'>
      <colgroup>
        <col style={{ width: '5%' }} />
          <col style={{ width: '20%' }} />
          <col style={{ width: '20%' }} />
          <col style={{ width: '20%' }} />
          <col style={{ width: '5%' }} />
          <col style={{ width: '5%' }} />
      </colgroup>
      <thead>
        <tr>
          <td>No.</td>
          <td>장소명</td>
          <td>전화</td>
          <td>주소</td>
          <td>지도보기</td>
          <td>삭제</td>
        </tr>
      </thead>
      <tbody>
        {locals.map(local =>
          <tr key={local.key}>
            <td>{local.no}</td>
            <td>{local.place_name}</td>
            <td>{local.phone}</td>
            <td>{local.address_name}</td>
            <td><ModalMap local={local}/></td>
            <td>
              <Button onClick={()=>onClickDelete(local)} size='sm' variant='danger'>삭제</Button>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  </div>
  )
}

export default FavoritePage