import axios from 'axios';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Table } from 'react-bootstrap'

const ModalRelated = ({gid, callRelated}) => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => {
        callRelated();
        setShow(false);
    }
    const handleShow = () => setShow(true);

    const callAPI = async() => {
        setLoading(true);
        const res = await axios.get(`/goods/list?page=1&size=10`);
        console.log(res.data.list);
        setList(res.data.list);
        setLoading(false);
    }

    useEffect(()=>{
        callAPI();
    },[])

    const onClickInsert = async(rid) => {
        const res = await axios.post('/goods/related/insert', {gid, rid});
        if(res.data===0) {
            alert("관련 상품 등록!");
        }
        else {
            alert("이미 등록된 상품!")
        }
    }

    if(!loading)
    return (
        <>
        <Button variant="info" onClick={handleShow}>관련 상품 등록</Button>

        <Modal style={{top : '10%'}}
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            size='lg'>

        <Modal.Header closeButton>
            <Modal.Title>관련 상품 등록</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
            <Table>
                <thead className='table-dark'>
                    <tr>
                        <td className='text-center'>상품 코드</td>
                        <td>상품 이름</td>
                        <td className='text-center'>상품 가격</td>
                        <td className='text-center'>상품 등록</td>
                    </tr>
                </thead>
                <tbody>
                    {list.map(goods=>
                        <tr key={goods.gid}>
                            <td className='text-center'>{goods.gid}</td>
                            <td>{goods.title}</td>
                            <td className='text-center'>{goods.fmtprice}원</td>
                            <td className='text-center'>
                                <Button onClick={()=>onClickInsert(goods.gid)}
                                    size='sm' variant='warning' disabled={goods.gid===gid}>상품 등록</Button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>닫기</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalRelated