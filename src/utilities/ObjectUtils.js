


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
        if (param) {
            return Object.prototype.toString.call(param) === '[object Object]';
        }

        return false;
    }

    /** Determines if the parameter is an Array type */
    isArray(param) {
        if (param) {
            return Object.prototype.toString.call(param) === '[object Array]';
        }

        return false;
    }

    /** Determines if the parameter is a Function type */
    isFunction(param) {
        if (param) {
            return Object.prototype.toString.call(param) === '[object Function]';
        }

        return false;
    }

    /** Determines if the parameter is a String type */
    isString(param) {
        if (param) {
            return Object.prototype.toString.call(param) === '[object String]';
        }

        return false;
    }

    /** Determines if the parameter is a Boolean type */
    isBoolean(param) {
        if (param) {
            return Object.prototype.toString.call(param) === '[object Boolean]';
        }

        return false;
    }

    /** Determines if the parameter is a Date type */
    isDate(param) {
        if (param) {
            return Object.prototype.toString.call(param) === '[object Date]';
        }

        return false;
    }

    /** Determines if the parameter is a Number type */
    isNumber(param) {
        if (param) {
            return Object.prototype.toString.call(param) === '[object Number]';
        }

        return false;
    }

    isNull(param) {
        return (param === undefined) || (param === null);
    }
}

export default new ObjectUtils();