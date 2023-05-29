import { HangingUnit, Facing, WallWidth, HBOOTH } from "./HangingUnit";


const DEFAULT_BOOTH = {
    location: { left: 0, top: 0, angle: 0 },
    size: { upperDepth: 5, lowerDepth: 5, width: 10 }
};

export class HBooth extends HangingUnit {
    constructor(id, name, location, size, walls,) {
        super(id, name, location || { ...DEFAULT_BOOTH.location }, size || { ...DEFAULT_BOOTH.size }, HBOOTH, walls, true);
    }


    /*
    |___|
    |   |
    */
    getLines() {
        return [
            // left wall
            { top: 0, left: WallWidth, length: this.getSize().upperDepth + this.getSize().lowerDepth, angle: Facing.EAST },

            // booth back
            { top: this.getSize().upperDepth - WallWidth, left: WallWidth, length: this.getSize().width - (2 * WallWidth), angle: Facing.NORTH },

            //  right wall
            { top: 0, left: this.getSize().width, length: this.getSize().upperDepth + this.getSize().lowerDepth, angle: Facing.EAST },
        ];
    }


    update(announcer) {
        return (evt) => this.updateUnit(this.id, evt, announcer);
    }


    buildForm(announcer) {
        return (<div className="hanging-unit-form Booth HBooth" aria-label="Single Side Wall">
            <div className="row" aria-label="Booth Name">
                {super.inputCell("Name", (<input type="text" name="name" id="booth_name" value={this.getName()} onChange={this.update(announcer)} />))}
            </div>
            <div className="row" aria-label="Booth Location">
                {super.inputCell("Left Position", (<input type="text" name="location.left" id="booth_location.left" value={this.getLocation().left} onChange={this.update(announcer)} />))}
                {super.inputCell("Top Position", (<input type="text" name="location.top" id="booth_location.top" value={this.getLocation().top} onChange={this.update(announcer)} />))}
                {super.inputCell("Angle", (<input type="text" name="location.angle" id="booth_location.angle" value={this.getLocation().angle} onChange={this.update(announcer)} />))}
            </div>
            <div className="row" aria-label="Booth Size">
                {super.inputCell("Booth Width", (<input type="text" name="size.width" id="booth_size.width" value={this.getSize().width} onChange={this.update(announcer)} />))}
                {super.inputCell("Upper Depth", (<input type="text" name="size.upperDepth" id="booth_size.upperDepth" value={this.getSize().upperDepth} onChange={this.update(announcer)} />))}
                {super.inputCell("Lower Depth", (<input type="text" name="size.lowerDepth" id="booth_size.lowerDepth" value={this.getSize().lowerDepth} onChange={this.update(announcer)} />))}
            </div>
        </div>);
    }

    copy() {
        return new HBooth(null, this.getName(), {...this.getLocation()}, {...this.getSize()}, []);
    }
}