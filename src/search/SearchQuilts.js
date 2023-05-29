
import { QuiltFields } from "../components/quilts/QuiltFields";
import SearchField from "./SearchField";
import TagSearchField from "./TagSearchField";


const SearchQuilts = (props) => {
    const { show, search, updateSearch } = props;

    const params = {
        search: search,
        updateSearch: updateSearch,
        show: show,
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
            <SearchField {...params} field="number" />
            <SearchField {...params} field="name" />
            <SearchField {...params} field="category" options={show?.categories} />
            <SearchField {...params} field="enteredBy" />
            <SearchField {...params} field="groupSize" />
            <SearchField {...params} field="width" />
            <SearchField {...params} field="length" />
            <SearchField {...params} field="perimeter" />
            <SearchField {...params} field="judged" />
            <SearchField {...params} field="presidentsChallenge" />
            <SearchField {...params} field="mainColor" />
            <SearchField {...params} field="hangingPreference" />
            <SearchField {...params} field="additionalQuilters" />
            <SearchField {...params} field="designSource" />
            <TagSearchField {...params} field="tags" />
            <SearchField {...params} field="count" dataType="number" />
        </div>
    );

};

export default SearchQuilts;

