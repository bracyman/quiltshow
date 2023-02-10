import { useState } from "react";
import Prompt from "./Prompt";
import ObjectUtils from "../utilities/ObjectUtils";
import BasicRow from "./BasicRow";
import BasicEdit from "./BasicEdit";


/**
 * A table that lists elements, with the displayed fields specified by a column parameter. The table supports filtering, sorting and paging, as well as 
 * optionally allowing editing, deleting and creation operations. The default behavior is to list the elements in the order of the array, and to display all 
 * elements in a single page.
 * 
 * Adding and editing an element are accomplished using the BasicElementForm, while deleting will prompt the user for verification. These operations are optional
 * and will only be displayed if the handler methods are included in the component props (see below)
 * 
 * Required Props 
 *   - name: the name of the element type
 *   - elements: the list of elements (objects) to show in the table
 *   - columns: the list of columns that should be displayed, in order from left to right. The elements in the columns array can be a string or objects
 *        If the column entry is a string, the string is used as both the column header and as the field of the listed elements
 *        If the column entry is an object it supports the following fields
 *          - field: the field of the listed elements. Also used as the column header if the "name" field is not included
 *          - name: the column header
 *          - sortFunction: the function used to sort the elements by. If not included, the basic sort is used
 *          - displayFunction: the function used to convert the field value to a read only format. If not included, the raw value is used
 * 
 *   - id: the id of the table HTML element
 * Optional Props
 *   - hideColumns: a list of fields (use the field, not the name, i.e. "myField" not "My Field") that should NOT be shown in the table. Defaults to none
 *   - keyField: the field of the element to use as a key value for each row. If not included, the table id and row index are combined to create the key value
 *   - className: one or more classes to apply to the table HTML element
 *   - addHandler: the function to call to create a new instance of the element. If not included, the "New" button will not be displayed
 *   - editHandler: the function to call to edit an element. If not included, the "Edit" icon will not be displayed
 *   - validator: a function to call to validate a created or edited element. If not included, no validation is performed
 *   - deleteHandler: the function to call to delete an element. If not included, the "Delete" icon will not be displayed
 *   - rowClass: one or more classes to apply to each table row
 *   - defaultSort: the field to sort the table by default. If not specified, the elements are listed in the order they occur in the "elements" array
 *   - defaultPageSize: the maximum number of rows to show at a time by default. If not included, all elements will be displayed
 * @param {*} props 
 */
const BasicTable = (props) => {
    const [sortField, setSortField] = useState(props.defaultSort || null);
    const [pageSize, setPageSize] = useState(props.defaultPageSize || 0);
    const [currentPage, setCurrentPage] = useState(1);
    const [editAnElement, setEditAnElement] = useState({element: null, show: false});
    const [deleteAnElement, setDeleteAnElement] = useState({element: null, show: false});


    const handleAddElement = () => {
        setEditAnElement({element: {}, show: true});
    };

    const handleEditElement = (element) => {
        setEditAnElement({element: element, show: true});
    };

    const saveEditElement = (editedElement) => {
        if(editedElement) {
            if(editedElement.id) {
                props.editHandler(editedElement);
            }
            else {
                props.addHandler(editedElement);
            }
            setEditAnElement({element: null, show: false});
        }
    };

    const closeEdit = () => {
        setEditAnElement({element: null, show: false});
    };

    const handleDeleteElement = (element) => {
        setDeleteAnElement({element: element, show: true});
    };

    const deleteElement = () => {
        if(deleteAnElement.element) {
            props.deleteHandler(deleteAnElement.element);
        }
        setDeleteAnElement({element: null, show: false});
    };

    const closeDelete = () => {
        setDeleteAnElement({element: null, show: false});
    };

    const rowProps = { 
        ...props, 
        editHandler: props.editHandler ? handleEditElement : null,
        deleteHandler: props.deleteHandler ? handleDeleteElement : null
    };

    const searchElements = () => {

    };


    const elements = ObjectUtils.isArray(props.elements) ? props.elements : [];
    const tableClass = `table table-striped table-hover ${props.className || ""} ${props.name}`;
    const tableColumns = props.columns ? props.columns.filter(col => !props.hideColumns || !props.hideColumns.includes(col.field)) : [];


    if(tableColumns === 0) {
        return (<></>);
    }
    
    return (
/*
                <div className="basic-table-search">
                    {props.addHandler && (
                        <button onClick={handleAddElement} className="basic-table-add">Add new {props.name}</button>
                    )}
                    <button onClick={searchElements} className="basic-table-search">Search</button>
                    <input id={`search-${props.name}`} type="text" className="basic-table-search"/>
                </div>
*/
        <>
            <div id={props.id} className={tableClass}>
                <div className={`tr header ${props.name}`}>
                    {tableColumns.map(col => 
                        ObjectUtils.isString(col) ? (<div className={`td ${col}  ${props.name}`}>{col}</div>)
                            : (<div className={`td ${col.field}  ${props.name}`}>{col.name || col.field}</div>)
                    )}
                    {props.editHandler && (<div className="td edit">Edit</div>)}
                    {props.deleteHandler && (<div className="td delete">Delete</div>)}
                </div>
                {elements.map((e, i) => 
                    <BasicRow { ...rowProps } data={e} key={`${props.id}_${i}`} />
                )}
            </div>

            <BasicEdit show={editAnElement.show} name={props.name} data={editAnElement.element} fields={props.columns} saveHandler={saveEditElement} closeHandler={closeEdit}/>
            <Prompt
                title={props.name ? `Delete ${props.name}?` : ""}
                show={deleteAnElement.show}
                message={`Are you sure you want to delete this${props.name ? " " + props.name : ""}?`}
                onYes={deleteElement}
                onNo={closeDelete}
            />

        </>
    );



};


export default BasicTable;