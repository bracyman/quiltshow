import React, {useState, useEffect} from 'react';
import {  Container, Button  } from 'reactstrap';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { Link } from 'react-router-dom';

function SelectableTagList() {
    const [selectedTags, setSelectedTags] = useState([]);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        fetch('/tags')
            .then(response => response.json())
            .then(data => { console.log("Received " + data.length + " tags"); setTags(data)} );
    }, []);

    const handleTagClicked = (tagName) => {
        console.log("clicked on " + tagName);
        console.log(selectedTags);
        if(selectedTags.includes(tagName)) {
            setSelectedTags(selectedTags.filter(function (v, i, arr) { return v !== tagName }));
        }
        else {
            setSelectedTags(selectedTags => [...selectedTags, tagName]);
        }
    };

    return (
        <div>
            <Container fluid>
                <div className="float-right">
                    <Button color="success" tag={Link} to="/clients/new">Add Client</Button>
                </div>
                <h3>Tags</h3>
                <Container className="mt-4">
                {tags.map(tag => (
                        <span title={tag.description}>
                            <ToggleButton
                                className="mb-2"
                                id={tag.name}
                                type="checkbox"
                                variant="outline-primary"
                                checked={selectedTags.includes(tag.name)}
                                value={tag.name}
                                onChange={(e) => handleTagClicked(e.currentTarget.value)}
                            >
                                {tag.name}
                            </ToggleButton>
                        </span>
                ))}
                </Container>
            </Container>
        </div>
    );
}
export default SelectableTagList;