import Config from "./Config";
import AuthService from "./AuthService";

class QuiltService {
    /**
     * Fetches the quilts that were submitted by the current user (or all quilts if the user is an administrator)
     * @returns 
     */
    fetchQuilts() {
        fetch(`${Config.apiHost()}/quilts`, {
            method: "GET",
            headers: AuthService.authHeader(),
        })
        .then(response => {
            if(response.ok) {
                return response.data;
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
        if( quilt.name &&
            quilt.description && 
            quilt.width && 
            quilt.length && 
            quilt.piecedBy)
            return true;

        return false;
    }

    /**
     * Submits a new quilt to the show
     * @param {*} newQuilt 
     */
    addQuilt(newQuilt) {
        fetch(`${Config.apiHost()}/quilts`, {
            method: "POST",
            headers: AuthService.authHeader(),
            body: JSON.stringify(newQuilt),
        })
        .then(response => {
            if(response.ok) {
                return response.data;
            }

            return null;
        });    
    }

    /**
     * Updates the values of an existing quilt
     * @param {*} updatedQuilt 
     */
    updateQuilt(updatedQuilt) {
        fetch(`${Config.apiHost()}/quilts/${updatedQuilt.id}`, {
            method: "PATCH",
            headers: AuthService.authHeader(),
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
    deleteQuilt(id) {
        fetch(`${Config.apiHost()}/quilts/${id}`, {
            method: "DELETE",
            headers: AuthService.authHeader(),
        })
        .then(response => {
            return response.ok;
        });           
    };

}

export default new QuiltService();