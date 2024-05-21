import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Counter from './components/Counter';
import Message from './components/Message';
import Students from './components/Students';
import Posts from './components/Posts';
import Todos from './components/Todos';
import { Row, Col, Container } from 'react-bootstrap';
import BookSearch from './components2/BookSearch';
import ModalBook from './components2/ModalBook';

const App = () => {
  return (
    <Container>
      {/* <Row>
        <Col><Counter/></Col>
        <Col><Message/></Col>
        <Col><Students/></Col>
      </Row>
      <Row>
        <Col><Posts/></Col>
        <Col><Todos/></Col>
      </Row> */}
      <BookSearch/>

    </Container>
  );
}

export default App;
