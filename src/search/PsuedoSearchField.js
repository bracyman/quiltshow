

const PsuedoSearchField = (props) => {
    const { id, field, search, updateSearch } = props;
    const elementId = id || field + "_search";
    const included = search.fields.includes(field);

    const toggleInclude = (evt) => {
        let fields = null;

        if(included) {
            let newOrder = search.sortOrder ? search.sortOrder.filter(f => f !== field) : [];
            fields = search.fields.filter(f => f !== field);
            updateSearch({ ...search, fields: fields, sortOrder: newOrder }) ;
        }
        else {
            let newField = {};
            newField[field]= { };

            fields = [...search.fields, field];
            if(search[field]) {
                newField[field] = { ...search[field], ...newField };
            }

            updateSearch({ ...search, ...newField, fields: fields }) ;
        }
    };

    const updateSort = (order) => {
        let newOrder = search.sortOrder ? search.sortOrder.filter(f => f && f !== field) : [];
        let newSortPosition = parseInt(document.getElementById(`${elementId}_sort`).value);

        if(newSortPosition > 0) {
            if(newSortPosition > search.sortOrder.length) {
                newOrder.push(field);
            }
            else {
                newOrder.splice(newSortPosition-1, 0, field);
            }
        }
        
        updateSearch({ ...search, sortOrder: newOrder });
    };


    return (
        <div id={`${elementId}`} className="search-field psuedo">
            <div className="include"><input type="checkbox" id={`${elementId}_include`} name={`${elementId}_include`} onChange={toggleInclude} checked={included}/></div>
            <div className="field-name">{field}</div>
            <div className="matches"></div>
            <div className="match-type"></div>
            <div className="sort-by">{search.fields.includes(field) 
                ? <input type="number" id={`${elementId}_sort`} onChange={updateSort} value={search.sortOrder.indexOf(field)+1}/>
                : <></>
            } </div>
        </div>
    );

};

export default PsuedoSearchField;