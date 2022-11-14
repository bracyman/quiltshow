import { Form, Row, Col } from "react-bootstrap";



const QuiltForm = (props) => {

  const onInputChange = (e) => {
    props.updateQuilt({ ...props.quilt, [e.target.name]: e.target.value });
  };

  const { id, name, description, width, length, piecedBy, quiltedBy, tags } = props.quilt;


  return (
    <Form >
      <Form.Group className="mb-1">
        <Row>
          <Col sm={2}>
            <Form.Label for="name">Quilt Name</Form.Label>
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={(e) => onInputChange(e)}
              required
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={2}>
            <Form.Label for="description">Description</Form.Label>
          </Col>
          <Col>
            <Form.Control
              type="textarea"
              placeholder="Description"
              rows={4}
              name="description"
              value={description}
              onChange={(e) => onInputChange(e)}
              required
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={2}>
            <Form.Label for="name">Width</Form.Label>
          </Col>
          <Col>
            <Form.Control
              type="number"
              placeholder="0"
              name="width"
              value={width}
              onChange={(e) => onInputChange(e)}
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={2}>
            <Form.Label for="name">Length</Form.Label>
          </Col>
          <Col>
            <Form.Control
              type="number"
              placeholder="0"
              name="length"
              value={length}
              onChange={(e) => onInputChange(e)}
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={2}>
            <Form.Label for="name">Pieced by</Form.Label>
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Pieced By"
              name="piecedBy"
              value={piecedBy}
              onChange={(e) => onInputChange(e)}
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={2}>
            <Form.Label for="name">Quilted By</Form.Label>
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Quilted By"
              name="quiltedBy"
              value={quiltedBy}
              onChange={(e) => onInputChange(e)}
            />
          </Col>
        </Row>
      </Form.Group>
    </Form>
  );
};

export default QuiltForm;
