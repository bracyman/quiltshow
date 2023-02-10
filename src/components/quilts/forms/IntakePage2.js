

import { Form, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import TagSelector from "./TagSelector";

const IntakePage2 = (props) => {

  const onInputChange = (e) => {
    let propertyName = e.target.name;
    let updatedValue = e.target.value;
    if(updatedValue === "") {
        updatedValue = null;
    }
    else {
        if (propertyName === "category") {
            updatedValue = Number(updatedValue);
            updatedValue = props.show.categories.find((c) => c.id === updatedValue);
        }
        else if (propertyName === "judged") {
            updatedValue = updatedValue === "yes";
        }
    }

    updateQuilt(propertyName, updatedValue);
  }

  const updateQuilt = (propertyName, updatedValue) => {
    props.updateQuilt(propertyName, updatedValue);
  };


  return (
    <Form>
    <Form.Group className="mb-1">
        <Row>
        <Col sm={2}>
            <Form.Label htmlFor="category">Category</Form.Label>
        </Col>
        <Col>
            <Form.Select
            name="category"
            onChange={(e) => onInputChange(e)}
            value={props.quilt.category ? props.quilt.category.id : ""}
            >
            <option value=""></option>
            {props.show.categories.map((c) => (
                <OverlayTrigger overlay={<Tooltip id={"tooltip" + c.id}>{c.description}</Tooltip>}>
                    <option value={c.id} key={c.id}>
                        {c.name} - {c.shortDescription}
                    </option>
                </OverlayTrigger>
            ))}
            </Form.Select>
        </Col>
        </Row>
    </Form.Group>
    <Form.Group className="mb-1">
        <Row>
        <Col sm={2}>
            <Form.Label htmlFor="judged">Judged?</Form.Label>
        </Col>
        <Col>
        <Form.Check
            inline
            type="radio"
            id="judged_yes"
            name="judged"
            value="yes"
            label="Yes"
            checked={props.quilt.judged}
            onChange={(e) => onInputChange(e)}
            />
            <Form.Check
            inline
            type="radio"
            id="judged_no"
            name="judged"
            value="no"
            label="No"
            checked={!props.quilt.judged}
            onChange={(e) => onInputChange(e)}
            />
        </Col>
        </Row>
    </Form.Group>
    <Form.Group className="mb-1">
        {props.show.tagCategories.map(tc => (<>
            <Row><Col sm={12}><hr/></Col></Row>
            <Row>
                <Col sm={2}>
                    <Form.Label htmlFor="tags">{tc.name}</Form.Label>
                </Col>
                <Col>
                    <TagSelector tagCategory={tc} list={props.quilt.tags} update={updateQuilt} />
                </Col>
            </Row>            
        </>))}
    </Form.Group>
    </Form>
  );
};

export default IntakePage2;