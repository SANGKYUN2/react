import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Map, MapMarker } from 'react-kakao-maps-sdk' 

const ModalMap = ({local}) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const {place_name, address_name, x, y, phone} = local;

    return (
        <>
            <Button variant="warning" onClick={handleShow} size="sm">
                지도보기
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false} size="lg" style={{top:'30%'}}>
                <Modal.Header closeButton>
                    <Modal.Title>{place_name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Map center={{lat:y, lng:x}} style={{width : '100%', height : '300px'}}>
                        <MapMarker position={{lat:y, lng:x}}>
                        <div style={{fontSize:'12px'}} >전화 : {phone || '없음'} </div>
                        </MapMarker>
                        
                    </Map>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleClose}>
                        닫기
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalMap