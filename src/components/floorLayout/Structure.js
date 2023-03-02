
export const TYPE_WALL = "wall";
export const TYPE_BOOTH = "booth";
export const TYPE_BOOTH_GROUP = "booth-group";

export default class Structure {

    constructor(structure) {
        this.top = structure?.top || 0;
        this.left = structure?.left || 0;
        this.angle = structure?.angle || 0;
        this.name = structure?.name || "structure";
    }
    
    render(canvas) {
        // do nothing here, subclasses only
    }

}

