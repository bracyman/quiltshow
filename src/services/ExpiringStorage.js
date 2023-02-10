import Config from "./Config";

class ExpiringStorage {

    getItem(item) {
        var value = localStorage.getItem(item);

        if(this.isEmpty(value)) {
            return null;
        }

        let obj = JSON.parse(value);
        if(this.isExpired(obj)) {
            this.removeItem(item);
            return null;
        }

        return obj.value;
    }

    setItem(item, value, duration) {
        const obj = {
            value: value,
            ts: Date.now(),
            expires: true,
            duration: duration
        }
        localStorage.setItem(item, JSON.stringify(obj));
    }

    setItemForever(item, value) {
        const obj = {
            value: value,
            expires: false
        };

        localStorage.setItem(item, JSON.stringify(obj));
    }

    removeItem(item) {
        localStorage.removeItem(item);
    }


    isEmpty(value) {
        return (value === null) || (value === undefined) || (value === "null") || (value === "undefined") || (value === "");
    }

    isExpired(obj) {
        if(!obj.expires) {
            return false;
        }

        let millis = Date.now() - obj.ts;

        return (millis > Config.MAX_STORAGE_TIME());
    }

    clear() {
        localStorage.clear();
    }
}

export default new ExpiringStorage();