import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { encode as base64_encode } from "base-64";
import { useSignIn, useIsAuthenticated } from "react-auth-kit";
import PersonForm from "./components/persons/PersonForm";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPerson, setNewPerson] = useState({});
  const [showNewPersonForm, setShowNewPersonForm] = useState(false);

  const signIn = useSignIn();

  const isAuthenticated = useIsAuthenticated();
  if (isAuthenticated()) {
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
    fetch(`http://localhost:8080/verify/${username}`, {
        method: "GET",
    })
    .then((exists) => {
        return exists.text();
    })
    .then((existsResponse) => {
        if(existsResponse === "false") {
            promptForRegistration();
        }
        else {
            let basicAuth = base64_encode(`${username}:${password}`);
            fetch("http://localhost:8080/token", {
                method: "POST",
                headers: new Headers({
                    Authorization: `Basic ${basicAuth}`,
                }),
            })
            .then((response) => {
                if (response.ok) {
                    signIn({
                        token: response.body,
                        expiresIn: 3600,
                        tokenType: "Bearer",
                        authState: { email: username },
                    });
                    window.location.href = "/";
                }
            });
        }
    });
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
    const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(newPerson),
      });
  
      if (response.ok) {
        signIn({
          token: response.body,
          expiresIn: 3600,
          tokenType: "Bearer",
          authState: { email: username },
        });
        window.location.href = "/";
      }
  
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
