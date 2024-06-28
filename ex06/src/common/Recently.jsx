import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Slider from "react-slick";
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ color : 'gray', fontSize : '2.5rem' }}
        onClick={onClick}>
        {<BiChevronRight/>}
    </div>
    );
  }
  
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
        className={className}
        style={{ color : 'gray', fontSize : '2.5rem' }}
        onClick={onClick}>
        {<BiChevronLeft/>}
    </div>
    );
  }

const Recently = ({goods}) => {
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay : true,
        autoplaySpeed : 5000,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };

    return (
        <Row>
            <Slider {...settings} className='py-5'>
                {goods.map((good, index)=>
                   <Col key={good.gid}>
                        <Card className='me-2'>
                            <Card.Body>
                                <Link to={`/goods/read/${good.gid}`}>
                                    <img src={good.image} width='100%'/>
                                </Link>
                                <div className='ellipsis mt-3'>[{index+1}] {good.title}</div>
                                <div>{good.fmtprice}원</div>
                            </Card.Body>
                        </Card>
                   </Col> 
                )}
            </Slider>
        </Row>
    )
}

export default Recently