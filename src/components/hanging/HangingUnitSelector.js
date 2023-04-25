
import { fabric } from 'fabric';

const lineConfig = {
    type: 'rectangle',
    fill: '#000', 
    stroke:'',
    originX: 'left', 
    originY: 'top',
    selectable: false,
    lockScalingX: true,
    lockScalingY: true,
    lockRotation: true,
    cornerStyle: 'circle',
    hasControls: false,		
    centeredRotation: true,
};

const textConfig = {
    fill: "#000",
    selectable: true,
    hasControls: false,
    fontSize: 16,
};

const groupConfig = {
    selectable: true,
    lockMovementX: true,
    lockMovementY: true,
    hasControls: false,
    selectionBackgroundColor: "#FFFF8F",
    hoverCursor: "pointer",
};

export default class HangingUnitSelector {
    constructor(elementId, config) {
        this.elementId = elementId;
        this.selectUnit = config?.select;

        this.createCanvas();
        this.setRoom(this.room || null);
    }


    /* ********************************************************************* */
    /*   Initialization operations                                           */
    /* ********************************************************************* */
    createCanvas() {
        this.canvasId = `${this.elementId}_canvas`;

        if(document.getElementById(this.canvasId) === null) {
            let element = document.getElementById(this.elementId);
            let canvasEl = document.createElement("canvas");
            canvasEl.id = this.canvasId;
            canvasEl.className = "hanging-unit-grid";

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

            let hangingUnit = options.selected.length > 0 ? options.selected[0].data : null;
            if(hangingUnit) {
                this.selectUnit(hangingUnit);
            }
        });  
        this.canvas.on('selection:updated', (options) => {
            if(options.selected.length > 1) {
                return;
            }

            let hangingUnit = options.selected.length > 0 ? options.selected[0].data : null;
            if(hangingUnit) {
                this.selectUnit(hangingUnit);
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

        if(!this.room) {
            this.grid = {canvasWidth: elWidth, canvasHeight: elHeight, pixelsPerFoot: 1, wallWidth: 1};
        }
        else {
            this.grid = {};

            // get the conversion factor from pixels to inches
            if((elWidth / this.room.width) < (elHeight / this.room.length)) {
                this.grid.pixelsPerFoot = elWidth / (this.room.width); 
            }
            else {
                this.grid.pixelsPerFoot = elHeight / (this.room.length); 
            }

            this.grid.canvasWidth = this.room.width * this.grid.pixelsPerFoot;
            this.grid.canvasHeight = this.room.length * this.grid.pixelsPerFoot;
            this.grid.wallWidth = this.grid.pixelsPerFoot * .2;
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


    /* ********************************************************************* */
    /*   Room operations                                                     */
    /* ********************************************************************* */
    setRoom(room) {
        this.room = room;
        this.clearCanvas();

        if(!room) {
            return;
        }

        this.calculateGridValues();
        this.canvas.setWidth(this.grid.canvasWidth);
        this.canvas.setHeight(this.grid.canvasHeight);


        (room?.hangingUnits || []).forEach(unit => this.addHangingUnit(unit));
    }

    addHangingUnit(hangingUnit) {
        let unitShape = this.buildUnitShape(hangingUnit);
        unitShape.data = hangingUnit;
		this.canvas.add(unitShape);
    }

    buildUnitShape(hangingUnit) {
        if(hangingUnit.type === "SINGLE_SIDE_WALL") {
            return this.buildSingleSideWall(hangingUnit);
        }
        else if(hangingUnit.type === "DOUBLE_SIDE_WALL") {
            return this.buildDoubleSideWall(hangingUnit);
        }
        else if(hangingUnit.type === "SINGLE_BOOTH") {
            return this.buildSingleBooth(hangingUnit);
        }
        else if(hangingUnit.type === "DOUBLE_BOOTH") {
            return this.buildDoubleBooth(hangingUnit);
        }

        return null;
    }


    centerWidth(hangingUnit) {
        let angle = (hangingUnit.angle || 0.0) % 180.0;
        return (-10.0 < angle) && (angle < 10.0);
    }
    
    centerDirection(hangingUnit) {
        return ((hangingUnit.angle || 0.0) > 100) ? -1 : 1;
    }

    labelLeft(wall, label) {
        return (wall.left - (label.width + this.grid.wallWidth * 2)) >= 0;
    }

    labelAbove(wall, label) {
        return (wall.top - (label.height + this.grid.wallWidth * 2)) >= 0;
    }

    buildSingleSideWall(hangingUnit) {
        let width = Number(hangingUnit.measurements.width);
        let left = this.convert(hangingUnit.leftPosition);
        let top = this.convert(hangingUnit.topPosition);
        let wall = new fabric.Rect({ ...lineConfig, 
			left: left, 
			top: top, 
			width: this.convert(width), 
			height: this.grid.wallWidth,
            angle: hangingUnit.angle,
            id: hangingUnit.id
		});

        
        let label = new fabric.IText(hangingUnit.name || "", { ...textConfig,
            top: top + this.grid.wallWidth * 2,
            left: left
        });

        let labelLeft = 0, labelTop = 0;
        if(this.centerWidth(hangingUnit)) {
            labelLeft = wall.left + (this.centerDirection(hangingUnit) * (wall.width / 2)) - (label.width / 2);
            labelTop = this.labelAbove(wall, label) ? wall.top - (label.height + this.grid.wallWidth * 2) : wall.top + this.grid.wallWidth * 2;
        }
        else {
            labelTop = wall.top + (this.centerDirection(hangingUnit) * (wall.width / 2)) - (label.height / 2);
            labelLeft = this.labelLeft(wall, label) ? wall.left - (label.width + this.grid.wallWidth * 2) : wall.left + this.grid.wallWidth * 2;
        }

        label.left = labelLeft;
        label.top = labelTop;

        let group = new fabric.Group([wall, label], { ...groupConfig });

        return group;
    }

    buildDoubleSideWall(hangingUnit) {
        return this.buildSingleSideWall(hangingUnit);
    }

    createBoothUnit(left, top, width, depth) {
        let leftWall = new fabric.Rect({ ...lineConfig, 
			left: left, 
			top: top, 
			width: this.grid.wallWidth, 
			height: depth * 2,
		});

        let rightWall = new fabric.Rect({ ...lineConfig, 
			left: left + width, 
			top: top, 
			width: this.grid.wallWidth, 
			height: depth * 2,
		});

        let middleWall = new fabric.Rect({ ...lineConfig, 
			left: left, 
			top: top + depth, 
			width: width, 
			height: this.grid.wallWidth,
		});

        return [leftWall, middleWall, rightWall];
    }

    buildSingleBooth(hangingUnit) {
        let width = this.convert(Number(hangingUnit.measurements.width));
        let depth = this.convert(Number(hangingUnit.measurements.depth));
        let left = this.convert(hangingUnit.leftPosition);
        let top = this.convert(hangingUnit.topPosition);

        let boothWalls = this.createBoothUnit(left, top, width, depth);        

        let label = new fabric.IText(hangingUnit.name || "", { ...textConfig,
            top: top + this.grid.wallWidth * 2,
            left: left
        });

        label.left = left + ((width / 2) - (label.width / 2));

        let group = new fabric.Group([...boothWalls, label], { ...groupConfig,
            angle: hangingUnit.angle || 0.0
        });

        return group;
    }

    buildDoubleBooth(hangingUnit) {
        let width = this.convert(Number(hangingUnit.measurements.width));
        let depth = this.convert(Number(hangingUnit.measurements.depth));
        let left = this.convert(hangingUnit.leftPosition);
        let top = this.convert(hangingUnit.topPosition);

        let booth1Walls = this.createBoothUnit(left, top, width, depth);        
        let booth2Walls = this.createBoothUnit(left + width, top, width, depth);        

        let label = new fabric.IText(hangingUnit.name || "", { ...textConfig,
            top: top + this.grid.wallWidth * 2,
            left: left
        });

        label.left = left + ((width / 2) - (label.width / 2));

        let group = new fabric.Group([...booth1Walls, ...booth2Walls, label], { ...groupConfig,
            angle: hangingUnit.angle || 0.0,
        });

        return group;
    }
}
