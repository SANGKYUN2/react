import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Row, Col, Button } from 'react-bootstrap'
import { app } from '../../firebaseInit'
import { getFirestore, doc, getDoc, deleteDoc } from 'firebase/firestore'
import ListPage from '../comment/ListPage'

const ReadPage = () => {
  const navi = useNavigate();
  const [post, setPost] = useState('');
  const db = getFirestore(app);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { email, body, title, date } = post;//비구조할당

  const callAPI = async () => {
    setLoading(true);
    const res = await getDoc(doc(db, 'posts', id));
    console.log(res.data());
    setPost(res.data());
    setLoading(false);
  }
  useEffect(() => {
    callAPI();
  }, [])

  const onClickDelete = async () => {
    if (!window.confirm(`${id}번 게시글을 삭제하실래요`)) return;
    //게시글삭제
    setLoading(true);
    await deleteDoc(doc(db, `posts/${id}`));
    setLoading(false);
    navi('/post/list');
  }

  if (loading) return <h1 className='text-center my-5'>로딩중...</h1>
  return (
    <>
      <Row className='justify-content-center my-5' >
        <h1 className='text-center mb-5'>게시글정보</h1>
        <Col xs={10} md={8} lg={7}>

          {email === sessionStorage.getItem("email") &&
            <div className='my-2 text-end'>
              <Button onClick={() => navi(`/post/update/${id}`)}
                className='me-2' variant='outline-primary'>수정</Button>
              <Button variant='outline-danger' onClick={onClickDelete}>삭제</Button>
            </div>
          }

          <Card>
            <Card.Body>
              <h5>{title}</h5>
              <hr />
              <div style={{ whiteSpace: "pre-wrap" }}>{body}</div>
            </Card.Body>
            <Card.Footer className='text-muted text-end'>
              <b>Posted</b> {date} <b>by</b> {email}
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      {/****************댓글목록***************/}
      <ListPage id={id}/>
    </>
  )
}

export default ReadPage