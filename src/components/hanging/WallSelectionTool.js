
import { fabric } from 'fabric';


const SingleBoothWalls = {
    UpperLeft: 0,
    UpperMiddle: 1,
    UpperRight: 2,
    LowerLeft: 3,
    LowerMiddle: 4,
    LowerRight: 5,
    OuterLeft: 6,
    OuterRight: 7
};


const DoubleBoothWalls = {
    UpperLeftLeft: 0,
    UpperLeftMiddle: 1,
    UpperLeftRight: 2,
    UpperRightLeft: 3,
    UpperRightMiddle: 4,
    UpperRightRight: 5,
    LowerLeftLeft: 6,
    LowerLeftMiddle: 7,
    LowerLeftRight: 8,
    LowerRightLeft: 9,
    LowerRightMiddle: 10,
    LowerRightRight: 11,
    OuterLeft: 12,
    OuterRight: 13
};


export default class WallSelectionTool {
    constructor(elementId, config) {
        this.elementId = elementId;
        this.selectWall = config?.select;

        this.createCanvas();
        this.setHangingUnit(config?.hangingUnit || null);
    }


    /* ********************************************************************* */
    /*   Initialization operations                                           */
    /* ********************************************************************* */
    lineConfig() {
        return {
            type: 'rectangle',
            fill: '#000', 
            stroke:'',
            originX: 'left', 
            originY: 'top',
            selectable: true,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            cornerStyle: 'circle',
            hasControls: false,		
            centeredRotation: true,
            lockMovementX: true,
            lockMovementY: true,
            hoverCursor: "pointer"
        };
    }

    createCanvas() {
        this.canvasId = `${this.elementId}_canvas`;

        if(document.getElementById(this.canvasId) === null) {
            let element = document.getElementById(this.elementId);
            let canvasEl = document.createElement("canvas");
            canvasEl.id = this.canvasId;
            canvasEl.className = "wall-selection-grid";

            element.appendChild(canvasEl);
        }

        this.canvas = new fabric.Canvas(this.canvasId, { 
            selection: true,
            data: this
        });

        this.canvas.on('selection:created', (options) => {
            if(options.selected.length > 1) {
                return;
            }

            let wall = options.selected.length > 0 ? options.selected[0].data : null;
            if(wall) {
                this.selectWall(wall);
            }
        });  
        this.canvas.on('selection:updated', (options) => {
            if(options.selected.length > 1) {
                return;
            }

            let wall = options.selected.length > 0 ? options.selected[0].data : null;
            if(wall) {
                this.selectWall(wall);
            }
        });  
    }
    

    /* ********************************************************************* */
    /*   Grid operations                                                     */
    /* ********************************************************************* */
    calculateGridValues() {
        let element = document.getElementById(this.elementId);
        let elWidth = element.clientWidth;
        let elHeight = element.clientHeight;

        if(!this.hangingUnit) {
            this.grid = {canvasWidth: elWidth, canvasHeight: elHeight, pixelsPerFoot: 1, wallWidth: 1, wallLength: 1};
        }
        else {
            this.grid = {};

            // get the conversion factor from pixels to inches
            if(["SINGLE_SIDE_WALL", "DOUBLE_SIDE_WALL"].includes(this.hangingUnit.type)) {
                if(this.isVertical(this.hangingUnit)) {
                    this.grid.pixelsPerFoot = elHeight / this.hangingUnit.measurements.width;
                }
                else {
                    this.grid.pixelsPerFoot = elWidth / this.hangingUnit.measurements.width;
                }

                this.grid.canvasHeight = elHeight;
                this.grid.canvasWidth = elWidth;
                this.grid.wallWidth = Math.min(elWidth / 10, 10);
            }
            else if(["SINGLE_BOOTH"].includes(this.hangingUnit.type)) {
                let width = this.isVertical(this.hangingUnit)  ? this.hangingUnit.measurements.depth * 2 : this.hangingUnit.measurements.width + 4;
                let height = this.isVertical(this.hangingUnit) ? this.hangingUnit.measurements.width     : this.hangingUnit.measurements.depth * 2;

                if((elWidth / width) < (elHeight / height)) {
                    this.grid.pixelsPerFoot = elWidth / width;
                }
                else {
                    this.grid.pixelsPerFoot = elHeight / height;
                }

                this.grid.canvasWidth = width * this.grid.pixelsPerFoot;
                this.grid.canvasHeight = height * this.grid.pixelsPerFoot;
                this.grid.wallWidth = Math.min(elWidth / 10, elHeight / 7, 10);
            }
            else if(["DOUBLE_BOOTH"].includes(this.hangingUnit.type)) {
                let width = this.isVertical(this.hangingUnit)  ? this.hangingUnit.measurements.depth * 2 + 1  : this.hangingUnit.measurements.width * 2 + 8;
                let height = this.isVertical(this.hangingUnit) ? this.hangingUnit.measurements.width * 2 + 8  : this.hangingUnit.measurements.depth * 2 + 1;

                if((elWidth / width) < (elHeight / height)) {
                    this.grid.pixelsPerFoot = elWidth / width;
                }
                else {
                    this.grid.pixelsPerFoot = elHeight / height;
                }

                this.grid.canvasWidth = Math.max(width * this.grid.pixelsPerFoot, elWidth);
                this.grid.canvasHeight = Math.max(height * this.grid.pixelsPerFoot, elHeight);
                this.grid.wallWidth = Math.min(elWidth / 10, elHeight / 7, 10);
            }

            this.grid.wallLength = 20;
        }
    }

    convert(measurement) {
        return Number(measurement) * this.grid.pixelsPerFoot;
    }

    deconvert(measurement) {
        return Number(measurement) / this.grid.pixelsPerFoot;
    }

    drawGrid() {
        this.canvas.setWidth(this.grid.canvasWidth);
        this.canvas.setHeight(this.grid.canvasHeight);
    }

    clearCanvas() {
        if(this.canvas) {
            this.canvas.clear();
        }
    }

    isVertical(hangingUnit) {
        let angle = (hangingUnit?.angle || 0.0) % 180;
        return (80 < angle) && (angle < 100);
    }


    /* ********************************************************************* */
    /*   Wall operations                                                     */
    /* ********************************************************************* */
    setHangingUnit(hangingUnit) {
        this.hangingUnit = hangingUnit;
        this.clearCanvas();

        if(!hangingUnit) {
            return;
        }

        this.calculateGridValues();
        this.canvas.setWidth(this.grid.canvasWidth);
        this.canvas.setHeight(this.grid.canvasHeight);


        this.drawWalls(hangingUnit);
    }

    drawWalls(hangingUnit) {
        if(hangingUnit.type === "SINGLE_SIDE_WALL") {
            this.buildSingleSideWall(hangingUnit);
        }
        else if(hangingUnit.type === "DOUBLE_SIDE_WALL") {
            this.buildDoubleSideWall(hangingUnit);
        }
        else if(hangingUnit.type === "SINGLE_BOOTH") {
            this.buildSingleBooth(hangingUnit);
        }
        else if(hangingUnit.type === "DOUBLE_BOOTH") {
            this.buildDoubleBooth(hangingUnit);
        }
    }


    buildSingleSideWall(hangingUnit) {
        let wall = null;
        if(this.isVertical(hangingUnit)) {
            wall = this.verticalWall((this.grid.canvasWidth / 2) - (this.grid.wallWidth / 2), 0, this.convert(hangingUnit.measurements.width), hangingUnit.walls[0]);
        } else {
            wall = this.horizontalWall(0, (this.grid.canvasHeight / 2) - (this.grid.wallWidth / 2), this.convert(hangingUnit.measurements.width), hangingUnit.walls[0]);
        }

        this.canvas.add(wall);
        this.canvas.setActiveObject(wall);
        this.selectWall(hangingUnit.walls[0]);
    }


    buildDoubleSideWall(hangingUnit) {
        return this.buildSingleSideWall(hangingUnit);
    }

    horizontalWall(left, top, length, wall) {
        let wallShape = new fabric.Rect({ ...this.lineConfig(), 
            left: left, 
            top: top, 
            width: length, 
            height: this.grid.wallWidth,
            selectionBackgroundColor: "#00F",
            padding: this.grid.wallWidth / 2,
            id: wall.id,
            data: wall,
        });

        return wallShape;
    }

    verticalWall(left, top, length, wall) {
        let wallShape = new fabric.Rect({ ...this.lineConfig(), 
            left: left, 
            top: top, 
            width: this.grid.wallWidth, 
            height: length,
            selectionBackgroundColor: "#00F",
            padding: this.grid.wallWidth / 2,
            id: wall.id,
            data: wall,
        });

        return wallShape;
    }

    buildSingleBooth(hangingUnit) {
        let width = this.convert(hangingUnit.measurements.width);
        let depth = this.convert(hangingUnit.measurements.depth);
        let height = depth * 2 + this.grid.wallWidth * 3;

        let left = 0;
        let top = 0;

        this.canvas.add(this.verticalWall(left, top, height, hangingUnit.walls[SingleBoothWalls.OuterLeft]));
        
        left += this.grid.wallWidth * 2;
        this.canvas.add(this.verticalWall(left, top, depth, hangingUnit.walls[SingleBoothWalls.UpperLeft]));

        left += this.grid.wallWidth;
        top += depth;
        this.canvas.add(this.horizontalWall(left, top, width, hangingUnit.walls[SingleBoothWalls.UpperMiddle]));

        top += this.grid.wallWidth * 2;
        this.canvas.add(this.horizontalWall(left, top, width, hangingUnit.walls[SingleBoothWalls.LowerMiddle]));

        left -= this.grid.wallWidth;
        top += this.grid.wallWidth;
        this.canvas.add(this.verticalWall(left, top, depth, hangingUnit.walls[SingleBoothWalls.LowerLeft]));

        left += this.grid.wallWidth + width;
        top = 0;
        this.canvas.add(this.verticalWall(left, top, depth, hangingUnit.walls[SingleBoothWalls.UpperRight]));

        top += depth + this.grid.wallWidth * 3;
        this.canvas.add(this.verticalWall(left, top, depth, hangingUnit.walls[SingleBoothWalls.LowerRight]));

        left += this.grid.wallWidth * 2;
        top = 0;
        this.canvas.add(this.verticalWall(left, top, height, hangingUnit.walls[SingleBoothWalls.OuterRight]));

    }

    buildDoubleBooth(hangingUnit) {
        let width = this.convert(hangingUnit.measurements.width);
        let depth = this.convert(hangingUnit.measurements.depth);
        let height = depth * 2 + this.grid.wallWidth * 3;

        let left = 0;
        let top = 0;

        this.canvas.add(this.verticalWall(left, top, height, hangingUnit.walls[DoubleBoothWalls.OuterLeft]));
        
        left += this.grid.wallWidth * 2;
        this.canvas.add(this.verticalWall(left, top, depth, hangingUnit.walls[DoubleBoothWalls.UpperLeftLeft]));

        left += this.grid.wallWidth;
        top += depth;
        this.canvas.add(this.horizontalWall(left, top, width, hangingUnit.walls[DoubleBoothWalls.UpperLeftMiddle]));

        top += this.grid.wallWidth * 2;
        this.canvas.add(this.horizontalWall(left, top, width, hangingUnit.walls[DoubleBoothWalls.LowerLeftMiddle]));

        left -= this.grid.wallWidth;
        top += this.grid.wallWidth;
        this.canvas.add(this.verticalWall(left, top, depth, hangingUnit.walls[DoubleBoothWalls.LowerLeftLeft]));

        left += this.grid.wallWidth + width;
        top = 0;
        this.canvas.add(this.verticalWall(left, top, depth, hangingUnit.walls[DoubleBoothWalls.UpperLeftRight]));

        top += depth + this.grid.wallWidth * 3;
        this.canvas.add(this.verticalWall(left, top, depth, hangingUnit.walls[DoubleBoothWalls.LowerLeftRight]));


        left += this.grid.wallWidth * 2;
        top = 0;
        this.canvas.add(this.verticalWall(left, top, depth, hangingUnit.walls[DoubleBoothWalls.UpperRightLeft]));

        left += this.grid.wallWidth;
        top += depth;
        this.canvas.add(this.horizontalWall(left, top, width, hangingUnit.walls[DoubleBoothWalls.UpperRightMiddle]));

        top += this.grid.wallWidth * 2;
        this.canvas.add(this.horizontalWall(left, top, width, hangingUnit.walls[DoubleBoothWalls.LowerRightMiddle]));

        left -= this.grid.wallWidth;
        top += this.grid.wallWidth;
        this.canvas.add(this.verticalWall(left, top, depth, hangingUnit.walls[DoubleBoothWalls.LowerRightLeft]));

        left += this.grid.wallWidth + width;
        top = 0;
        this.canvas.add(this.verticalWall(left, top, depth, hangingUnit.walls[DoubleBoothWalls.UpperRightRight]));

        top += depth + this.grid.wallWidth * 3;
        this.canvas.add(this.verticalWall(left, top, depth, hangingUnit.walls[DoubleBoothWalls.LowerRightRight]));



        left += this.grid.wallWidth * 2;
        top = 0;
        this.canvas.add(this.verticalWall(left, top, height, hangingUnit.walls[DoubleBoothWalls.OuterRight]));
    }
}
