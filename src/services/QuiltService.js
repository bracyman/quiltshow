import AuthService from "./AuthService";
import ApiService from "./ApiService";

class QuiltService {
    /**
     * Fetches the quilts that were submitted by the current user (or all quilts if the user is an administrator)
     * @returns 
     */
    async fetchQuilts() {
        return await ApiService.get(`quilts`, {
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
        return await ApiService.post(`quilts`, newQuilt)
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
        return await ApiService.put(`quilts/${updatedQuilt.id}`, updatedQuilt)
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
        return await ApiService.delete(`quilts/${id}`)
        .then(response => {
            return response.ok;
        });           
    };

}

export default new QuiltService();