

import { Modal, Button } from "react-bootstrap";
import { useState } from "react";

const SubmitExternalPayment = (props) => {
    const [selectedQuilts, setSelectedQuilts] = useState(props.quilts || []);

    const toggleInclude = (quilt) => {
        let filteredQuilts = selectedQuilts.filter(q => q.id !== quilt.id);

        if(filteredQuilts.length === selectedQuilts.length) {
            filteredQuilts.push(quilt);
        }

        setSelectedQuilts(filteredQuilts);
    };

    const included = (quilt) => {
        return selectedQuilts.filter(q => q.id === quilt.id).length > 0;
    };

    return (
        <>
        <Modal show={props.show} >
            <Modal.Header closeButton>
            <b>Mark the following quilt(s) as paid?</b>
            </Modal.Header>
            <Modal.Body>
                <div className="submit-external-payment">
                    
                    { (props.quilts) 
                        ? props.quilts.map(q => 
                            (
                                <div className="quilt-to-be-paid" key={`mark_paid_${q.id}`}>
                                    <div className="include"><input type="checkbox" id={`${q.id}_include`} name={`${q.id}_include`} onChange={() => toggleInclude(q)} checked={included(q)} /></div>
                                    <div className="field-name"><label htmlFor={`${q.id}_include`}>{q.name}</label></div>
                                </div>
                            )
                        )
                        
                        : (<></>)
                    }
                </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="success" type="submit" onClick={() => props.markAsPaid(selectedQuilts)} disabled={selectedQuilts.length === 0}>
                Mark As Paid
            </Button>
            <Button variant="secondary" onClick={props.cancelMarkAsPaid}>
                Cancel
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
};

export default SubmitExternalPayment;