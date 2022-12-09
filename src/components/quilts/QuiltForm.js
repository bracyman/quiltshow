import { Form, Row, Col } from "react-bootstrap";
import { CategoryContext } from "../../contexts/CategoryContext";
import { TagContext } from "../../contexts/TagContext";
import { useContext } from "react";

const QuiltForm = (props) => {
  const { categories } = useContext(CategoryContext);
  const { quiltTags } = useContext(TagContext);

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
    category,
    description,
    width,
    length,
    piecedBy,
    quiltedBy,
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
                <option value={c.id}>
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
            <Form.Label htmlFor="name">Pieced by</Form.Label>
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Pieced By"
              name="piecedBy"
              value={piecedBy || ""}
              onChange={(e) => onInputChange(e)}
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-1">
        <Row>
          <Col sm={2}>
            <Form.Label htmlFor="name">Quilted By</Form.Label>
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Quilted By"
              name="quiltedBy"
              value={quiltedBy || ""}
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
