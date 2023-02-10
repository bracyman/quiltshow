import Config from "./Config";
import { encode as base64_encode } from "base-64";
import ExpiringStorage from "./ExpiringStorage"



const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
};


class AuthService {
    async verifyUser(username) {
        let res = await fetch(`${Config.apiHost()}/verify/${encodeURIComponent(username)}`, {
            method: "GET",
        })
        .then((response) => {
            if(response.ok) {
                return response.json();
            }

            return false;
        });

        return res;
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
                ExpiringStorage.setItem("user", tokenRespose);
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
        const userCreated = await fetch(`${Config.apiHost()}/register`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(newPerson),
        })
        .then((response) =>  {
            if(!response.ok) {
                throw new Error(response.statusText);  
            }

            return response.json();
        })
        .then(tokenRespose => {
            if(tokenRespose.accessToken) {
                ExpiringStorage.setItem("user", tokenRespose);
                return true;
            }

            return false;
        });  

        return userCreated;
    }

    authHeader(headers) {
        let authHeaders = headers ? headers : {};
        let usr = ExpiringStorage.getItem("user");
        return (usr && usr.accessToken) ? {...authHeaders,  Authorization: `Bearer ${usr.accessToken}` } : authHeaders;
    }

    getCurrentUser() {
        return ExpiringStorage.getItem("user");
    }

    userHasRole(role) {
        let usr = ExpiringStorage.getItem("user");
        if(usr === null) {
            return false;
        }

        let jwt = parseJwt(usr.accessToken);
        return jwt.scope.includes(`ROLE_${role.toUpperCase()}`);
    }

    logout() {
        ExpiringStorage.clear();
    }
    

    loggedIn() {
        let usr = ExpiringStorage.getItem("user");
        if(usr === null) {
            return false;
        }

        let jwt = parseJwt(usr.accessToken);
        let expires = jwt.exp * 1000;

        return expires > Date.now();
    }
}


export default new AuthService();
