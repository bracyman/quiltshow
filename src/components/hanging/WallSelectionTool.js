
import { fabric } from 'fabric';


const UBoothWalls = {
    Left: 0,
    Middle: 1,
    Right: 2,
    OuterLeft: 3,
    OuterMiddle: 4,
    OuterRight: 5
};


const HBoothWalls = {
    UpperLeft: 0,
    UpperMiddle: 1,
    UpperRight: 2,
    LowerLeft: 3,
    LowerMiddle: 4,
    LowerRight: 5,
    OuterLeft: 6,
    OuterRight: 7
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
            if(["WALL"].includes(this.hangingUnit.unitType)) {
                if(this.isVertical(this.hangingUnit)) {
                    this.grid.pixelsPerFoot = elHeight / this.hangingUnit.size.length;
                }
                else {
                    this.grid.pixelsPerFoot = elWidth / this.hangingUnit.size.length;
                }

                this.grid.canvasHeight = elHeight;
                this.grid.canvasWidth = elWidth;
                this.grid.wallWidth = Math.min(elWidth / 10, 10);
            }
            else if(["UBOOTH"].includes(this.hangingUnit.unitType)) {
                let width = this.isVertical(this.hangingUnit)  ? this.hangingUnit.size.depth + 3 : this.hangingUnit.size.width + 4;
                let height = this.isVertical(this.hangingUnit) ? this.hangingUnit.size.width + 4 : this.hangingUnit.size.depth + 3;

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
            else if(["HBOOTH"].includes(this.hangingUnit.unitType)) {
                let totalDepth = this.hangingUnit.size.upperDepth + this.hangingUnit.size.lowerDepth;
                let width = this.isVertical(this.hangingUnit)  ? totalDepth + 4  : this.hangingUnit.size.width * 2 + 8;
                let height = this.isVertical(this.hangingUnit) ? this.hangingUnit.size.width * 2 + 8  : totalDepth + 4;

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
        if(hangingUnit.unitType === "WALL") {
            this.buildWall(hangingUnit);
        }
        else if(hangingUnit.unitType === "UBOOTH") {
            this.buildUBooth(hangingUnit);
        }
        else if(hangingUnit.unitType === "HBOOTH") {
            this.buildHBooth(hangingUnit);
        }
    }


    buildWall(hangingUnit) {
        let wall1 = null, wall2 = null;
        if(this.isVertical(hangingUnit)) {
            let left1 = (this.grid.canvasWidth / 2) - (this.grid.wallWidth * 1.5);
            let left2 = (this.grid.canvasWidth / 2) + (this.grid.wallWidth * 0.5);
            wall1 = this.verticalWall(left1, 0, this.convert(hangingUnit.size.length), hangingUnit.walls[0]);
            wall2 = this.verticalWall(left2, 0, this.convert(hangingUnit.size.length), hangingUnit.walls[1]);
        } else {
            let top1 = (this.grid.canvasHeight / 2) - (this.grid.wallWidth * 1.5);
            let top2 = (this.grid.canvasHeight / 2) + (this.grid.wallWidth * 0.5);
            wall1 = this.horizontalWall(0, top1, this.convert(hangingUnit.size.length), hangingUnit.walls[0]);
            wall2 = this.horizontalWall(0, top2, this.convert(hangingUnit.size.length), hangingUnit.walls[1]);
        }

        this.canvas.add(wall1);
        this.canvas.add(wall2);
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

    buildUBooth(hangingUnit) {
        let width = this.convert(hangingUnit.size.width);
        let depth = this.convert(hangingUnit.size.depth);
        let height = depth + this.grid.wallWidth * 3;

        let left = 0;
        let top = 0;

        this.canvas.add(this.verticalWall(left, top, height, hangingUnit.walls[UBoothWalls.OuterLeft]));
        
        left += this.grid.wallWidth * 2;
        this.canvas.add(this.verticalWall(left, top, depth, hangingUnit.walls[UBoothWalls.Left]));

        left += this.grid.wallWidth;
        top += depth;
        this.canvas.add(this.horizontalWall(left, top, width, hangingUnit.walls[UBoothWalls.Middle]));

        top += this.grid.wallWidth * 2;
        this.canvas.add(this.horizontalWall(left, top, width, hangingUnit.walls[UBoothWalls.OuterMiddle]));

        top = 0;
        left += width;
        this.canvas.add(this.verticalWall(left, top, depth, hangingUnit.walls[UBoothWalls.Right]));

        left += this.grid.wallWidth * 2;
        this.canvas.add(this.verticalWall(left, top, height, hangingUnit.walls[UBoothWalls.OuterRight]));
    }

    buildHBooth(hangingUnit) {
        let width = this.convert(hangingUnit.size.width);
        let upperDepth = this.convert(hangingUnit.size.upperDepth);
        let lowerDepth = this.convert(hangingUnit.size.lowerDepth);
        let height = upperDepth + lowerDepth + this.grid.wallWidth * 3;

        let left = 0;
        let top = 0;

        this.canvas.add(this.verticalWall(left, top, height, hangingUnit.walls[HBoothWalls.OuterLeft]));
        
        left += this.grid.wallWidth * 2;
        this.canvas.add(this.verticalWall(left, top, upperDepth, hangingUnit.walls[HBoothWalls.UpperLeft]));
        
        top += upperDepth + this.grid.wallWidth * 3;
        this.canvas.add(this.verticalWall(left, top, lowerDepth, hangingUnit.walls[HBoothWalls.LowerLeft]));

        left += this.grid.wallWidth;
        top = upperDepth;
        this.canvas.add(this.horizontalWall(left, top, width, hangingUnit.walls[HBoothWalls.UpperMiddle]));

        top += this.grid.wallWidth * 2;
        this.canvas.add(this.horizontalWall(left, top, width, hangingUnit.walls[HBoothWalls.LowerMiddle]));

        left += width;
        top = 0;
        this.canvas.add(this.verticalWall(left, top, upperDepth, hangingUnit.walls[HBoothWalls.UpperRight]));

        top = upperDepth + this.grid.wallWidth * 3;
        this.canvas.add(this.verticalWall(left, top, lowerDepth, hangingUnit.walls[HBoothWalls.LowerRight]));

        top = 0;
        left += this.grid.wallWidth * 2;
        this.canvas.add(this.verticalWall(left, top, height, hangingUnit.walls[HBoothWalls.OuterRight]));
    }
}
