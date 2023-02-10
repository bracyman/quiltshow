

class DateUtils {

    getYear(date) {
        if(!date) {
            return null;
        }

        return new Date(date).getYear() + 1900;
    }

    format(date) {
        if(!date) {
            return "";
        }

        let d = new Date(date);
        return d.toLocaleString("default", {dateStyle: "long"});
    }
}

export default new DateUtils();