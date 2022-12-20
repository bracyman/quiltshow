
import AuthService from "./AuthService";

class ApiService {
    async get(url) {
        return await fetch(url, {
            method: "GET",
            headers: AuthService.authHeader(),
        });
    }

    async post(url, bodyObj) {
        var headers = {
            ...(AuthService.authHeader()),
            "Content-Type": "application/json"
        };
        return await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(bodyObj),
        });
    }
}


export default new ApiService();