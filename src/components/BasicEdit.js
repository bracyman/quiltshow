
import React from "react";
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import ObjectUtils from "../utilities/ObjectUtils";


/**
 * A simple dialog containing a form to edit the contents of an element. The contents are described by the fields property. The fields are limited to 
 * string, numeric or boolean inputs. If the type of a field is not specified, it defaults to a string input
 * 
 * Props
 *   - data: the element to edit
 *   - fields: the fields of the element that should be included in the form, in the order they should be displayed
 *        If the field entry is a string, the string is used as the field key and the label in the form
 *        If the field entry is an object it supports the following fields
 *          - field: the field of the element. 
 *          - name: the value to use for the form label
 *          - dataType: string, number or boolean. Defaults to string
 *   - name: the name of the type of element
 *   - show: if true, the dialog is displayed. Otherwise the dialog is hidden
 *   - saveHandler: the function to call when the save button is clicked
 *   - closeHandler: the function to call when the close/cancel button is clicked
 * 
 * Optional props
 *   - className: class(es) to apply to the body table of the form
 * 
 * @param {*} props 
 */
const BasicEdit = (props) => {
    const { data, fields, name, show, saveHandler, closeHandler, className } = props;

    const [element, setElement] = useState({data});
    useEffect(() => { setElement({...data})}, [data] );


    const onInputChange = (e, field) => {
        let fieldName = e.target.name;
        let value = e.target.value;

        if(ObjectUtils.isObject(field)) {
            if(field.dataType === "boolean") {
                value = value === "yes";
            }
        }

        setElement({...element, [fieldName]: value});
    };

    const buildInput = (field) => {
        if(!ObjectUtils.isObject(field)) {
            return (<Form.Control
                type="text"
                placeholder={field}
                name={field}
                value={element[field] || ""}
                onChange={(e) => onInputChange(e)}
                required
              />);
        }

        let fieldName = field.field;
        let fieldType = "text";
        let placeholder = field.name;

        if(field.dataType && field.dataType.toLowerCase() === "longstring") {
            fieldType = "textarea";
        }
        else if(field.dataType && field.dataType.toLowerCase() === "number") {
            fieldType = "number";
            placeholder = 0;
        }
        else if(field.dataType && field.dataType.toLowerCase() === "boolean") {
            fieldType = "boolean";
        }

        if(fieldType !== "boolean") {
            return (<Form.Control
                as={fieldType}
                placeholder={placeholder}
                name={fieldName}
                value={element[fieldName] || ""}
                onChange={(e) => onInputChange(e, field)}
                required
            />);
        }
        else {
            return <>
                <Form.Check
                    inline
                    type="radio"
                    id={`${fieldName}_yes`}
                    name={fieldName}
                    value="yes"
                    label="Yes"
                    checked={element[fieldName]}
                    onChange={(e) => onInputChange(e, field)}
                    />
                <Form.Check
                    inline
                    type="radio"
                    id={`${fieldName}_no`}
                    name={fieldName}
                    value="no"
                    label="No"
                    checked={!element[fieldName]}
                    onChange={(e) => onInputChange(e, field)}
                    />
            </>
        }


    };

    if(data) {
        return (
            <Modal show={show === true} onHide={closeHandler}>
                <Modal.Header closeButton>
                    <Modal.Title>Select values {name ? `for ${name}` : ""}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={`table basic-edit ${className || ""}`}>
                        {fields.map(f => (
                            <div className="tr">
                                <div className="td">{ObjectUtils.isObject(f) ? f.name || f.field : f}</div>
                                <div className="td">{buildInput(f)}</div>
                            </div>
                        ))}
                    </div>
                </Modal.Body> 
                <Modal.Footer>
                    <Button variant="primary" onClick={() => saveHandler(element)}>Save</Button>
                    <Button variant="secondary" onClick={closeHandler}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
    else {
        return (<></>);
    }

};

export default BasicEdit;