

export const CategoryFields = [
    { field: "name", name: "Name" },
    { field: "shortDescription", name: "Short Description" },
    { field: "description", name: "Full Description", dataType: "longString" },
    { field: "importance", name: "Importance", dataType: "number" },
    { field: "fun", name: "Fun", dataType: "boolean" },
    { field: "strange", name: "Strange", dataType: "string", displayFunction: (v) => v.toUpperCase() },
];

export const QuiltFields = {
    id: { label: "ID", type: "string", example: "15",},
    number: { label: "Number", type: "number", example: "1027",},
    name: { label: "Name", type: "string", example: "Flower Fairies",},
    description: { label: "Description", type: "longString", example: "I made this quilt for my granddaughter Hyacinth. Her favorite book is an old breakdown of how to find fairies in English gardens, and I tried to capture the spirit of the watercolor illustrations.",},
    category: { label: "Category", type: "category", example: "Extra Large",},
    tags: { label: "Tags", type: "list(tag)", example: "Hand-stitched,Applique",},
    judged: { label: "Judged", type: "boolean", example: "Yes",},
    length: { label: "Height", type: "number", example: "84",},
    width: { label: "Width", type: "number", example: "45",},
    firstShow: { label: "First Show", type: "boolean", example: "No",},
    groupSize: { label: "Group Size", type: "groupSize", example: "Duet",},
    mainColor: { label: "Main Color", type: "string", example: "Blue",},
    designSource: { label: "Design Source", type: "designSource", example: "Magazine (Quilter's Dream)",},
    enteredBy: { label: "Submitted By", type: "string", example: "Mary Sue",},
    additionalQuilters: { label: "Additional Quilters", type: "string", example: "Libby Masters, Beth Anne",},
    submittedOn: { label: "Submitted", type: "date", example: "02/15/23",},
    awards: { label: "Awards", type: "list(award)", example: "2nd Place - Hand Quilted, Judge's Choice",},    
};

export const MatchTypes = {
    contains: "CONTAINS",
    equals: "EQUALS",
    gt: "GREATER_THAN",
    lt: "LESS_THAN",
    oneOf: "ONE_OF",
    allOf: "ALL_OF",
    between: "BETWEEN",
};

class ObjectUtils {

    /** Determines if the parameter is an Object type */
    isObject(param) {
        if(param) {
            return Object.prototype.toString.call( param ) === '[object Object]';
        }

        return false;
    }

    /** Determines if the parameter is an Array type */
    isArray(param) {
        if(param) {
            return Object.prototype.toString.call( param ) === '[object Array]';
        }

        return false;
    }

    /** Determines if the parameter is a Function type */
    isFunction(param) {
        if(param) {
            return Object.prototype.toString.call( param ) === '[object Function]';
        }

        return false;
    }

    /** Determines if the parameter is a String type */
    isString(param) {
        if(param) {
            return Object.prototype.toString.call( param ) === '[object String]';
        }

        return false;
    }

    /** Determines if the parameter is a Boolean type */
    isBoolean(param) {
        if(param) {
            return Object.prototype.toString.call( param ) === '[object Boolean]';
        }

        return false;
    }

    /** Determines if the parameter is a Date type */
    isDate(param) {
        if(param) {
            return Object.prototype.toString.call( param ) === '[object Date]';
        }

        return false;
    }

    /** Determines if the parameter is a Number type */
    isNumber(param) {
        if(param) {
            return Object.prototype.toString.call( param ) === '[object Number]';
        }

        return false;
    }
}

export default new ObjectUtils();