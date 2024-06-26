import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import RouterPage from './RouterPage';
import { useLocation, useNavigate } from 'react-router-dom';

const MenuPage = () => {
    const location = useLocation();
    const path = location.pathname;
    const navi = useNavigate();

    const onLogout = (e) => {
        e.preventDefault();
        if (window.confirm('정말로 로그아웃 하실래요?')) {
            sessionStorage.clear();
            navi("/");
        }
    }
    
    return (
        <>
          <Navbar expand="lg" bg="success" variant='dark'>
            <Container fluid>
              <Navbar.Brand href="#">스타벅스</Navbar.Brand>
              <Navbar.Toggle aria-controls="navbarScroll" />
              <Navbar.Collapse id="navbarScroll">
                <Nav
                  className="me-auto my-2 my-lg-0"
                  navbarScroll>
                  <Nav.Link href="/book/search"  className={path==='/book/search' && 'active'}>도서검색</Nav.Link>
                  <Nav.Link href="/local/search" className={path==='/local/search' && 'active'}>지역검색</Nav.Link>
                  {sessionStorage.getItem('email') &&
                    <Nav.Link href="/book/cart"  className={path==='/book/cart' && 'active'}>장바구니</Nav.Link>
                  }
                  {sessionStorage.getItem('email') &&
                    <Nav.Link href="/local/favorite" className={path==='/local/favorite' && 'active'}>즐겨찾기</Nav.Link>
                  }
                  <Nav.Link href="/post/list"  className={path.startsWith('/post') && 'active'}>게시판</Nav.Link>
                  {sessionStorage.getItem('email') &&
                    <Nav.Link href="/chat" className={path==='/chat' && 'active'}>채팅</Nav.Link>
                  }
                </Nav>
                {sessionStorage.getItem('email') ?
                  <>
                    <Nav>
                      <Nav.Link href="/user/mypage" className={path==='/user/mypage' && 'active'}>{sessionStorage.getItem("email")}</Nav.Link>
                    </Nav>
                    <Nav>
                      <Nav.Link href="#" onClick={onLogout}>LOGOUT </Nav.Link>
                    </Nav>
                  </>
                  :
                  <Nav>
                    <Nav.Link href="/user/login" className={path==='/user/login' && 'active'}>LOGIN</Nav.Link>
                  </Nav>
                }
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <RouterPage/>
        </>
      );
    }

export default MenuPage