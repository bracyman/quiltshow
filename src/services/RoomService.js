
import ApiService from "./ApiService";


class RoomService {

    /* ********************************************************************* */
    //    Room functions
    /* ********************************************************************* */
    async getRooms() {
        return await this.getRoomsPromise()
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

    getRoomsPromise() {
        return ApiService.get("rooms");
    }

    async getRoom(roomId) {
        return await ApiService.get(`rooms/${roomId}`)
            .then(response => {
                if(response.ok) {
                    return response.json();
                }

                return null;
            });
    }

    async saveRoom(room) {
        room.hangingUnits.forEach(unit => {
            if(this.isTempId(unit.id)) {
                unit.id = null;
            }
        });
        if(room.id) {
            return await ApiService.put(`rooms/${room.id}`, room)
                .then(response => {
                    if(response.ok) {
                        return response.json();
                    }

                    return null;
                });
            } 
            else {
                return await ApiService.post(`rooms/`, room)
                .then(response => {
                    if(response.ok) {
                        return response.json();
                    }

                    return null;
                });
            }
    }

    async deleteRoom(roomId) {
        return await ApiService.delete(`rooms/${roomId}`)
            .then(response => {
                if(response.ok) {
                    return true;
                }

                return false;
            });
    }


    /* ********************************************************************* */
    //    Hanging Unit functions
    /* ********************************************************************* */
    async getHangingUnits(roomId) {
        return await ApiService.get(`rooms/${roomId}/hanging-units`)
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

    async getHangingUnit(roomId, unitId) {
        return await ApiService.get(`rooms/${roomId}/hanging-units/${unitId}`)
            .then(response => {
                if(response.ok) {
                    return response.json();
                }

                return null;
            });
    }

    async saveHangingUnit(roomId, hangingUnit) {
        if(this.isTempId(hangingUnit.id)) {
            hangingUnit.id = null;
        }

        if(hangingUnit.id) {
            return await ApiService.put(`rooms/${roomId}/hanging-units/${hangingUnit.id}`, hangingUnit)
                .then(response => {
                    if(response.ok) {
                        return response.json();
                    }

                    return null;
                });
            } 
            else {
                return await ApiService.post(`rooms/${roomId}/hanging-units/`, hangingUnit)
                .then(response => {
                    if(response.ok) {
                        return response.json();
                    }

                    return null;
                });
            }
    }

    async deleteHangingUnit(roomId, hangingUnitId) {
        return await ApiService.delete(`rooms/${roomId}/hanging-units/${hangingUnitId}`)
            .then(response => {
                if(response.ok) {
                    return true;
                }

                return false;
            });
    }



    /* ********************************************************************* */
    //    Wall hanging functions
    /* ********************************************************************* */
    async hangQuilt(wallId, hangingLocation) {
        return await ApiService.post(`rooms/walls/${wallId}`, hangingLocation)
            .then(response => {
                if(response.ok) {
                    return response.json();
                }

                return null;
            });
    }

    async updateQuiltLocation(quiltId, location) {
        return await ApiService.patch(`rooms/quilts/${quiltId}`, location)
            .then(response => {
                if(response.ok) {
                    return response.json();
                }

                return null;
            });
    }

    async unhangQuilt(quiltId) {
        return await ApiService.delete(`rooms/quilts/${quiltId}`)
            .then(response => {
                if(response.ok) {
                    return true;
                }

                return false;
            });
    }


    getTempId() {
        return `new ${Date.now()}`;
    }

    isTempId(id) {
        return !id || id.toString().startsWith("new");
    }

}

export default new RoomService();