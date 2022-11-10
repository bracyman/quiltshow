import React, {useState} from 'react';
import {  
    Input, 
    Container,
    Label,
    Row, Col,
    FormGroup  } from 'reactstrap';


function PersonForm(props) {

    const person = props.person || {};

    const handleFirstName = (evt) => {
        var newPerson = {...person, firstName: evt.target.value};
        update(newPerson);
    }

    const handleLastName = (evt) => {
        var newPerson = {...person, lastName: evt.target.value};
        update(newPerson);
    }

    const handleEmail = (evt) => {
        var newPerson = {...person, email: evt.target.value};
        update(newPerson);
    }

    const handlePassword = (evt) => {
        var newPerson = {...person, password: evt.target.value};
        update(newPerson);
    }

    const update = (newPerson) => {
        if(props.handler) {
            props.handler(newPerson);
        }
    }

    return (
        <div>
            <Row>
                <Col md={2}><Label for="personFirstName">First Name</Label></Col>
                <Col md={4}><Input id="personFirstName" name="personFirstName" placeholder="First name" type="text" value={person?.firstName} onChange={handleFirstName}/></Col>
                <Col md={2}><Label for="personLastName">Last Name</Label></Col>
                <Col md={4}><Input id="personLastName" name="personLastName" placeholder="Last name" type="text" value={person?.lastName} onChange={handleLastName}/></Col>
            </Row>
            <Row>
                <Col md={2}><Label for="personEmail">Email</Label></Col>
                <Col md={4}><Input id="personEmail" name="personEmail" placeholder="Email address" type="email" value={person?.email} onChange={handleEmail}/></Col>
            </Row>
            <Row>
                <Col md={2}><Label for="password">Password</Label></Col>
                <Col md={4}><Input id="password" name="password" type="password" value={person?.password || ""} onChange={handlePassword}/></Col>
            </Row>
        </div>
    );
}

export default PersonForm;