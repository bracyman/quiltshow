import Config from "./Config";
import { encode as base64_encode } from "base-64";

class AuthService {
    login(username, password) {
        let basicAuth = base64_encode(`${username}:${password}`);
        fetch(`${Config.apiHost()}/token`, {
            method: "POST",
            headers: new Headers({
                Authorization: `Basic ${basicAuth}`,
            }),
        })
        .then(response => {
            if(response.data.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            return response.data;
        });
    }

    register(newPerson) {
        fetch(`${Config.apiHost()}/register`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(newPerson),
        })
        .then(response => {
            if(response.data.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }
        });  
    }

    authHeader() {
        let usr = JSON.parse(localStorage.getItem("user"));
        return (usr && usr.accessToken) ? { Authorization: `Bearer${usr.accessToken}` } : {};
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem("user"));
    }

    logout() {
        localStorage.removeItem("user");
    }

    loggedIn() {
        let usr = localStorage.getItem("user");
        return localStorage.getItem("user") !== null;
    }
}


export default new AuthService();
