import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { InputGroup, Form } from 'react-bootstrap';
import axios from 'axios';

const PassModal = () => {
    const [form, setForm] = useState({
        upass : 'pass',
        npass : '1234',
        cpass : '1234'
    });
    const {upass, npass, cpass} = form;
    const onChangeForm = (e) => {
        setForm({...form, [e.target.name] : e.target.value})
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onClickSave = async() => {
        //현재비밀번호 일치체크
        const res = await axios.get(`/users/${sessionStorage.getItem('uid')}`);
        if(res.data.upass!==upass) {
            alert ("현재 비밀번호가 일치하지 않습니다!");
            return;
        }
        //새비밀번호 비밀번호 확인하고 같은지 체크
        if(npass !== cpass) {
            alert('새비밀번호가 일치하지 않습니다!');
            return;
        }

        if(npass === upass) {
            alert('새비밀번호가 현재비밀번호와 일치합니다!');
            return;
        }

        //새비밀번호로 업데이트
        if(!window.confirm('비밀번호를 변경하실래요?')) return;
        await axios.post('/users/update/pass', 
            {uid:sessionStorage.getItem('uid'), upass:npass});
        alert("비밀번호변경완료!");
        sessionStorage.clear();
        window.location.href='/users/login';
    }

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                비밀번호변경
            </Button>

            <Modal
                show={show} style={{top:'30%'}}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>비밀번호변경</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className= 'mb-2'>
                        <InputGroup.Text className='title justify-content-center'>현재비빌번호</InputGroup.Text>
                        <Form.Control name='upass' value={upass} type='password' onChange={onChangeForm}/>
                    </InputGroup>
                    <InputGroup className= 'mb-2'>
                        <InputGroup.Text className='title justify-content-center'>새비빌번호</InputGroup.Text>
                        <Form.Control name='npass' value={npass} type='password' onChange={onChangeForm}/>
                    </InputGroup>
                    <InputGroup className= 'mb-2'>
                        <InputGroup.Text className='title justify-content-center'>비빌번호확인</InputGroup.Text>
                        <Form.Control name='cpass' value={cpass} type='password' onChange={onChangeForm}/>
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        취소
                    </Button>
                    <Button onClick={onClickSave} 
                        variant="primary">저장</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default PassModal