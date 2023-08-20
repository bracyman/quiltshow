import { Form, Row, Col } from "react-bootstrap";

const IntakePage1 = (props) => {
  const onInputChange = (e) => {
    let propertyName = e.target.name;
    let updatedValue = e.target.value;

    if (updatedValue === "") {
      updatedValue = null;
    } else {
      if (propertyName === "width" || propertyName === "length") {
        updatedValue = updatedValue.replaceAll(/[^0-9.]/ig, '');
      } else if (propertyName === "presidentsChallenge") {
        updatedValue = updatedValue === "yes";
      } else {
        if (propertyName === "designSourceType") {
          propertyName = "designSource";
          updatedValue = {
            ...props.quilt.designSource,
            designSourceType: updatedValue,
          };
        }
      }
    }

    props.updateQuilt(propertyName, updatedValue);
  };


  return (
    <Form>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={3}>
            <Form.Label htmlFor="name">Quilt Name</Form.Label>
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Name"
              name="name"
              value={props.quilt.name || ""}
              onChange={(e) => onInputChange(e)}
              required
              className={props.quilt.name ? "" : "empty-data"}
              disabled={props.readOnly || false}
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={3}>
            <Form.Label htmlFor="description">Description</Form.Label>
            <Form.Text id={"groupSizeHelpBlock"} muted>
              Description will be displayed with the quilt
            </Form.Text>
          </Col>
          <Col>
            <Form.Control
              as="textarea"
              placeholder="Description"
              name="description"
              value={props.quilt.description || ""}
              onChange={(e) => onInputChange(e)}
              style={{ height: "100px" }}
              required
              className={props.quilt.description ? "" : "empty-data"}
              disabled={props.readOnly || false}
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={3}>
            <Form.Label htmlFor="width">Width</Form.Label>
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="0"
              name="width"
              value={props.quilt.width || ""}
              onChange={(e) => onInputChange(e)}
              className={props.quilt.width ? "" : "empty-data"}
              disabled={props.readOnly || false}
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={3}>
            <Form.Label htmlFor="length">Length</Form.Label>
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="0"
              name="length"
              value={props.quilt.length || ""}
              onChange={(e) => onInputChange(e)}
              className={props.quilt.length ? "" : "empty-data"}
              disabled={props.readOnly || false}
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={3}>
            <Form.Label htmlFor="mainColor">Main Color(s)</Form.Label>
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Main color"
              name="mainColor"
              value={props.quilt.mainColor || ""}
              onChange={(e) => onInputChange(e)}
              disabled={props.readOnly || false}
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={3}>
            <Form.Label htmlFor="hangingPreference">
              Hanging Preference
            </Form.Label>
          </Col>
          <Col>
            <Form.Control
              type="number"
              placeholder="1"
              name="hangingPreference"
              value={props.quilt.hangingPreference || (props.numQuilts + 1)}
              onChange={(e) => onInputChange(e)}
              disabled={props.readOnly || false}
            />
          </Col>
        </Row>
      </Form.Group>
    </Form>
  );
};

export default IntakePage1;
