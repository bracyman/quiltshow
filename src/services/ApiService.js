import Config from "./Config";
import AuthService from "./AuthService";

class ApiService {
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
            body: JSON.stringify(bodyObj),
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
            body: JSON.stringify(bodyObj),
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