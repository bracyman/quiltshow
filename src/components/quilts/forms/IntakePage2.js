import { Form, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import DesignSourceSelector from "./DesignSourceSelector";

const IntakePage2 = (props) => {
    const efforts = [
        {
            id: "SOLO",
            name: "Solo",
            shortDescription: "One person",
            multiPerson: false,
        },
        {
            id: "DUET",
            name: "Duet",
            shortDescription: "Two people",
            multiPerson: true,
        },
        {
            id: "GROUP",
            name: "Group",
            shortDescription: "3 or more people",
            multiPerson: true,
        },
    ];

    const onInputChange = (e) => {
        let propertyName = e.target.name;
        let updatedValue = e.target.value;
        if (updatedValue === "") {
            updatedValue = null;
        } else {
            if (propertyName === "category") {
                updatedValue = Number(updatedValue);
                updatedValue = props.show.categories.find((c) => c.id === updatedValue);

                if (!updatedValue.judgeable) {
                    updateQuilt({ category: updatedValue, judged: false });
                    return;
                }
            } else if (propertyName === "judged" || propertyName === "firstEntry") {
                updatedValue = updatedValue === "yes";
            }
        }

        updateQuilt(propertyName, updatedValue);
    };

    const updateQuilt = (propertyName, updatedValue) => {
        props.updateQuilt(propertyName, updatedValue);
    };

    const sortCategory = (a, b) => {
        return a.displayOrder < b.displayOrder
            ? -1
            : a.displayOrder > b.displayOrder
                ? 1
                : 0;
    };

    let showMultiperson =
        props.quilt.groupSize !== null &&
        efforts
            .filter((e) => e.multiPerson)
            .map((e) => e.id)
            .includes(props.quilt.groupSize);

    return (
        <Form>
            <Form.Group className="mb-1">
                <Row>
                    <Col sm={2}>
                        <Form.Label htmlFor="name">Group Size</Form.Label>
                        <Form.Text id={"groupSizeHelpBlock"} muted>
                            Including quilter
                        </Form.Text>
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

            {showMultiperson ? (
                <>
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
                                    value={props.quilt.quiltedBy || ""}
                                    onChange={(e) => onInputChange(e)}
                                />
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
                                    value={props.quilt.additionalQuilters || ""}
                                    onChange={(e) => onInputChange(e)}
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                </>
            ) : (
                <></>
            )}
            <Form.Group className="mb-1">
                <Row>
                    <Col sm={12} />
                    <hr />
                </Row>
                <Row>
                    <Col sm={2}>
                        <Form.Label htmlFor="presidentsChallenge">
                            President's Challenge
                        </Form.Label>
                    </Col>
                    <Col>
                        <Form.Check
                            inline
                            type="radio"
                            id="presidentsChallenge_yes"
                            name="presidentsChallenge"
                            value="yes"
                            label="Yes"
                            checked={props.quilt.presidentsChallenge}
                            onChange={(e) => onInputChange(e)}
                        />
                        <Form.Check
                            inline
                            type="radio"
                            id="presidentsChallenge_no"
                            name="presidentsChallenge"
                            value="no"
                            label="No"
                            checked={!props.quilt.presidentsChallenge}
                            onChange={(e) => onInputChange(e)}
                        />
                    </Col>
                </Row>
                <DesignSourceSelector {...props} />
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
                            value={props.quilt.category ? props.quilt.category.id : ""}
                        >
                            <option value=""></option>
                            {props.show.categories.sort(sortCategory).map((c) => (
                                <OverlayTrigger
                                    overlay={
                                        <Tooltip id={"tooltip" + c.id}>{c.description}</Tooltip>
                                    }
                                >
                                    <option value={c.id} key={c.id}>
                                        {c.name} - {c.shortDescription}
                                    </option>
                                </OverlayTrigger>
                            ))}
                        </Form.Select>
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group
                className="mb-1"
                hidden={props.quilt.category?.judgeable === false}
            >
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
                            checked={props.quilt.judged}
                            onChange={(e) => onInputChange(e)}
                        />
                        <Form.Check
                            inline
                            type="radio"
                            id="judged_no"
                            name="judged"
                            value="no"
                            label="No"
                            checked={props.quilt.judged === false}
                            onChange={(e) => onInputChange(e)}
                        />
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group className="mb-1">
                <Row>
                    <Col sm={2}>
                        <Form.Label htmlFor="judged">First ever entry?</Form.Label>
                    </Col>
                    <Col>
                        <Form.Check
                            inline
                            type="radio"
                            id="firstEntry_yes"
                            name="firstEntry"
                            value="yes"
                            label="Yes"
                            checked={props.quilt.firstEntry}
                            onChange={(e) => onInputChange(e)}
                        />
                        <Form.Check
                            inline
                            type="radio"
                            id="firstEntry_no"
                            name="firstEntry"
                            value="no"
                            label="No"
                            checked={props.quilt.firstEntry === false}
                            onChange={(e) => onInputChange(e)}
                        />
                    </Col>
                </Row>
            </Form.Group>
        </Form>
    );
};

export default IntakePage2;
