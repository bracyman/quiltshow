

import { Form, Row, Col } from "react-bootstrap";
import TagSelector from "./TagSelector";

const IntakePage3 = (props) => {


    const updateQuilt = (propertyName, updatedValue) => {
        props.updateQuilt(propertyName, updatedValue);
    };


    return (
        <Form>
            <Form.Group className="mb-1">
                {props.show.tagCategories.map((tc, index) => (<>
                    {index > 0 ? (<Row><Col sm={12}><hr /></Col></Row>) : (<></>)}
                    <Row>
                        <Col sm={2}>
                            <Form.Label htmlFor="tags">{tc.name}</Form.Label>
                        </Col>
                        <Col>
                            <TagSelector tagCategory={tc} list={props.quilt.tags} update={updateQuilt} />
                        </Col>
                    </Row>
                </>))}
            </Form.Group>
        </Form>
    );
};

export default IntakePage3;