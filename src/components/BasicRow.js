import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Prompt from "./Prompt";
import ObjectUtils from "../utilities/ObjectUtils";
import { useState } from "react";
import StringUtils from "../utilities/StringUtils";

/**
 * Displays a row of object properties, as specified by fields in the props. Supports an edit and delete button as well
 * Props
 *   - data: the object to display
 *   - columns: the list of columns that should be displayed, in order from left to right. The elements in the columns array can be a string or objects
 *        If the column entry is a string, the string is used as the field of the listed elements
 *        If the column entry is an object it supports the following fields
 *          - field: the field of the listed elements. Also used as the column header if the "name" field is not included
 *          - displayFunction: the function used to convert the field value to a read only format. If not included, the raw value is used
 *               The display function will be called with the field valiue and the field name [displayFunction(value, fieldName)]
 * 
 * Optional Props
 *   - name: the name of the object in the row
 *          Default: null
 *   - hideColumns: a list of fields (use the field, not the name, i.e. "myField" not "My Field") that should NOT be shown in the row. Defaults to none
 *   - editHandler: the function to call when the edit link is clicked. If not included, the edit link is not displayed
 *          Default: null, no edit link displayed
 *   - deleteHandler: the function to call when the delete link is clicked. If not included, the delete link is not displayed
 *          Default: null, no delete link displayed
 *   - rowClass: a class to add to each row
 *          Default: null
 * @param {*} props 
 * @returns 
 */
const BasicRow = (props) => {
    const getColumn = (field) => {
        let column = props.columns.filter(col => (col.field === field));
        if(column.length > 0) {
            return column[0];
        }

        return null;
    };

    const convert = (field) => {
        if(props.data[field] === undefined || props.data === null) {
            return "";
        }

        let column = getColumn(field);
        let val = props.data[field];

        if(!column) {
            return val;
        }

        if(column.displayFunction) {
            if(ObjectUtils.isFunction(column.displayFunction)) {
                return column.displayFunction(val, field);
            }
        }
        else {
            val = StringUtils.toString(val, column.dataType);
        }

        return val;
    };


    if(!props.data || !props.columns || (props.columns.length === 0)) {
        return (<></>);
    }

    const tableColumns = props.columns.filter(col => !props.hideColumns || !props.hideColumns.includes(col.field));
    return (
        <div className="tr">
            {tableColumns.map(col => 
                <div className={`td ${ObjectUtils.isObject(col) ? col.field : col}  ${props.name}`}>{convert(col.field)}</div>
            )}
            {props.editHandler ? (
                <div className={`td edit`}>
                    <OverlayTrigger overlay={<Tooltip id={`tooltip-top`}>Edit</Tooltip>}>
                    <button
                        onClick={() => props.editHandler(props.data)}
                        className="btn text-warning btn-act"
                        data-toggle="modal"
                    >
                        <i className="material-icons">&#xE254;</i>
                    </button>
                    </OverlayTrigger>
                </div>
            ) : (<></>)}
            {props.deleteHandler ? (
                <div className={`td delete`}>
                    <OverlayTrigger overlay={<Tooltip id={`tooltip-top`}>Delete</Tooltip>}>
                    <button
                        onClick={() => props.deleteHandler(props.data)}
                        className="btn text-danger btn-act"
                        data-toggle="modal"
                    >
                        <i className="material-icons">&#xE872;</i>
                    </button>
                    </OverlayTrigger>
                </div>
            ) : (<></>)}
        </div>
    );
}

export default BasicRow;
