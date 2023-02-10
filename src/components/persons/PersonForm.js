import { Form, Row, Col } from "react-bootstrap";

const PersonForm = (props) => {

  const onInputChange = (e) => {
    let propertyName = e.target.name;
    let updatedValue = e.target.value;

    props.updatePerson({ ...props.person, [propertyName]: updatedValue });
  };

  const { email, firstName, lastName, phone, address1, address2, city, state, zip } = props.person;

  return (
    <Form>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={2}>
            <Form.Label htmlFor="firstName">First Name</Form.Label>
          </Col>
          <Col sm={4}>
            <Form.Control
              type="text"
              placeholder="First Name"
              name="firstName"
              value={firstName || ""}
              onChange={(e) => onInputChange(e)}
              required
            />
          </Col>
          <Col sm={2}>
            <Form.Label htmlFor="lastName">Last Name</Form.Label>
          </Col>
          <Col sm={4}>
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
            <Form.Label htmlFor="phone">Address Line 1</Form.Label>
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Address Line 1"
              name="address1"
              value={address1 || ""}
              onChange={(e) => onInputChange(e)}
              required
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={2}>
            <Form.Label htmlFor="phone">Address Line 2</Form.Label>
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Address Line 2"
              name="address2"
              value={address2 || ""}
              onChange={(e) => onInputChange(e)}
              required
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={2}>
            <Form.Label htmlFor="city">City</Form.Label>
          </Col>
          <Col sm={4}>
            <Form.Control
              type="text"
              placeholder="City"
              name="city"
              value={city || ""}
              onChange={(e) => onInputChange(e)}
              required
            />
          </Col>
          <Col sm={1}>
            <Form.Label htmlFor="state">State</Form.Label>
          </Col>
          <Col sm={1}>
            <Form.Control
              type="text"
              placeholder=""
              name="state"
              value={state || ""}
              onChange={(e) => onInputChange(e)}
              required
            />
          </Col>
          <Col sm={1}/>
          <Col sm={1}>
            <Form.Label htmlFor="zip">Zipcode</Form.Label>
          </Col>
          <Col sm={2}>
            <Form.Control
              type="text"
              placeholder="00000"
              name="zip"
              value={zip || ""}
              onChange={(e) => onInputChange(e)}
              htmlSize={5}
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
    </Form>
  );
};

export default PersonForm;
