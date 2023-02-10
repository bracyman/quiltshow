import React from "react";
import { Form } from "react-bootstrap";
import { useQuery } from "react-query";
import ShowService from "../../services/ShowService";


/**
 * A dropdown to select from the shows
 * Props:
 *   onSelect - an event handler called when the selected show is changed
 * 
 * Optional Props
 *   initial - the id or object of the initially selected show
 *             Default: null
 *   leadingBlank - if true, the dropdown list starts with a blank value. 
 *                  Default: false
 * 
 * @param {*} props 
 * @returns 
 */
function ShowSelector(props) {
    const {data, isLoading, isError, isSuccess} = useQuery("shows", ShowService.fetchShows);
  
    const onInputChange = (e) => {
        let updatedValue = e.target.value;
        if(updatedValue === "") {
            updatedValue = null;
        }
        else {
            updatedValue = Number(updatedValue);
        }

        props.onSelect(updatedValue);
    };


    return (
        <>
            <Form.Select
                name="show"
                onChange={(e) => onInputChange(e)}
                value={props.initial ? props.initial : ""}
                disabled={!isSuccess}
                >
                {
                    isLoading ? (<option value="" key={-1}>Loading...</option>) 
                    : isError ? (<option value="" key={-1}>Error loading shows</option>)
                    : props.leadingBlank ? <option value="" key={-1}></option> 
                    : (<></>)
                }                    

                {isSuccess && data.map((s) => (
                    <option value={s.id} key={s.id}>
                        {s.year} {s.name} 
                    </option>
                ))}
            </Form.Select>
        </>
    );
}

export default ShowSelector;
