import { Form } from "react-bootstrap";

const TagSelector = (props) => {

    const listContainsTag = (list, tag) => {
        if (list && tag) {
            return list.map(t => t.id).includes(tag.id);
        }
        return false;
    };

    const toggleTag = (tagId) => {
        if (props.tagCategory.onlyOne) {
            props.update("tags", [...props.list.filter(t => !listContainsTag(props.tagCategory.tags, t)), ...props.tagCategory.tags.filter(t => t.id === tagId)]);
        }
        else {
            if (document.getElementById("tag" + tagId).checked) {
                addTag(tagId);
            }
            else {
                removeTag(tagId);
            }
        }
    };

    const addTag = (tagId) => {

        let selectedTag = props.tagCategory.tags.filter(t => t.id === tagId).pop();
        props.update("tags", [...props.list, selectedTag]);
    };

    const removeTag = (tagId) => {
        if (tagId) {
            props.update("tags", props.list.filter(t => t.id !== tagId));
        }
    };

    const sortByName = (a, b) => {
        return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
    }


    return (
        <>
            {
                props.tagCategory.tags.sort(sortByName).map(t => (
                    <Form.Check
                        inline
                        type={props.tagCategory.onlyOne ? "radio" : "checkbox"}
                        id={"tag" + t.id}
                        name={props.tagCategory.onlyOne ? props.tagCategory.id : t.id}
                        value={t.id}
                        label={t.name}
                        key={t.id}
                        checked={listContainsTag(props.list, t)}
                        onChange={(e) => toggleTag(t.id)}
                    />
                ))
            }
            <br /><Form.Text id={props.tagCategory.id + "HelpBlock"} muted>{(props.tagCategory.requireOne && props.tagCategory.onlyOne) ? "(Pick the most relevant)(Required)"
                : (props.tagCategory.requireOne && !props.tagCategory.onlyOne) ? "(Required)"
                    : (props.tagCategory.requireOne) ? "(Pick at least one option)"
                        : (!props.tagCategory.onlyOne) ? "(Pick all that apply)"
                            : ""}</Form.Text>
        </>
    )
}

export default TagSelector;