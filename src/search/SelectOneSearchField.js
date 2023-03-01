
const SelectOneSearchField = (props) => {
    const { id, field, search, updateSearch, options, idField, nameField } = props;
    const elementId = id || field + "_search";
    const included = search.fields.includes(field);


    const makeOption = (opt) => {
        let optId = opt[idField || "id"];
        return (<option value={optId}  key={`${elementId}_${optId}`}>{opt[nameField || "name"]}</option>);
    };

    const updateSelection = () => {
        let newValue = document.getElementById(`${elementId}_matches`).value;
        let newField = { [field]: search[field] || {}};
        newField[field].matches = newValue;

        updateSearch({ ...search, ...newField});
    };


    return (
        <>
            <div className="matches">
                <select id={`${elementId}_matches`} disabled={!included} onChange={updateSelection} defaultValue={search[field]?.matches}>
                    {options.map(opt => makeOption(opt))}
                </select>
            </div>
            <div className="match-type"></div>
        </>
    );

};

export default SelectOneSearchField;