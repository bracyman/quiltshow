import { useState } from "react";
import BasicTable from "../components/BasicTable";
import { CategoryFields } from "../utilities/ObjectUtils";
import {Nav,  Navbar, NavDropdown } from 'react-bootstrap';



const Configuration = (props) => {
 

    const hideColumns = ["description"];

    const categories = [
        { id: 1, name: "Category 1", shortDescription: "First", description: "The very first category", importance: 10, fun: false, strange: "lower" },
        { id: 2, name: "Category 2", shortDescription: "Second", description: "The very second category", importance: 1, fun: true, strange: "some text" },
        { id: 3, name: "Category 3", shortDescription: "Third", description: "The lowly fourth category", importance: 5, fun: false, strange: "NO CHANGE HERE" },
    ];

    const createCategory = (category) => {
        alert("Creating category");
    };

    const editCategory = (category) => {
        alert(`Editing category ${category.id}`);
    };

    const deleteCategory = (category) => {
        alert(`Deleting category ${category.id}`);
    };

    const validateCategory = (category) => {
        alert("Valid category");
        return true;
    };

    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link href="#features">Features</Nav.Link>
                        <Nav.Link href="#pricing">Pricing</Nav.Link>
                        <Nav.Link href="#deets">More details</Nav.Link>
                        <Nav.Link eventKey={2} href="#memes">
                            Good stuff
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <BasicTable name="Category" id="test-table"
                elements={categories} columns={CategoryFields} hideColumns={hideColumns}
                className="testing-table" rowClass="category-row"
                addHandler={createCategory} editHandler={editCategory} deleteHandler={deleteCategory} validator={validateCategory}/>;
        </>
    );
};

export default Configuration;