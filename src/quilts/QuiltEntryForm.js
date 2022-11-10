import React, {useState, useEffect} from 'react';
import { useQuery } from "react-query";
import {  Container, Button, Form, FormGroup, Col, Row } from 'reactstrap';

import PersonForm from './PersonForm.js';
import QuiltForm from './QuiltForm.js';
import QuiltSummaryList from './QuiltSummaryList.js';


function QuiltEntryForm() {
    const [quiltEntry, setQuiltEntry] = useState({
        "person": {
            "firstName": "David",
            "lastName": "Edwards",
            "email": "de@email.org"
        },
        "quilt": {
            "name": "Myquilt",
            "pattern": "free patterns 'r' us",
            "description": "It's pretty good, I think",
            "category": "Hand Applique",
            "judged": true,
            "width": "24",
            "length": "130"
        }
    });
    //    const quiltResponse = useQuery("quilt", fetchQuilt);

    const fetchQuilt = async() => {
        const res = await fetch(`/quilt/${this.quilt.id}`);
        return res.json();
    }

    const updatePerson = (person) => {
        var newQuiltEntry = {...quiltEntry, person: person};
        setQuiltEntry(newQuiltEntry);
        console.log("Updated person");
        console.log(newQuiltEntry);
    }

    const updateQuilt = (quilt) => {
        var newQuiltEntry = {...quiltEntry, quilt: quilt};
        setQuiltEntry(newQuiltEntry);
        console.log("Updated quilt");
        console.log(newQuiltEntry);
    }

    const addEntry = async() => {
        const response = await fetch("/quilts", {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer', 
            body: JSON.stringify(quiltEntry.quilt)
        });

        return response.json();
    }

    const cancel = () => {
        var resetQuiltEntry = {...quiltEntry, quilt: {}};
        setQuiltEntry(resetQuiltEntry);
        console.log("Resetting form");
        console.log(resetQuiltEntry);
    }

    return (
        <div>
            <Container fluid>
                <Row>
                <Col md={5}>
                <Form>
                    <FormGroup>
                        <h3>Quilter</h3>
                        <PersonForm person={quiltEntry.person} handler={updatePerson} />
                    </FormGroup>
                    <br/>
                    <FormGroup>
                        <h3>Quilt Information</h3>
                        <QuiltForm quilt={quiltEntry.quilt} handler={updateQuilt} />
                    </FormGroup>
                    <Row>
                        <Col md={2}/>
                        <Col md={3}><Button block color="primary" onClick={addEntry}>Enter Quilt</Button></Col>
                        <Col md={1}/>
                        <Col md={3}><Button block color="secondary" onClick={cancel}>Cancel</Button></Col>
                    </Row>
                </Form>
                </Col>
                <Col md={2}>
                    <QuiltSummaryList/>
                </Col>
                </Row>
            </Container>
        </div>
    );
}

export default QuiltEntryForm;