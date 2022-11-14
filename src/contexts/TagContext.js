import {useState, createContext} from 'react';

export const TagContext = createContext();


const TagContextProvider = (props) => {
    const [quiltTags, setQuiltTags] = useState([
        {"id":1,"name":"Special Event", "description": "Made for a special event"},
        {"id":2,"name":"Christmas", "description": "This is a gift"},
        {"id":3,"name":"President's Challenge", "description": "Made for the president's challenge"},
    ]);

    return (
        <TagContext.Provider value={{ quiltTags }}>
            {props.children}
        </TagContext.Provider>
    )
}

export default TagContextProvider;