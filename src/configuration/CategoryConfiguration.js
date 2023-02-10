import { useState } from "react";
import BasicTable from "../components/BasicTable";
import { CategoryFields } from "../utilities/ObjectUtils";
import {Nav,  Navbar, NavDropdown } from 'react-bootstrap';



const CategoryConfiguration = (props) => {
 

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
        <BasicTable name="Category" id="test-table"
            elements={categories} columns={CategoryFields} hideColumns={hideColumns}
            className="testing-table" rowClass="category-row"
            addHandler={createCategory} editHandler={editCategory} deleteHandler={deleteCategory} validator={validateCategory}/>;
    );
};

export default CategoryConfiguration;