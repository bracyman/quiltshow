
import SearchField from "./SearchField";


const SearchQuilts = (props) => {
    const { show, search, updateSearch } = props;

    const params = {
        search: search,
        updateSearch: updateSearch,
    };

    return (
        <div id="searchFields">
            <div className="header">
                <div className="include">Include</div>
                <div className="field-name">Field</div>
                <div className="matches">Matches</div>
                <div className="match-type">Match Type</div>
                <div className="sort-by">Sort By</div>
            </div>
            <SearchField { ...params } field="name" />
            <SearchField { ...params } field="number" />
            <SearchField { ...params } field="category" options={show?.categories} />
            <SearchField { ...params } field="length" />
            <SearchField { ...params } field="width" />
            <SearchField { ...params } field="judged" />
            <SearchField { ...params} field="tags" options={show?.tagCategories?.reduce((acc, tc) => [...acc, ...(tc.tags || [])], [])} />
            <SearchField { ...params} field="count" dataType="number" />
        </div>
    );

};

export default SearchQuilts;

