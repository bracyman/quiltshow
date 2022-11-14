import React from "react";
import { Modal, Button } from "react-bootstrap";




function Prompt(props) {

  return (
    <>
      <Modal show={props.show} >
        <Modal.Header closeButton />
        <Modal.Body>
          {props.message}
        </Modal.Body>
        <Modal.Footer>
        <Button variant="success" type="submit" onClick={props.onYes}>
            Yes
          </Button>
          <Button variant="secondary" onClick={props.onNo}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Prompt;
