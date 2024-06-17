import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import RouterPage from './RouterPage';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { BsCart } from "react-icons/bs";
import { Badge } from 'react-bootstrap';
import { CountContext } from './CountContext';

const MenuPage = () => {
  const { count } = useContext(CountContext);
  const navi = useNavigate();
  const uid = sessionStorage.getItem("uid");
  const [user, setUser] = useState('');

  const callAPI = async () => {
    const url = `/users/read/${uid}`;
    const res = await axios.get(url);
    setUser(res.data);
  }

  useEffect(() => {
    if (uid) callAPI();
  }, [uid]);

  const onClickLogout = (e) => {
    e.preventDefault();
    if (window.confirm("정말로 로그아웃하실래요?")) {
      sessionStorage.clear();
      navi("/");
    }
  }

  return (
    <>
      <Navbar expand="lg" className="bg-success" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">스타벅스</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              {uid &&
                <Nav.Link href="/orders/list">주문목록</Nav.Link>
              }
              <Nav.Link href="/books/search">도서검색</Nav.Link>
              <Nav.Link href="/books/list">도서목록</Nav.Link>
            </Nav>
            {uid ?
              <>
                <Nav>
                  <Nav.Link className='active' href="/orders/cart">
                    {count === 0 ?
                      <BsCart style={{ fontSize: '25px' }} />
                      :
                      <>
                        <BsCart style={{ fontSize: '25px', position: 'absolute' }} />
                        <Badge bg="danger" style={{ position: 'relative', top: '-10px', left: '-10px' }}>{count}</Badge>
                      </>
                    }
                  </Nav.Link>
                </Nav>
                <Nav>
                  <Nav.Link href="/users/mypage" className='active me-3'>
                    <span className='ms-1'>{user.uname}님 환영합니다.</span>
                  </Nav.Link>
                </Nav>
                <Nav>
                  <Nav.Link href="#" onClick={onClickLogout}>로그아웃</Nav.Link>
                </Nav>
              </>
              :
              <Nav>
                <Nav.Link href="/users/login">로그인</Nav.Link>
              </Nav>
            }
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <RouterPage />
    </>
  );
}

export default MenuPage