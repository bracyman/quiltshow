import Config from "./Config";
import { encode as base64_encode } from "base-64";

class AuthService {
    verifyUser(username) {
        return true;
    }

    async login(username, password) {
        let basicAuth = base64_encode(`${username}:${password}`);
        let res = await fetch(`${Config.apiHost()}/token`, {
            method: "POST",
            headers: new Headers({
                Authorization: `Basic ${basicAuth}`,
            }),
        })
        .then((response) =>  {
            if(!response.ok) {
                throw new Error(response.statusText);  
            }

            return response.json();
        })
        .then(tokenRespose => {
            if(tokenRespose.accessToken) {
                localStorage.setItem("user", JSON.stringify(tokenRespose));
                return true;
            }

            return false;
        })
        .catch((error) => {
            console.log("Login failure: " + error);
            return false;
        });

        return res;
    }

    async register(newPerson) {
        await fetch(`${Config.apiHost()}/register`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(newPerson),
        })
        .then(tokenRespose => {
            if(tokenRespose.accessToken) {
                localStorage.setItem("user", JSON.stringify(tokenRespose));
            }
        });  
    }

    authHeader(headers) {
        let authHeaders = headers ? headers : {};
        let usr = JSON.parse(localStorage.getItem("user"));
        return (usr && usr.accessToken) ? {...authHeaders,  Authorization: `Bearer ${usr.accessToken}` } : authHeaders;
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem("user")?.user);
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
