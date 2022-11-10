import React, {useState} from 'react';
import {  
    Input,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem, 
    Container,
    Label,
    Row,Col } from 'reactstrap';


function QuiltForm(props) {
    const quilt = props.quilt || {};
    
    const handleQuilt = (evt) => {
        let newQuilt;
        switch(evt.target.id) {
            case "quiltName":
                newQuilt = {...quilt, name: evt.target.value};
                break;
            case "quiltPattern":
                newQuilt = {...quilt, pattern: evt.target.value};
                break;
                case "quiltDescription":
                newQuilt = {...quilt, description: evt.target.value};
                break;
            case "quiltCategory":
                newQuilt = {...quilt, category: evt.target.value};
                break;
            case "quiltJudgedYes":
                console.log(evt);
                newQuilt = {...quilt, judged: true};
                break;
            case "quiltJudgedNo":
                console.log(evt);
                newQuilt = {...quilt, judged: false};
                break;
            case "quiltWidth":
                newQuilt = {...quilt, width: evt.target.value};
                break;
            case "quiltLength":
                newQuilt = {...quilt, length: evt.target.value};
                break;
            case "quiltedBy":
                newQuilt = {...quilt, quiltedBy: evt.target.value};
                break;
            
        }

        if(props.handler) {
            props.handler(newQuilt);
        }
    }

    return (
        <div>
            <Row className="mb-3">
                <Col md={2}><Label for="quiltName">Quilt name</Label></Col>
                <Col md={10}><Input id="quiltName" name="quiltName" placeholder="Name" type="text" value={quilt?.name || ""} onChange={handleQuilt}/></Col>
            </Row>
            <Row className="mb-3">
                <Col md={2}><Label for="quiltPattern">Pattern Name</Label></Col>
                <Col md={10}><Input id="quiltPattern" name="quiltPattern" placeholder="Pattern name" type="text" value={quilt?.pattern || ""} onChange={handleQuilt}/></Col>
            </Row>
            <Row className="mb-3">
                <Col md={2}><Label for="quiltDescription">Description</Label></Col>
                <Col md={10}><Input id="quiltDescription" name="quiltDescription" placeholder="Quilt description..." type="textarea" value={quilt?.description || ""} onChange={handleQuilt}/></Col>
            </Row>
            <Row className="mb-3">
                <Col md={2}><Label for="quiltCategory">Category</Label></Col>
                <Col md={4}><Input id="quiltCategory" name="quiltCategory" type="select" value={quilt?.category} onChange={handleQuilt}>
                        <option value=""></option>
                        <option>Large Hand Quilted</option>
                        <option>Large Machine Quilted</option>
                        <option>Hand Applique</option>
                        <option>Machine Applique</option>
                    </Input>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col md={6}><Label for="quiltJudged">Would you like this quilt to be judged?</Label></Col>
                <Col md={2}><Input id="quiltJudgedYes" name="quiltJudged" type="radio" value={true} checked={quilt?.judged===true} onChange={handleQuilt}/><Label check>Yes</Label></Col>
                <Col md={2}><Input id="quiltJudgedNo" name="quiltJudged" type="radio" value={false} checked={quilt?.judged===false} onChange={handleQuilt}/><Label check>No</Label></Col>
            </Row>
            <Row className="mb-3">
                <Col md={2}><Label for="quiltWidth">Width</Label></Col>
                <Col md={4}><Input id="quiltWidth" name="quiltWidth" placeholder="0" type="number" value={quilt?.width || ""} onChange={handleQuilt}/></Col>
                <Col md={1}/>
                <Col md={1}><Label for="quiltLength">Length</Label></Col>
                <Col md={4}><Input id="quiltLength" name="quiltLength" placeholder="0" type="number" value={quilt?.length || ""} onChange={handleQuilt}/></Col>
            </Row>
            <Row className="mb-3">
                <Col md={2}><Label for="quiltedBy">Quilted By</Label></Col>
                <Col md={10}><Input id="quiltedBy" name="quiltedBy" type="text" value={quilt?.quiltedBy} onChange={handleQuilt || ""}/></Col>
            </Row>
        </div>
    );
}

export default QuiltForm;