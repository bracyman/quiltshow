import { HangingUnit } from "./hangingUnit/HangingUnit";


export class Room {

    constructor(name, description, width, length, gridSize, hangingUnits, groups) {
        this.name = name || `room-${Date.now()}`;
        this.description = description;
        this.width = width || 80;
        this.length = length || 40;
        this.gridSize = gridSize || 2;
        this.hangingUnits = hangingUnits || [];
        this.groups = groups || [];
    }

    addHangingUnit(hangingUnit) {
        this.hangingUnits.push(hangingUnit);
    }

    removeHangingUnit(hangingUnit) {
        let index = this.hangingUnits.indexOf(hangingUnit);

        if (index >= 0) {
            this.hangingUnits.splice(index, 1);
        }
    }

    addGroup(group) {
        this.groups.push(group);
    }

    removeGroup(group) {
        let index = this.groups.indexOf(group);

        if (index >= 0) {
            this.groups.splice(index, 1);
        }
    }

    /**
     * 
     * @param {number | object | HangingUnit} identifier the id of the group, or an object containing the id or name of the group to find, or a Hanging Unit in the desired group
     * @returns the group(s) that match the find criteria
     */
    getGroup(identifier) {

        if (identifier instanceof HangingUnit) {
            return this.groups.filter(g => g.contains(identifier));
        }

        let field = "id";
        let val = identifier;

        if (typeof identifier === "object") {
            if (identifier.id) {
                field = "id";
                val = identifier.id;
            }
            else {
                field = "name";
                val = identifier.name;
            }
        }
        let found = this.groups.filter(g => g[field] === val);
        return found;
    }


    /**
     * 
     * @param {number | object } hangingUnit the id of the hanging unit, or an object containing the id or name of the hanging unit to find
     * @returns the specified hanging unit
     */
    getHangingUnit(hangingUnit) {
        let field = "id";
        let val = hangingUnit;

        if (typeof hangingUnit === "object") {
            if (hangingUnit.id) {
                field = "id";
                val = hangingUnit.id;
            }
            else {
                field = "name";
                val = hangingUnit.name;
            }
        }
        let found = this.hangingUnits.filter(u => u[field] === val);
        if (found.length > 0) {
            return found[0];
        }

        return null;
    }


    handleAnnouncement(source, event, message) {

    }

}