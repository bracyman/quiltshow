import { Form, Row, Col } from "react-bootstrap";

const PersonForm = (props) => {

  const onInputChange = (e) => {
    let propertyName = e.target.name;
    let updatedValue = e.target.value;

    props.updatePerson({ ...props.person, [propertyName]: updatedValue });
  };

  const { email, firstName, lastName, phone } = props.person;

  return (
    <Form>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={2}>
            <Form.Label htmlFor="email">Email</Form.Label>
          </Col>
          <Col>
            <Form.Control
              type="email"
              placeholder="Email Address"
              name="email"
              value={email || ""}
              onChange={(e) => onInputChange(e)}
              required
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={2}>
            <Form.Label htmlFor="firstName">First Name</Form.Label>
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="First Name"
              name="firstName"
              value={firstName || ""}
              onChange={(e) => onInputChange(e)}
              required
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={2}>
            <Form.Label htmlFor="lastName">Last Name</Form.Label>
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={lastName || ""}
              onChange={(e) => onInputChange(e)}
              required
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={2}>
            <Form.Label htmlFor="phone">Phone</Form.Label>
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Phone Number"
              name="phone"
              value={phone || ""}
              onChange={(e) => onInputChange(e)}
              required
            />
          </Col>
        </Row>
      </Form.Group>
    </Form>
  );
};

export default PersonForm;
