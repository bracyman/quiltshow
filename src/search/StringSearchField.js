
import { MatchTypes } from "../utilities/ObjectUtils";

const StringSearchField = (props) => {

    const {disabled, idPrefix, field, search, updateSearch} = props;


    const updateMatch = () => {
        let newValue = document.getElementById(`${idPrefix}_matches`).value;
        let newField = { [field]: search[field] || {}};
        newField[field].matches = newValue;

        updateSearch({ ...search, ...newField});
    };

    const updateMatchType = (newMatchType) => {
        let newField = { [field]: search[field] || {}};
        newField[field].matchType = newMatchType;

        updateSearch({ ...search, ...newField});
    };


    return (
        <>
            <div className="matches"><input type="text" id={`${idPrefix}_matches`} disabled={disabled} value={search[field]?.matches || ""} onChange={updateMatch}/></div>
            <div className="match-type">
                <label htmlFor={`${idPrefix}_eq`}>
                    <input type="radio" 
                        id={`${idPrefix}_eq`}
                        value={MatchTypes.equals} 
                        disabled={disabled} 
                        checked={search[field]?.matchType === MatchTypes.equals} 
                        onChange={() => updateMatchType(MatchTypes.equals)} />Equals</label>
                <label htmlFor={`${idPrefix}_contains`}>
                    <input type="radio" 
                        id={`${idPrefix}_contains`} 
                        value={MatchTypes.contains} 
                        disabled={disabled} 
                        checked={search[field]?.matchType === MatchTypes.contains} 
                        onChange={() => updateMatchType(MatchTypes.contains)} />Contains</label>
            </div>
        </>
    );

};

export default StringSearchField;