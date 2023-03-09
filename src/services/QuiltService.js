import AuthService from "./AuthService";
import ApiService from "./ApiService";
import ObjectUtils from "../utilities/ObjectUtils";

class QuiltService {
  /**
   * Fetches the quilts that were submitted by the current user (or all quilts if the user is an administrator)
   * @returns
   */
  async fetchQuilts() {
    return await ApiService.get(`quilts`, {
      method: "GET",
      headers: AuthService.authHeader(),
    }).then((response) => {
      if (response.ok) {
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
  validateQuilt(quilt, show) {
    let requiredFields = [
      quilt.name,
      quilt.description,
      quilt.width,
      quilt.length,
      quilt.groupSize,
      quilt.designSource,
      quilt.category,
    ];

    if (
      requiredFields.filter((f) => f === null || f === undefined).length > 0
    ) {
      return false;
    }

    if (show?.tagCategories) {
      for (let i = 0; i < show.tagCategories.length; i++) {
        let tc = show.tagCategories[i];
        let tagIds = tc.tags.map((t) => t.id);
        let quiltTagsIds = (quilt.tags || []).map((t) => t.id);

        if (tc.requireOne) {
          let found = false;
          quiltTagsIds.forEach((id) => (found = found || tagIds.includes(id)));
          if (!found) {
            return false;
          }
        } else if (tc.onlyOne) {
          if (tagIds.filter((tId) => quiltTagsIds.includes(tId)).length > 1) {
            return false;
          }
        }
      }
    }

    return true;
  }

  isNull(fields) {
    if (fields === null || fields === undefined) {
      return true;
    }

    if (ObjectUtils.isArray) {
      return;
    } else return false;
  }

  /**
   * Submits a new quilt to the show
   * @param {*} newQuilt
   */
  async addQuilt(newQuilt) {
    return await ApiService.post(`quilts`, newQuilt)
      .then((response) => response.json())
      .then((response) => {
        return response;
      });
  }

  /**
   * Updates the values of an existing quilt
   * @param {*} updatedQuilt
   */
  async updateQuilt(updatedQuilt) {
    return await ApiService.put(`quilts/${updatedQuilt.id}`, updatedQuilt).then(
      (response) => {
        if (response.ok) {
          return response.data;
        }

        return null;
      }
    );
  }

  /**
   * Removes a quilt from the show
   * @param {*} id
   */
  async deleteQuilt(id) {
    return await ApiService.delete(`quilts/${id}`).then((response) => {
      return response.ok;
    });
  }


  /**
   * Returns the amount due to be paid
   */
  async getAmountDue() {
    return await ApiService.get(`quilts/total-due`).then((response) => {
      if (response.ok) {
        return response.json();
      }

      return null;
    });
  }


  /**
   * Creates a remote payment, and returns a link to the payment portal
   */
  async createPayment() {
    return await ApiService.get(`quilts/pay`).then((response) => {
      if (response.ok) {
        return response.text();
      }

      return null;
    });
  }
}

export default new QuiltService();
