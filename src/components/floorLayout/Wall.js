import Structure, {TYPE_WALL} from "./Structure";


class Wall extends Structure {

    constructor(structure) {
        super(structure);
        this.type = TYPE_WALL;
        this.length = structure?.length || 10;
    }

    render(canvas) {
        canvas.drawLine(this.top, this.left, this.angle, this.length);
    }
}