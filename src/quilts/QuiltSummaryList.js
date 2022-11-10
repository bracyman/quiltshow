import React, {useState, useEffect} from 'react';
import { useQuery } from "react-query";
import {  Container, Row } from 'reactstrap';


function QuiltSummaryList() {

    return (
        <Container>
            <Row><span style={{"fontWeight": "bold", "paddingLeft": "0"}}>Entered Quilts (4)</span></Row>
            <Row>My First Quilt</Row>
            <Row>My Second Quilt</Row>
            <Row>Quilt with a Long N...</Row>
            <Row>Matisse #2</Row>
        </Container>
    );
}

export default QuiltSummaryList;