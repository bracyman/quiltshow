import { Form, Row, Col, Button } from "react-bootstrap";
import { useState } from "react";
import IntakePage1 from "./forms/IntakePage1";
import IntakePage2 from "./forms/IntakePage2";


const QuiltForm = (props) => {
  const [currentStep, setCurrentStep] = useState(1);
  const lastStep = 2;

  const decrementStep = () => {
    if(currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const incrementStep = () => {
    if(currentStep < lastStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const submitQuilt = () => {
    props.saveQuilt();
  };

  const cancelQuilt = () => {
    props.cancelQuilt();
  };

  return (
    <>
    { 
      (currentStep === 1)
        ? (<IntakePage1 {...props}></IntakePage1>)
        : (<IntakePage2 {...props}></IntakePage2>)
    }
    <Form.Group className="mb-1" >
      <Row>
        <Col sm={2}>
          
        </Col>
        <Col className="quiltForm-button-row">
          { (currentStep === 1) ? (<Button variant="outline-secondary" disabled>Back</Button>) : (<Button variant="primary" onClick={decrementStep}>Back</Button>) }
          { (currentStep === lastStep) ? (<Button variant="outline-secondary" disabled>Next</Button>) : (<Button variant="primary" onClick={incrementStep}>Next</Button>) }
          { props.validQuilt(props.quilt) ? (<Button variant="primary" onClick={submitQuilt}>Save</Button>) : (<Button variant="outline-secondary" onClick={submitQuilt} disabled>Save</Button>) }
          <Button variant="secondary" onClick={cancelQuilt}>Cancel</Button>
        </Col>
      </Row>
    </Form.Group>
    </>
  );
};

export default QuiltForm;
