import { HangingUnit, } from "./HangingUnit";

const DEFAULT_LINE = {
    location: { left: 0, top: 0, angle: 0 },
    size: { length: 20 }
};

export class SingleSideWall extends HangingUnit {
    constructor(id, name, location, size,) {
        super(id, name, location || { ...DEFAULT_LINE.location }, size || { ...DEFAULT_LINE.size });
    }

    getLines() {
        return [{
            top: 0,
            left: 0,
            length: this.getSize().length,
            angle: 0
        }];
    }


    update(announcer) {
        return (evt) => this.updateUnit(this.id, evt, announcer);
    }

    buildForm(announcer) {
        return (<div className="hanging-unit-form SingleSideWall" aria-label="Single Side Wall">
            <div className="row" aria-label="Wall Name">
                {super.inputCell("Name", (<input type="text" name="name" id="name" value={this.getName()} onChange={this.update(announcer)} />))}
            </div>
            <div className="row" aria-label="Wall Location">
                {super.inputCell("Left Position", (<input type="text" name="location.left" id="location.left" value={this.getLocation().left} onChange={this.update(announcer)} />))}
                {super.inputCell("Top Position", (<input type="text" name="location.top" id="location.top" value={this.getLocation().top} onChange={this.update(announcer)} />))}
                {super.inputCell("Angle", (<input type="text" name="location.angle" id="location.angle" value={this.getLocation().angle} onChange={this.update(announcer)} />))}
            </div>
            <div className="row" aria-label="Wall Size">
                {super.inputCell("Length", (<input type="text" name="size.length" id="size.length" value={this.getSize().length} onChange={this.update(announcer)} />))}
            </div>
        </div>);
    }

}