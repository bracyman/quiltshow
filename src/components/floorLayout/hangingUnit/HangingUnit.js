import ObjectUtils from "../../../utilities/ObjectUtils";
import StringUtils from "../../../utilities/StringUtils";

export const Facing = {
    NORTH: 0,
    EAST: 90,
    WEST: 270,
    SOUTH: 180,
};

export const WALL   = "WALL";
export const UBOOTH = "UBOOTH";
export const HBOOTH = "HBOOTH";
export const BLOCK  = "BLOCK";
export const DOOR   = "DOOR";

export const WallWidth = 0.25;

export const HANGING_UNIT_UPDATED = "hangingUnit:updated";
export const HANGING_UNIT_LOCATION_UPDATED = "hangingUnit:updated:location";
export const HANGING_UNIT_DIMENSIONS_UPDATED = "hangingUnit:updated:dimensions";
export const HANGING_UNIT_DETAILS_UPDATED = "hangingUnit:updated:details";
export const HANGING_UNIT_DELETED = "hangingUnit:deleted";

export class HangingUnit {

    constructor(id, name, location, size, unitType, walls, canHang) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.size = size;
        this.unitType = unitType;
        this.canHang = canHang;
        this.walls = walls || [];
    }

    /* Properties */
    getId() { return this.id; }
    setId(id) { this.id = id; }

    getName() { return this.name; }
    setName(name) { this.name = name; }

    getLocation() { return this.location; }
    setLocation(location) { this.location = location; }

    getSize() { return this.size; }
    setSize() {
        if ((arguments.length === 1) && ObjectUtils.isObject(arguments[0])) {
            this.size = arguments[0];
        }
        else if (arguments.length > 1) {
            this.width = arguments[0];
            this.length = arguments[1];
        }
        if (arguments.length > 2) {
            this.height = arguments[2];
        }
    }

    getAngle() { return this.angle; }
    setAngle(angle) { this.angle = angle; }

    getAddresses() { return []; }

    getUnitType() { return this.unitType; }

    getCanHang() { return this.canHang; }
    setCanHang(canHang) { this.canHang = canHang; }

    getWalls() { return this.walls;}
    setWalls(walls) { this.walls = walls; }

    /* Interface functions */
    getLines() { }

    onMove(options) { }
    onRotate(options) { }
    onClick(options) { }
    onDoubleClick(options) { }

    buildForm() { return (<></>); }

    inputCell(label, input) {
        return (
            <div className="cell">
                <div className="label">{label}</div>
                <div className="field">{input}</div>
            </div>
        );
    }

    updateUnit(id, evt, announcer) {
        let field = evt.target.name;

        let changeType = null;
        if (field === "name") {
            this.setName(evt.target.value);
            changeType = HANGING_UNIT_DETAILS_UPDATED;
        }
        else if (field.startsWith("location")) {
            field = field.substring("location.".length);
            let location = this.getLocation();
            location[field] = StringUtils.numerize(evt.target.value);
            this.setLocation(location);
            changeType = HANGING_UNIT_LOCATION_UPDATED;
        }
        else if (field.startsWith("size")) {
            field = field.substring("size.".length);
            let size = this.getSize();
            size[field] = Number(StringUtils.numerize(evt.target.value));
            this.setSize(size);
            changeType = HANGING_UNIT_DIMENSIONS_UPDATED;
        }

        announcer.announce(this, [HANGING_UNIT_UPDATED, changeType], this);
    }

}