
import { WALL, BLOCK, DOOR, HBOOTH, UBOOTH, } from "./HangingUnit";
import { Wall } from "./Wall";
import { Block } from "./Block";
import { Door } from "./Door";
import { HBooth } from "./HBooth";
import { UBooth } from "./UBooth";

const CLASS_NAMES = ["Wall", "Block", "Door", "HBooth", "UBooth"];

class HangingUnitFactory {

   

    getUnit(unit) {
        
        if(CLASS_NAMES.includes(unit.constructor.name)) {
            return unit;
        }

        let convertedUnit = null;
        switch(unit.unitType) {
            case WALL:
                convertedUnit = new Wall(unit.id, unit.name, unit.location, unit.size, unit.walls);
                break;

            case BLOCK:
                convertedUnit = new Block(unit.id, unit.name, unit.location, unit.size, unit.walls);
                break;

            case DOOR:
                convertedUnit = new Door(unit.id, unit.name, unit.location, unit.size, unit.walls);
                break;

            case HBOOTH:
                convertedUnit = new HBooth(unit.id, unit.name, unit.location, unit.size, unit.walls);
                break;

            case UBOOTH:
                convertedUnit = new UBooth(unit.id, unit.name, unit.location, unit.size, unit.walls);
                break;

            default: 
                return null;
        }

        return convertedUnit;
    }

}

export default new HangingUnitFactory();