

export const CategoryFields = [
    { field: "name", name: "Name" },
    { field: "shortDescription", name: "Short Description" },
    { field: "description", name: "Full Description", dataType: "longString" },
    { field: "importance", name: "Importance", dataType: "number" },
    { field: "fun", name: "Fun", dataType: "boolean" },
    { field: "strange", name: "Strange", dataType: "string", displayFunction: (v) => v.toUpperCase() },
];

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