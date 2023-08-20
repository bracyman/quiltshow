import { HangingUnit, Facing, WallWidth, UBOOTH } from "./HangingUnit";


const DEFAULT_BOOTH = {
    location: { left: 0, top: 0, angle: 0 },
    size: { depth: 5, width: 10 }
};

export class UBooth extends HangingUnit {
    constructor(id, name, location, size, walls) {
        super(id, name, location || { ...DEFAULT_BOOTH.location }, size || { ...DEFAULT_BOOTH.size }, UBOOTH, walls, true);
    }


    /*
    |___|
    */
    getLines() {
        return [
            // left wall
            { top: 0, left: WallWidth, length: this.getSize().depth, angle: Facing.EAST },

            // booth back
            { top: this.getSize().depth - WallWidth, left: WallWidth, length: this.getSize().width - (2 * WallWidth), angle: Facing.NORTH },

            //  right wall
            { top: 0, left: this.getSize().width, length: this.getSize().depth, angle: Facing.EAST },
        ];
    }


    update(announcer) {
        return (evt) => this.updateUnit(this.id, evt, announcer);
    }


    buildForm(announcer) {
        return (<div className="hanging-unit-form Booth UBooth" aria-label="Single Side Wall">
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
                {super.inputCell("Booth Depth", (<input type="text" name="size.depth" id="booth_size.depth" value={this.getSize().depth} onChange={this.update(announcer)} />))}
            </div>
        </div>);
    }

    copy() {
        return new UBooth(null, this.getName(), {...this.getLocation()}, {...this.getSize()}, []);
    }
}