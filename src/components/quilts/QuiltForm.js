import { Form, Row, Col } from "react-bootstrap";
import QuiltService from "../../services/QuiltService";

const QuiltForm = (props) => {

  const categories = [
    {"id":1,"name":"Small","shortDescription":"0 to 10 sq inches", "description": "really small"},
    {"id":2,"name":"Medium","shortDescription":"11 to 1000 sq inches", "description": "pretty average"},
    {"id":3,"name":"Large","shortDescription":"1001 to 100,000 sq inches", "description": "friggin' huge"},
  ];

  const efforts = [
    {"id":"SOLO","name":"Solo","shortDescription":"Solo effort", "description": "Solo effort"},
    {"id":"DUET","name":"Duet","shortDescription":"Two person effort", "description": "Two person effort"},
    {"id":"GROUP","name":"Group","shortDescription":"3 or more people", "description": "3 or more people"},
  ];

const quiltTags = [
    {"id":1,"name":"Special Event", "description": "Made for a special event"},
    {"id":2,"name":"Christmas", "description": "This is a gift"},
    {"id":3,"name":"President's Challenge", "description": "Made for the president's challenge"},
  ];

  const onInputChange = (e) => {
    let propertyName = e.target.name;
    let updatedValue = e.target.value;
    if (propertyName === "category") {
      updatedValue = categories.find((c) => c.id == updatedValue);
    }
    else if (propertyName === "judged") {
      updatedValue = e.target.value === "yes";
    } 
    else if (propertyName.startsWith("tag")) {
      propertyName = "tags";
      updatedValue = quiltTags.filter(
        (t) => document.getElementById(`tag_${t.id}`).checked
      );
    }
    props.updateQuilt({ ...props.quilt, [propertyName]: updatedValue });
  };

  const {
    id,
    name,
    description,
    category,
    effort,
    length,
    width,
    enteredBy,
    additionalQuilters,
    judged,
    tags,
  } = props.quilt;

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
              value={name || ""}
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
              type="textarea"
              placeholder="Description"
              rows={4}
              name="description"
              value={description || ""}
              onChange={(e) => onInputChange(e)}
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
              value={width || ""}
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
              value={length || ""}
              onChange={(e) => onInputChange(e)}
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={2}>
            <Form.Label htmlFor="category">Category</Form.Label>
          </Col>
          <Col>
            <Form.Select
              name="category"
              onChange={(e) => onInputChange(e)}
              value={category ? category.id : ""}
            >
              {categories.map((c) => (
                <option value={c.id} key={c.id}>
                  {c.name} ({c.shortDescription})
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={2}>
            <Form.Label htmlFor="name">Effort</Form.Label>
          </Col>
          <Col>
          <Form.Select
              name="effort"
              onChange={(e) => onInputChange(e)}
              value={effort ? effort.id : ""}
            >
              {efforts.map((e) => (
                <option value={e.id} key={e.id}>
                  {e.name} ({e.shortDescription})
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={2}>
            <Form.Label htmlFor="name">Additional Quilters</Form.Label>
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Names, separated with commas"
              name="additionalQuilters"
              value={additionalQuilters || ""}
              onChange={(e) => onInputChange(e)}
            />
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
              checked={judged}
              onChange={(e) => onInputChange(e)}
            />
            <Form.Check
              inline
              type="radio"
              id="judged_no"
              name="judged"
              value="no"
              label="No"
              checked={!judged}
              onChange={(e) => onInputChange(e)}
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={2}>
            <Form.Label htmlFor="tags">Tags</Form.Label>
          </Col>
          <Col>
            {quiltTags.map((t) => (
              <Form.Check
                inline
                type="checkbox"
                id={`tag_${t.id}`}
                name={`tag_${t.id}`}
                value={t.id}
                label={t.name}
                checked={tags.map((tag) => tag.id).includes(t.id)}
                onChange={(e) => onInputChange(e)}
              />
            ))}
          </Col>
        </Row>
      </Form.Group>
    </Form>
  );
};

export default QuiltForm;
