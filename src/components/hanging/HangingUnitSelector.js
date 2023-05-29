
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

const actualLeft = (unit) => {
    return Math.min(unit.aCoords.bl.x, unit.aCoords.tr.x);
};

const actualTop = (unit) => {
    return Math.min(unit.aCoords.tl.y, unit.aCoords.br.y);
};

const actualWidth = (unit) => {
    return Math.abs(unit.aCoords.br.x - unit.aCoords.tl.x);
};

const actualHeight = (unit) => {
    return Math.abs(unit.aCoords.bl.y - unit.aCoords.tr.y);
};

const sin = (degrees) => {
    return Math.sin(degrees * Math.PI/180);
};

const cos = (degrees) => {
    return Math.cos(degrees * Math.PI/180);
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
            this.grid.wallWidth = Math.max(this.grid.pixelsPerFoot * .2, 2);
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
        this.canvas.renderAll();
    }

    setHangingUnit(unit) {
        let matches = this.canvas.getObjects().filter(o => o.data.id === unit.id);
        if(matches.length > 0) {
            this.canvas.setActiveObject(matches[0]);
            this.canvas.requestRenderAll();
        }
    }

    addHangingUnit(hangingUnit) {
        let unitShape = this.buildUnitShape(hangingUnit);
        unitShape.data = hangingUnit;
		this.canvas.add(unitShape);
    }

    buildUnitShape(hangingUnit) {
        if(hangingUnit.unitType === "WALL") {
            return this.buildWall(hangingUnit);
        }
        else if(hangingUnit.unitType === "UBOOTH") {
            return this.buildUBooth(hangingUnit);
        }
        else if(hangingUnit.unitType === "HBOOTH") {
            return this.buildHBooth(hangingUnit);
        }
        else if(hangingUnit.unitType === "DOOR") {
            return this.buildDoor(hangingUnit);
        }
        else if(hangingUnit.unitType === "BLOCK") {
            return this.buildBlock(hangingUnit);
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

    correctPosition(group) {
        if(group.aCoords.tl.x < 0) {
            group.left = 0;
        }
        if(group.aCoords.tl.y < 0) {
            group.top = 0;
        }

        if(group.aCoords.br.x > this.grid.canvasWidth) {
            group.left = this.grid.canvasWidth - group.width;
        }        
        if(group.aCoords.br.y > this.grid.canvasHeight) {
            group.top = this.grid.canvasHeight - group.height;
        }        
    }

    buildWall(hangingUnit) {
        let wall = new fabric.Rect({ ...lineConfig,
            left: 0, 
			top: 0, 
			width: this.convert(Number(hangingUnit.size.length)), 
			height: this.grid.wallWidth,
            id: hangingUnit.id,
		});

        wall.rotate(hangingUnit.location.angle || 0);
        wall.left = this.convert(hangingUnit.location.left);
        wall.top = this.convert(hangingUnit.location.top);
        
        let label = new fabric.IText(hangingUnit.name || "", textConfig);

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
        this.correctPosition(group);

        return group;
    }

    buildUBooth(hangingUnit) {
        let width = this.convert(Number(hangingUnit.size.width));
        let depth = this.convert(Number(hangingUnit.size.depth));
        let left = this.convert(hangingUnit.location.left);
        let top = this.convert(hangingUnit.location.top);

        let leftWall = new fabric.Rect({ ...lineConfig, 
			left: left, 
			top: top, 
			width: this.grid.wallWidth, 
			height: depth,
		});

        let rightWall = new fabric.Rect({ ...lineConfig, 
			left: left + width, 
			top: top, 
			width: this.grid.wallWidth, 
			height: depth,
		});

        let middleWall = new fabric.Rect({ ...lineConfig, 
			left: left, 
			top: top + depth, 
			width: width, 
			height: this.grid.wallWidth,
		});

        let group = new fabric.Group([leftWall, middleWall, rightWall], { ...groupConfig,
            angle: hangingUnit.location.angle || 0.0
        });


        let label = new fabric.IText(hangingUnit.name || "", { ...textConfig,
            angle: (hangingUnit.location.angle || 0.0) % 180
        });

        label.left = actualLeft(group) + (sin(hangingUnit.location.angle % 180) * actualWidth(label)) + ((actualWidth(group) / 2) - (actualWidth(label) / 2));
//        label.left = actualLeft(group) + ((actualWidth(group) / 2) - (actualWidth(label) / 2));
        label.top = actualTop(group) + (actualHeight(group) / 2) - (actualHeight(label) / 2);
        group.addWithUpdate(label);
 
        return group;
    }

    buildHBooth(hangingUnit) {
        let width = this.convert(Number(hangingUnit.size.width));
        let upperDepth = this.convert(Number(hangingUnit.size.upperDepth));
        let lowerDepth = this.convert(Number(hangingUnit.size.lowerDepth));
        let left = this.convert(hangingUnit.location.left);
        let top = this.convert(hangingUnit.location.top);

        let leftWall = new fabric.Rect({ ...lineConfig, 
			left: left, 
			top: top, 
			width: this.grid.wallWidth, 
			height: upperDepth + lowerDepth,
		});

        let rightWall = new fabric.Rect({ ...lineConfig, 
			left: left + width, 
			top: top, 
			width: this.grid.wallWidth, 
			height: upperDepth + lowerDepth,
		});

        let middleWall = new fabric.Rect({ ...lineConfig, 
			left: left, 
			top: top + upperDepth, 
			width: width, 
			height: this.grid.wallWidth,
		});

        let group = new fabric.Group([leftWall, middleWall, rightWall], { ...groupConfig,
            angle: hangingUnit.location.angle || 0.0,
        });


        let label = new fabric.IText(hangingUnit.name || "", { ...textConfig,
            angle: (hangingUnit.location.angle || 0.0) % 180
        });

        label.left = actualLeft(group) + ((actualWidth(group) / 2) - (actualWidth(label) / 2));
        label.top = actualTop(group) + (cos(hangingUnit.location.angle % 180) * actualHeight(label)) + (actualHeight(group) / 2) - (actualHeight(label) / 2);
        group.addWithUpdate(label);

        return group;
    }

    buildBlock(hangingUnit) {
        let block = new fabric.Rect({ ...lineConfig,
            left: 0, 
			top: 0, 
			width: this.convert(Number(hangingUnit.size.width)), 
			height: this.convert(Number(hangingUnit.size.length)), 
            id: hangingUnit.id,
            selectable: false,
            fill: 'red'
		});

        block.rotate(hangingUnit.location.angle || 0);
        block.left = this.convert(hangingUnit.location.left);
        block.top = this.convert(hangingUnit.location.top);
        
        return block;
    }

    buildDoor(hangingUnit) {
        let door = new fabric.Rect({ ...lineConfig,
            left: 0, 
			top: 0, 
			width: this.convert(Number(hangingUnit.size.width)), 
			height: this.grid.wallWidth, 
            id: hangingUnit.id,
            selectable: false,
            fill: 'red'
		});

        door.rotate(hangingUnit.location.angle || 0);
        door.left = this.convert(hangingUnit.location.left);
        door.top = this.convert(hangingUnit.location.top);
        
        return door;
    }

}
