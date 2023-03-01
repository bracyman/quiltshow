

const BooleanSearchField = (props) => {

    const {disabled, idPrefix, field, search, updateSearch} = props;

    const updateValue = (newBoolean) => {
        let newSearch = { ...search };
        newSearch[field] = newSearch[field] ? { ...newSearch[field], matches: newBoolean } : { matches: newBoolean };

        updateSearch(newSearch);
    };


    return (
        <>
            <div className="matches">
                <input type="radio" id={`${idPrefix}_yes`} value="true" disabled={disabled} checked={search[field]?.matches === "true"} onChange={() => updateValue("true")} /><label htmlFor={`${idPrefix}_yes`}>Yes</label>
                <input type="radio" id={`${idPrefix}_no`} value="false" disabled={disabled} checked={search[field]?.matches === "false"} onChange={() => updateValue("false")} /><label htmlFor={`${idPrefix}_no`}>No</label>
            </div>
            <div className="match-type"></div>
        </>
    );

};

export default BooleanSearchField;