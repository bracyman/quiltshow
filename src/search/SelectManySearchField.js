
import { MatchTypes } from "../utilities/ObjectUtils";

const SelectManySearchField = (props) => {
    const {disabled, idPrefix, field, search, updateSearch, options, idField, nameField} = props;
    const selected = search[field] && search[field].matches ? search[field].matches.split(",") : [];

    
    const updateSelection = (optId) => {
        let newField = { [field]: search[field] || {}};
        
        if(selected.includes(optId)) {
            newField[field].matches = selected.filter(opt => opt !== optId).join(",");
        }
        else {
            selected.push(optId);
            newField[field].matches = selected.join(",");
        }

        updateSearch({ ...search, ...newField});
    };


    const makeOption = (opt) => {
        let optId = `${opt[idField || "id"]}`;
        let optidPrefix = `${idPrefix}_matches_${optId}`;
        let optionSelected = selected.includes(optId);
        return (
            <label htmlFor={optidPrefix} key={`${idPrefix}_${optId}`}><input type="checkbox" id={optidPrefix} value={optId} disabled={disabled} checked={optionSelected} onChange={() => updateSelection(optId)} />{opt[nameField || "name"]}</label>
        );
    };

    const updateMatchType = (newMatchType) => {
        let newField = { [field]: search[field] || {}};
        newField[field].matchType = newMatchType;

        updateSearch({ ...search, ...newField});
    };



    return (
        <>
            <div className="matches">
                {options.map(opt => makeOption(opt, search[field]?.matches))}
            </div>
            <div className="match-type">
                <label htmlFor={`${idPrefix}_oneOf`}>
                    <input type="radio" 
                        id={`${idPrefix}_oneOf`} 
                        value={MatchTypes.oneOf} 
                        disabled={disabled} 
                        checked={search[field]?.matchType === MatchTypes.oneOf} 
                        onChange={() => updateMatchType(MatchTypes.oneOf)} />One or More</label>
                <label htmlFor={`${idPrefix}_allOf`}>
                    <input type="radio" 
                        id={`${idPrefix}_allOf`} 
                        value={MatchTypes.allOf} 
                        disabled={disabled} 
                        checked={search[field]?.matchType === MatchTypes.allOf} 
                        onChange={() => updateMatchType(MatchTypes.allOf)} />All of</label>
            </div>
        </>
    );

};

export default SelectManySearchField;