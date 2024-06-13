import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import MenuPage from './compontents/MenuPage';

function App() {
    return (

        <Container className='py-5'>
            <MenuPage/>
        </Container>

    );
}

export default App;
