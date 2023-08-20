
import ApiService from "./ApiService";
import ObjectUtils from "../utilities/ObjectUtils";


export const IN_PROGRESS_REPORT = `in_progress`;

class ReportService {

    async getReports() {
        return await ApiService.get("reports")
            .then(response => {
                if(response.ok) {
                    return response.json();
                }

                return null;
            })
            .then(response => {
                if(response == null) {
                    return [];
                }

                return response;
            });
    }

    async getReport(reportId) {
        return await ApiService
            .get(`reports/report/${reportId}`)
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

    async saveReport(report) {
        return await ApiService.post(`reports/report`, report)
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

    async runReport(report) {
        // if they've passed in an object, run the report passed in
        if(ObjectUtils.isObject(report)) {
            return await ApiService.post(`reports/trial/search`, report)
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

        // otherwise, run the report by ID
        else {
            return await ApiService.get(`reports/trial/report/${report}/run`)
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
    }

    async demoReport(report) {
        // if they've passed in an object, run the report passed in
        if(ObjectUtils.isObject(report)) {
            return await ApiService.post(`reports/demo`, report)
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

        // otherwise, run the report by ID
        else {
            return await ApiService.get(`reports/trial/report/${report}/demo`)
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
    }
    
    async deleteReport(reportId) {
        return await ApiService.delete(`reports/report/${reportId}`)
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
}

export default new ReportService();