import { Form, Row, Col } from "react-bootstrap";

const DesignSourceSelector = (props) => {

    const designSourceTypes = [
        {"id":"MAGAZINE","name":"Magazine", order: 1, labels: {name: "Magazine", issueNumber: "Issue", publishedYear: "Year", title: "Project Title"}},
        {"id":"BOOK","name":"Book/Pattern", order: 2, labels: {name: "Book/Pattern", author: "Author", publishedYear: "Year", title: "Project Title"}},
        {"id":"WORKSHOP","name":"Workshop", order: 3, labels: {name: "Workshop Title", author: "Instructor"}},
        {"id":"OTHER","name":"Other Artwork/Type", order: 4, labels: {name: "Title/Type", contactInfo: "Contact Information for Source"}},
    ];
    
    

    const onInputChange = (e) => {
        let propertyName = e.target.name;
        let updatedValue = e.target.value;

        if(propertyName === "designSourceType") {
            if(updatedValue === "") {
                updatedValue = {};
            }
            else {
                updatedValue = { ...props.quilt.designSource, designSourceType: updatedValue };
            }
        }
        else if(propertyName === "designSource_name") {
            updatedValue = { ...props.quilt.designSource, name: updatedValue };
        }
        else if(propertyName === "designSource_issueNumber") {
            updatedValue = { ...props.quilt.designSource, issueNumber: updatedValue };
        }
        else if(propertyName === "designSource_author") {
            updatedValue = { ...props.quilt.designSource, author: updatedValue };
        }
        else if(propertyName === "designSource_publishedYear") {
            updatedValue = { ...props.quilt.designSource, publishedYear: updatedValue };
        }
        else if(propertyName === "designSource_title") {
            updatedValue = { ...props.quilt.designSource, title: updatedValue };
        }
        else if(propertyName === "designSource_contactInfo") {
            updatedValue = { ...props.quilt.designSource, contactInfo: updatedValue };
        }

        props.updateQuilt("designSource", updatedValue);
    };


    let designSourceTypeSelected = props.quilt && props.quilt.designSource && props.quilt.designSource.designSourceType;

    const getDesignFieldLabel = (field) => {
        if(props.quilt && props.quilt.designSource && props.quilt.designSource.designSourceType) {
            return designSourceTypes.filter(d => d.id === props.quilt.designSource.designSourceType)[0].labels[field];
        }
        else {
            return null;
        }
    }

    return (

        <Form.Group>
        <Row>
          <Col sm={2}><Form.Label htmlFor="designSourceType">Design Source</Form.Label></Col>
          <Col>
            <Form.Select
                name="designSourceType"
                onChange={(e) => onInputChange(e)}
                value={ designSourceTypeSelected ? props.quilt.designSource.designSourceType : "" }
              >
                <option value=""></option>
                {designSourceTypes.sort((a,b) => a.order - b.order).map((d) => (
                  <option value={d.id} key={d.id}>
                    {d.name}
                  </option>
                ))}
            </Form.Select>
          </Col>
        </Row>

        {(!designSourceTypeSelected) ? (<></>) : (<>
          <Row>
            <Col sm={2}><Form.Label htmlFor="designSource_name">{getDesignFieldLabel("name")}</Form.Label></Col>
            <Col>
              <Form.Control
                type="text"
                placeholder={getDesignFieldLabel("name")}
                name="designSource_name"
                value={props.quilt.designSource.name || ""}
                onChange={(e) => onInputChange(e)}
              />
            </Col>
          </Row>
          {(getDesignFieldLabel("issueNumber") == null) ? (<></>) : (
            <Row>
              <Col sm={2}><Form.Label htmlFor="designSource_issueNumber">{getDesignFieldLabel("issueNumber")}</Form.Label></Col>
              <Col>
                <Form.Control
                  type="text"
                  placeholder={getDesignFieldLabel("issueNumber")}
                  name="designSource_issueNumber"
                  value={props.quilt.designSource.issueNumber || ""}
                  onChange={(e) => onInputChange(e)}
                />
              </Col>
            </Row>
          )}
          {(getDesignFieldLabel("author") == null) ? (<></>) : (
            <Row>
              <Col sm={2}><Form.Label htmlFor="designSource_author">{getDesignFieldLabel("author")}</Form.Label></Col>
              <Col>
                <Form.Control
                  type="text"
                  placeholder={getDesignFieldLabel("author")}
                  name="designSource_author"
                  value={props.quilt.designSource.author || ""}
                  onChange={(e) => onInputChange(e)}
                />
              </Col>
            </Row>
          )}
          {(getDesignFieldLabel("publishedYear") == null) ? (<></>) : (
            <Row>
              <Col sm={2}><Form.Label htmlFor="designSource_publishedYear">{getDesignFieldLabel("publishedYear")}</Form.Label></Col>
              <Col>
                <Form.Control
                  type="text"
                  placeholder={getDesignFieldLabel("publishedYear")}
                  name="designSource_publishedYear"
                  value={props.quilt.designSource.publishedYear || ""}
                  onChange={(e) => onInputChange(e)}
                />
              </Col>
            </Row>
          )}
          {(getDesignFieldLabel("title") == null) ? (<></>) : (
            <Row>
              <Col sm={2}><Form.Label htmlFor="designSource_title">{getDesignFieldLabel("title")}</Form.Label></Col>
              <Col>
                <Form.Control
                  type="text"
                  placeholder={getDesignFieldLabel("title")}
                  name="designSource_title"
                  value={props.quilt.designSource.title || ""}
                  onChange={(e) => onInputChange(e)}
                />
              </Col>
            </Row>
          )}
          {(getDesignFieldLabel("contactInfo") == null) ? (<></>) : (
            <Row>
              <Col sm={2}><Form.Label htmlFor="designSource_contactInfo">{getDesignFieldLabel("contactInfo")}</Form.Label></Col>
              <Col>
                <Form.Control
                  type="text"
                  placeholder={getDesignFieldLabel("contactInfo")}
                  name="designSource_contactInfo"
                  value={props.quilt.designSource.contactInfo || ""}
                  onChange={(e) => onInputChange(e)}
                />
              </Col>
            </Row>
          )}
          </>)
        }
      </Form.Group>
    );
}

export default DesignSourceSelector;