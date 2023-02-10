import { Form, Row, Col } from "react-bootstrap";
import DesignSourceSelector from "./DesignSourceSelector";


const IntakePage1 = (props) => {

  const efforts = [
    {"id":"SOLO","name":"Solo","shortDescription":"One person", multiPerson: false},
    {"id":"DUET","name":"Duet","shortDescription":"Two people", multiPerson: true},
    {"id":"GROUP","name":"Group","shortDescription":"3 or more people", multiPerson: true},
  ];



  const onInputChange = (e) => {
    let propertyName = e.target.name;
    let updatedValue = e.target.value;

    if(updatedValue === "") {
      updatedValue = null;
    }
    else {
      if ((propertyName === "width") || (propertyName === "length")) {
        updatedValue = updatedValue ? Number(updatedValue) : 0;
      }
      else {
        if(propertyName === "designSourceType") {
          propertyName = "designSource";
          updatedValue = { ...props.quilt.designSource, designSourceType: updatedValue };
        }
      }
    }

    props.updateQuilt(propertyName, updatedValue);
  };

  let showMultiperson = (props.quilt.groupSize !== null) && (efforts.filter(e => e.multiPerson).map(e=> e.id).includes(props.quilt.groupSize));
  return (
    <Form>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={2}>
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
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={2}>
            <Form.Label htmlFor="description">Description</Form.Label>
          </Col>
          <Col>
            <Form.Control
              as="textarea"
              placeholder="Description"
              name="description"
              value={props.quilt.description || ""}
              onChange={(e) => onInputChange(e)}
              style={{ height: '100px'}}
              required
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={2}>
            <Form.Label htmlFor="width">Width</Form.Label>
          </Col>
          <Col>
            <Form.Control
              type="number"
              placeholder="0"
              name="width"
              value={props.quilt.width || ""}
              onChange={(e) => onInputChange(e)}
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={2}>
            <Form.Label htmlFor="length">Length</Form.Label>
          </Col>
          <Col>
            <Form.Control
              type="number"
              placeholder="0"
              name="length"
              value={props.quilt.length || ""}
              onChange={(e) => onInputChange(e)}
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={2}>
            <Form.Label htmlFor="mainColor">Main Color</Form.Label>
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Main color"
              name="mainColor"
              value={props.quilt.mainColor || ""}
              onChange={(e) => onInputChange(e)}
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={2}>
            <Form.Label htmlFor="hangingPreference">Hanging Preference</Form.Label>
          </Col>
          <Col>
            <Form.Control
              type="number"
              placeholder="1"
              name="hangingPreference"
              value={props.quilt.hangingPreference || 1}
              onChange={(e) => onInputChange(e)}
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-1">
        <Row><Col sm={12} /><hr/></Row>
        <Row>
          <Col sm={2}>
            <Form.Label htmlFor="name">Group Size</Form.Label>
            <Form.Text id={"groupSizeHelpBlock"} muted>Including quilter</Form.Text>
          </Col>
          <Col>
            <Form.Select
                name="groupSize"
                onChange={(e) => onInputChange(e)}
                value={props.quilt.groupSize ? props.quilt.groupSize : ""}
              >
                <option value=""></option>
                {efforts.map((e) => (
                  <option value={e.id} key={e.id}>
                    {e.name} - {e.shortDescription}
                  </option>
                ))}
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>

      {showMultiperson ? (<>
        <Form.Group className="mb-1" >
        <Row>
          <Col sm={2}>
            <Form.Label htmlFor="name">Quilted By</Form.Label>
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Quilted By"
              name="quiltedBy"
              value={props.quilt.quiltedBy || ""}
              onChange={(e) => onInputChange(e)}
            />
          </Col>
        </Row>
        </Form.Group>
        <Form.Group className="mb-1" >
          <Row>
            <Col sm={2}>
              <Form.Label htmlFor="name">Additional Quilters</Form.Label>
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Names, separated with commas"
                name="additionalQuilters"
                value={props.quilt.additionalQuilters || ""}
                onChange={(e) => onInputChange(e)}
              />
            </Col>
          </Row>
        </Form.Group>
        </>) : (<></>)
      }
      <Form.Group className="mb-1">
        <Row><Col sm={12} /><hr/></Row>
        <DesignSourceSelector {...props} />
      </Form.Group>
      
    </Form>
  );
}


export default IntakePage1;
