import React, {useState} from 'react';
import {  Container, Col, Row} from 'reactstrap';


function Header() {

    return (
        <Row>
        <Col md={2}><img src="/img/logo.jpg" width="125px"/></Col>
        <Col><h1 align="left">Quilt Show 2022</h1></Col>
        </Row>
    );
}

export default Header;