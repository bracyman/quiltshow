import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState, useContext } from "react";
import { encode as base64_encode } from "base-64";
import PersonForm from "./components/persons/PersonForm";
import AuthService from "./services/AuthService";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPerson, setNewPerson] = useState({});
  const [showNewPersonForm, setShowNewPersonForm] = useState(false);

  const isAuthenticated = AuthService.loggedIn();
  if (isAuthenticated) {
    window.location.href = "/";
    return <></>;
  }

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // check to see if the user is not yet registered
    if(!AuthService.verifyUser(username)) {
      promptForRegistration();
    }
    else {
      let success = await AuthService.login(username, password);
      if(success) {
        window.location.href = "/";
      }
      else {
        alert("Invalid password");
      }
    }
  };

  const promptForRegistration = () => {
    setNewPerson({
      email: username,
      firstName: "",
      lastName: "",
      phone: "",
    });

    setShowNewPersonForm(true);
  };

  const handleCloseNewPersonForm = () => {
    setNewPerson({
      email: username,
      firstName: "",
      lastName: "",
      phone: "",
    });
    setShowNewPersonForm(false);
  };

  const handleRegisterNewPerson = async () => {
  };

  return (
    <>
      <div className="outerContainer">
        <div className="innerContainer">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="username">Email</Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Email Address"
                  name="username"
                  value={username}
                  onChange={(e) => handleUsername(e)}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="password">Password</Form.Label>
              <Col>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={(e) => handlePassword(e)}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group>
              <Row>
                <Button variant="success" type="button" onClick={handleLogin}>
                  Login
                </Button>
              </Row>
            </Form.Group>
          </Form>
        </div>
      </div>

      <Modal show={showNewPersonForm} onHide={handleCloseNewPersonForm}>
        <Modal.Header closeButton>
          <Modal.Title>New Registration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PersonForm person={newPerson} updatePerson={setNewPerson} />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            type="submit"
            onClick={handleRegisterNewPerson}
          >
            Register
          </Button>
          <Button variant="secondary" onClick={handleCloseNewPersonForm}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Login;
