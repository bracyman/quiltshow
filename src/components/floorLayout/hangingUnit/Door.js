import { HangingUnit, DOOR } from "./HangingUnit";

const DEFAULT_LINE = {
    location: { left: 0, top: 0, angle: 0 },
    size: { width: 6 }
};

export class Door extends HangingUnit {
    constructor(id, name, location, size,) {
        super(id, name, location || { ...DEFAULT_LINE.location }, size || { ...DEFAULT_LINE.size }, DOOR, false);
    }

    getLines() {
        return [{
            top: 0,
            left: 0,
            length: this.getSize().width,
            angle: 0
        }];
    }


    update(announcer) {
        return (evt) => this.updateUnit(this.id, evt, announcer);
    }

    buildForm(announcer) {
        return (<div className="hanging-unit-form Door" aria-label="Door">
            <div className="row" aria-label="Wall Name">
                {super.inputCell("Name", (<input type="text" name="name" id="name" value={this.getName()} onChange={this.update(announcer)} />))}
            </div>
            <div className="row" aria-label="Door Location">
                {super.inputCell("Left Position", (<input type="text" name="location.left" id="location.left" value={this.getLocation().left} onChange={this.update(announcer)} />))}
                {super.inputCell("Top Position", (<input type="text" name="location.top" id="location.top" value={this.getLocation().top} onChange={this.update(announcer)} />))}
                {super.inputCell("Angle", (<input type="text" name="location.angle" id="location.angle" value={this.getLocation().angle} onChange={this.update(announcer)} />))}
            </div>
            <div className="row" aria-label="Wall Size">
                {super.inputCell("Width", (<input type="text" name="size.width" id="size.width" value={this.getSize().width} onChange={this.update(announcer)} />))}
            </div>
        </div>);
    }

    copy() {
        return new Door(null, this.getName(), {...this.getLocation()}, {...this.getSize()});
    }
}