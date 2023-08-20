import { Form, Row, Col, Button } from "react-bootstrap";
import { useState } from "react";
import AuthService from "../../services/AuthService";
import IntakePage1 from "./forms/IntakePage1";
import IntakePage2 from "./forms/IntakePage2";
import IntakePage3 from "./forms/IntakePage3";

const QuiltForm = (props) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [visitedSteps, setVisitedSteps] = useState([1]);
  const lastStep = 3;

  const decrementStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      if (visitedSteps.indexOf(currentStep - 1) < 0) {
        setVisitedSteps([...visitedSteps, currentStep - 1]);
      }
    }
  };

  const incrementStep = () => {
    if (currentStep < lastStep) {
      setCurrentStep(currentStep + 1);
      if (visitedSteps.indexOf(currentStep + 1) < 0) {
        setVisitedSteps([...visitedSteps, currentStep + 1]);
      }
    }
  };

  const visitedAllSteps = () => {
    // already created - no need to check
    if (props.quilt.number) {
      return true;
    }

    // check that all steps have been visited
    for (let i = 1; i <= lastStep; i++) {
      if (visitedSteps.indexOf(i) < 0) {
        return false;
      }
    }

    return true;
  };

  const submitQuilt = () => {
    props.saveQuilt();
  };

  const cancelQuilt = () => {
    props.cancelQuilt();
  };

  let formProps = {...props, readOnly: !AuthService.userHasRole("admin")};

  return (
    <>
      {currentStep === 1 ? (
        <IntakePage1 {...formProps}></IntakePage1>
      ) : currentStep === 2 ? (
        <IntakePage2 {...formProps}></IntakePage2>
      ) : (
        <IntakePage3 {...formProps}></IntakePage3>
      )}
      <Form.Group className="mb-1">
        <Row>
          <Col sm={2}></Col>
          <Col className="quiltForm-button-row">
            {currentStep === 1 ? (
              <Button variant="outline-secondary" disabled>
                Back
              </Button>
            ) : (
              <Button variant="primary" onClick={decrementStep}>
                Back
              </Button>
            )}
            {currentStep === lastStep ? (
              <Button variant="outline-secondary" disabled>
                Next
              </Button>
            ) : (
              <Button variant="primary" onClick={incrementStep}>
                Next
              </Button>
            )}
            {(props.validQuilt(props.quilt, props.show) && visitedAllSteps()) ? (
              <Button variant="primary" onClick={submitQuilt} disabled={!AuthService.userHasRole("admin")}>
                Save
              </Button>
            ) : (
              <Button
                variant="outline-secondary"
                onClick={submitQuilt}
                disabled
              >
                Save
              </Button>
            )}
            <Button variant="secondary" onClick={cancelQuilt}>
              Cancel
            </Button>
          </Col>
        </Row>
      </Form.Group>
    </>
  );
};

export default QuiltForm;
