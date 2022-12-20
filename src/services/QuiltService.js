import Config from "./Config";
import AuthService from "./AuthService";
import ApiService from "./ApiService";

class QuiltService {
    /**
     * Fetches the quilts that were submitted by the current user (or all quilts if the user is an administrator)
     * @returns 
     */
    async fetchQuilts() {
        return await ApiService.get(`${Config.apiHost()}/quilts`, {
            method: "GET",
            headers: AuthService.authHeader(),
        })
        .then(response => {
            if(response.ok) {
                return response.json();
            }

            return null;
        });
    }
    
    /**
     * Verifies all necessary fields have been filled with a valid value
     * @param {*} quilt 
     * @returns true if quilt is valid, false otherwise
     */
    validateQuilt(quilt) {
        if(quilt.name && quilt.description && quilt.width && quilt.length) {
            return true;
        }

        return false;
    }

    /**
     * Submits a new quilt to the show
     * @param {*} newQuilt 
     */
    async addQuilt(newQuilt) {
        return await ApiService.post(`${Config.apiHost()}/quilts`, newQuilt)
        .then((response) => response.json())
        .then(response => {
            return response;
        });    
    }

    /**
     * Updates the values of an existing quilt
     * @param {*} updatedQuilt 
     */
    async updateQuilt(updatedQuilt) {
        return fetch(`${Config.apiHost()}/quilts/${updatedQuilt.id}`, {
            method: "PUT",
            headers: AuthService.authHeader({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(updatedQuilt),
        })
        .then(response => {
            if(response.ok) {
                return response.data;
            }

            return null;
        });    
    }

    /**
     * Removes a quilt from the show
     * @param {*} id 
     */
    async deleteQuilt(id) {
        return await fetch(`${Config.apiHost()}/quilts/${id}`, {
            method: "DELETE",
            headers: AuthService.authHeader(),
        })
        .then(response => {
            return response.ok;
        });           
    };

}

export default new QuiltService();