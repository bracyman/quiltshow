
import { fabric } from 'fabric';

export default class ScaledCanvas {
    constructor(elementId, width, height, gridSize) {
        this.elementId = elementId;
        this.width = width || 800;
        this.height = height || 600;
        this.gridSize = gridSize || 2;

        this.createCanvas();

        this.drawGrid();
    }

    drawGrid() {

    }
}