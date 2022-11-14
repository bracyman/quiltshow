import {useState, createContext} from 'react';

export const QuiltContext = createContext();
export const EMPTY_QUILT = {
    id: null,
    name: "",
    description: "",
    category: null,
    tags: [],
    length: null,
    width: null,
    piecedBy: null,
    quiltedBy: null,
    judged: false
  };

const QuiltContextProvider = (props) => {
    const [quilts, setQuilts] = useState([
        {"id":1,"name":"SuperQuilt","description":"A super quilt","tags":[],"length":33,"width":42,"piecedBy":"Mary Sue","quiltedBy":"Mary Sue"}
    ]);

    var identifier = quilts.length > 0 ? Math.max(quilts.map(q => q.id)) + 1 : 1;


    const validateQuilt = (quilt) => {
        if( quilt.name &&
            quilt.description && 
            quilt.width && 
            quilt.length && 
            quilt.piecedBy)
            return true;

        return false;
    };

    const addQuilt = (newQuilt) => {
        setQuilts([...quilts, {...newQuilt, id: identifier++}]);
    };

    const updateQuilt = (updatedQuilt) => {
        setQuilts(quilts.map((quilt) => quilt.id === updatedQuilt.id ? updatedQuilt : quilt));
    };

    const deleteQuilt = (id) => {
        setQuilts(quilts.filter((quilt) => quilt.id !== id));
    };

    return (
        <QuiltContext.Provider value={{quilts, addQuilt, validateQuilt, updateQuilt, deleteQuilt}}>
            {props.children}
        </QuiltContext.Provider>
    )
}

export default QuiltContextProvider;