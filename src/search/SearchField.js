
import NumericalSearchField from "./NumericalSearchField";
import BooleanSearchField from "./BooleanSearchField";
import SelectOneSearchField from "./SelectOneSearchField";
import StringSearchField from "./StringSearchField";
import SelectManySearchField from "./SelectManySearchField";
import { QuiltFields } from "../components/quilts/QuiltFields";
import PsuedoSearchField from "./PsuedoSearchField";


const getDataType = (type) => {
    switch (type) {
        case "category":
        case "list(tag)":
        case "list(award)":
            return "select-many";

        case "date":
        case "longString":
            return "string";

        case "designSource":
        case "location":
        case "judgeComment":
            return "nosearch";

        default:
            return type;
    }
};


const SearchField = (props) => {
    const { id, field, search, updateSearch, dataType, label } = props;
    console.log(`Creating search field for ${field}`);

    const elementId = id || field + "_search";
    const included = search.fields.includes(field);
    const finalDataType = dataType || getDataType(QuiltFields[field].type);

    const toggleInclude = (evt) => {
        let newSearch = { ...search };

        if (included) {
            newSearch[field] = null;
            newSearch.fields = search.fields.filter(f => f !== field);
            newSearch.sortOrder = search.sortOrder ? search.sortOrder.filter(f => f !== field) : [];;
        }
        else {
            newSearch.fields = [...search.fields, field];
            newSearch[field] = {};
        }

        updateSearch(newSearch);
    };

    const updateSort = (sortOrder) => {
        let newOrder = search.sortOrder ? search.sortOrder.filter(f => f && f !== field) : [];
        let newSortPosition = parseInt(document.getElementById(`${elementId}_sort`).value);

        if (newSortPosition > 0) {
            if (!search.sortOrder || (newSortPosition > search.sortOrder.length)) {
                newOrder.push(field);
            }
            else {
                newOrder.splice(newSortPosition - 1, 0, field);
            }
        }

        updateSearch({ ...search, sortOrder: newOrder });
    };

    const searchColumns = () => {
        let params = { ...props, idPrefix: elementId, disabled: !included };

        if (finalDataType) {
            switch (finalDataType) {
                case "number":
                    return (<NumericalSearchField {...params} />);

                case "select-many":
                    return (<SelectManySearchField {...params} />);

                /*                case "date":
                                    return (<></>);
                                
                                case "designSource":
                                    return (<StringSearchField {...params} />);
                */
                case "boolean":
                    return (<BooleanSearchField {...params} />);

                case "nosearch":
                    return (<PsuedoSearchField {...params} />);

                case "string":
                default:
                    return (<StringSearchField {...params} />);
            };
        }

        return (<><div /><div /></>);
    };

    return (
        <div id={`${elementId}`} className={`search-field ${finalDataType}`}>
            <div className="include"><input type="checkbox" id={`${elementId}_include`} name={`${elementId}_include`} onChange={toggleInclude} checked={included} /></div>
            <div className="field-name"><label htmlFor={`${elementId}_include`}>{label || QuiltFields[field].label}</label></div>
            {searchColumns()}
            <div className="sort-by">{search.fields.includes(field)
                ? <input type="number" id={`${elementId}_sort`} onChange={updateSort} value={search.sortOrder?.indexOf(field) + 1} />
                : <></>
            } </div>
        </div>
    );

};

export default SearchField;

