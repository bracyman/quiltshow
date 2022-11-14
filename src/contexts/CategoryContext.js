import {useState, createContext} from 'react';

export const CategoryContext = createContext();


const CategoryContextProvider = (props) => {
    const [categories, setCategories] = useState([
        {"id":1,"name":"Small","shortDescription":"0 to 10 sq inches", "description": "really small"},
        {"id":2,"name":"Medium","shortDescription":"11 to 1000 sq inches", "description": "pretty average"},
        {"id":3,"name":"Large","shortDescription":"1001 to 100,000 sq inches", "description": "friggin' huge"},
    ]);

    return (
        <CategoryContext.Provider value={{ categories }}>
            {props.children}
        </CategoryContext.Provider>
    )
}

export default CategoryContextProvider;