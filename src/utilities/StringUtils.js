
const listType = (type) => {
    return type.substring("list(".length, type.lastIndexOf(")"));
};

const isList = (type) => {
    return type && (type.startsWith("list(") || type.endsWith("[]"));
};

const numberFormat = new Intl.NumberFormat('en-EN', { maximumFractionDigits: 2, minimumFractionDigits: 0 });
const currencyFormat = new Intl.NumberFormat('en-EN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });

class StringUtils {

    /**
     * Converts a string to a value that can be used as component ID, 
     * removing any spaces or invalid characters
     * @param {*} str 
     */
    idIfy(str) {
        return str ? str.replaceAll(/[^a-zA-Z0-9]/ig, '_') : str;
    }

    toString(data, type) {
        if ((data === undefined) || (data === null)) {
            return "";
        }

        if (isList(type)) {
            return data.map(d => this.toString(d, listType(type))).join(", ");
        }

        switch (type) {
            case "category": return data.name;
            case "tag": return data.name;
            case "boolean": return data ? "Yes" : "No";
            case "groupSize": return data.name;
            case "designSource": return `${data.designSourceType} (${data.name})`;
            case "date": return this.dateToString(data);
            case "award": return data.name;
            case "number": return `${numberFormat.format(data)}`;
            case "currency": return "$" + currencyFormat.format(data);
            default:
                return `${data}`;
        }
    }

    dateToString(date) {
        if (date instanceof Date) {
            return date.toDateString();
        }

        return new Date(date).toDateString();
    }
}

export default new StringUtils();