import AuthService from "./AuthService";
import ApiService from "./ApiService";
import ExpiringStorage from "./ExpiringStorage";

class AwardService {

    /**
     * Fetches all awards
     * @returns 
     */
     async fetchAwards(showId) {
        return await ApiService.get(`shows/${showId}/awards`, {
            method: "GET",
            headers: AuthService.authHeader(),
        })
        .then(response => {
            if(response.ok) {
                return response.json();
            }

            return [];
        })
        .then(response => {
            return response;
        });
    }

    async fetchCategoryAwards(showId, categoryId) {
        return await ApiService.get(`shows/${showId}/awards/category/${categoryId}/assignments`, {
            method: "GET",
            headers: AuthService.authHeader(),
        })
        .then(response => {
            if(response.ok) {
                return response.json();
            }

            return [];
        })
        .then(response => {
            return response;
        });
    }

    async assignAwardToQuiltNumbers(showId, awardId, quiltNumbers) {
        return await ApiService.post(`shows/${showId}/awards/${awardId}/assign/number`, quiltNumbers).then((response) => {
            if(response.ok) {
              return true;
            }
      
            return false;
          });
    }

    async assignAwardToQuiltIds(showId, awardId, quiltIds) {
        return await ApiService.post(`shows/${showId}/awards/${awardId}/assign/id`, quiltIds).then((response) => {
            if(response.ok) {
              return true;
            }
      
            return false;
          });
    }

}

export default new AwardService();