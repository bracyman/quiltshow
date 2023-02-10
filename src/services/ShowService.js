import AuthService from "./AuthService";
import ApiService from "./ApiService";
import ExpiringStorage from "./ExpiringStorage";

class ShowService {

    showOrderComparator(s1, s2) {
        if(s1.active && !s2.active) {
            return 1;
        }
        if(!s1.active && s2.active) {
            return -1;
        }

        if(s1.startDate > s2.startDate) {
            return 1;
        }

        if(s1.startDate < s2.startDate) {
            return -1;
        }

        return 0;
    }

    /**
     * Fetches the available shows
     * @returns 
     */
     async fetchShows() {
        return await ApiService.get(`shows/`, {
            method: "GET",
            headers: AuthService.authHeader(),
        })
        .then(response => {
            if(response.ok) {
                return response.json();
            }

            return null;
        })
        .then(response => {
            if(response != null) {
                return response.sort(this.showOrderComparator);
            }

            return [];
        });
    }

    async setSelectedShow(showId) {
        let show = await this.fetchShow(showId);

        ExpiringStorage.setItem("selectedShowId", showId);
        ExpiringStorage.setItem("selectedShow", JSON.stringify(show));

        return show;
    }

    async getSelectedShow() {
        let show = ExpiringStorage.getItem("selectedShow");

        // if now show has been selected, set to default
        if(!show || show === "null") {
            return await this.setSelectedShow(this.getSelectedShowId() || "current");
        }
        else {
            return JSON.parse(show);
        }
    }

    getSelectedShowId() {
        let selectedId = ExpiringStorage.getItem("selectedShowId");
        if(selectedId === "undefined" || selectedId === "null") {
            return null;
        }

        return selectedId;
    }

    async fetchShow(showId) {
        if(!showId) {
            showId = this.getSelectedShowId() || "current";
        }

        return await ApiService.get(`shows/${showId}`, {
            method: "GET",
            headers: AuthService.authHeader(),
        })
        .then(response => {
            if(response.ok) {
                return response.json();
            }

            return null;
        })
        .then(response => {
            if(response == null) {
                return null;
            }

            return response;
        });
    }

    async fetchCategories(showId) {
        let url = showId ? `showId/${showId}/categories` : "shows/categories";

        let categories = await ApiService.get(`${url}`, {
            method: "GET",
            headers: AuthService.authHeader(),
        })
        .then(response => {
            if(response.ok) {
                return response.json();
            }

            return null;
        }).then(response => {
            if(response == null) {
                return null;
            }

            return response;
        });
        
        return categories;
    }
}

export default new ShowService();