import Config from "./Config";
import AuthService from "./AuthService";

class ApiService {
    stringify(obj) {
        let cache = [];
        let str = JSON.stringify(obj, function(key, value) {
            if (typeof value === "object" && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference found, discard key
                    return;
                }
              
                // Store value in our collection
                cache.push(value);
            }
            
            return value;
        });   
  
        cache = null; // reset the cache
        return str;
    }

    async get(url) {
        return await fetch(`${Config.apiHost()}/${url}`, {
            method: "GET",
            headers: AuthService.authHeader(),
        });
    }

    async post(url, bodyObj) {
        var headers = {
            ...(AuthService.authHeader()),
            "Content-Type": "application/json"
        };
        return await fetch(`${Config.apiHost()}/${url}`, {
            method: "POST",
            headers: headers,
            body: this.stringify(bodyObj),
        });
    }

    async put(url, bodyObj) {
        var headers = {
            ...(AuthService.authHeader()),
            "Content-Type": "application/json"
        };
        return await fetch(`${Config.apiHost()}/${url}`, {
            method: "PUT",
            headers: headers,
            body: this.stringify(bodyObj),
        });
    }

    async patch(url, bodyObj) {
        var headers = {
            ...(AuthService.authHeader()),
            "Content-Type": "application/json"
        };
        return await fetch(`${Config.apiHost()}/${url}`, {
            method: "PATCH",
            headers: headers,
            body: this.stringify(bodyObj),
        });
    }

    async delete(url) {
        return await fetch(`${Config.apiHost()}/${url}`, {
            method: "DELETE",
            headers: AuthService.authHeader(),
        });
    }

}


export default new ApiService();