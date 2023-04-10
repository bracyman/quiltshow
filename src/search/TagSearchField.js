
import NumericalSearchField from "./NumericalSearchField";
import BooleanSearchField from "./BooleanSearchField";
import SelectManySearchField from "./SelectManySearchField";
import { QuiltFields } from "../components/quilts/QuiltFields";



const TagSearchField = (props) => {
    const { id, field, search, updateSearch, show, } = props;

    const elementId = id || field + "_search";
    const included = search.fields.includes(field);


    const isIncluded = (tagCategoryId) => {
        if (!search[field]) {
            return false;
        }

        let fieldConfig = search[field];
        if (fieldConfig.categories?.includes(tagCategoryId)) {
            return true;
        }

        return false;
    };

    const toggleInclude = (tagCategoryId) => {
        let newSearch = { ...search };
        let newConfig = search[field] ? { ...search[field] } : { categories: [] };

        if (isIncluded(tagCategoryId)) {
            newConfig.categories = newConfig.categories.filter(tc => tc != tagCategoryId);
        }
        else {
            newConfig.categories = [...newConfig.categories, tagCategoryId];
        }

        if (newConfig.categories.length === 0) {
            newSearch[field] = null;
            newSearch.fields = search.fields.filter(f => f !== field);
            newSearch.sortOrder = search.sortOrder ? search.sortOrder.filter(f => f !== field) : [];
        }
        else {
            newSearch[field] = newConfig;
            if (!newSearch.fields?.includes(field)) {
                newSearch.fields = newSearch.fields ? [...newSearch.fields, field] : [field];
            }
        }

        updateSearch(newSearch);
    };

    const searchColumns = (tagCategory) => {
        let params = { ...props, idPrefix: elementId, disabled: !isIncluded(tagCategory.id), options: tagCategory.tags };
        return (<SelectManySearchField {...params} label={`Tags - ${tagCategory.name}`}/>);
    };

    return (
        <>
        {
            show?.tagCategories?.map(tc => {
                return (
                    <div id={`${elementId}`} className={`search-field tags`}>
                        <div className="include">
                            <input type="checkbox"
                                id={`${elementId}_tags${tc.id}_include`}
                                name={`${elementId}_tags${tc.id}_include`}
                                onChange={() => toggleInclude(tc.id)}
                                checked={isIncluded(tc.id)} />
                        </div>
                        <div className="field-name"><label htmlFor={`${elementId}_include`}>{`Tags - ${tc.name}`}</label></div>
                        {searchColumns(tc)}
                        <div className="sort-by">
                            <></>
                        </div>
                    </div>
                );
            })
        }
        </>
    );

};

export default TagSearchField;

