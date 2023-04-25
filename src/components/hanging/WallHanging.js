
import { fabric } from 'fabric';

export default class WallHanging {
    constructor(elementId, actions) {
        this.elementId = elementId;
        this.updateQuilt = actions?.update;
        this.deleteQuilt = actions?.remove;

        this.wall = null;

        this.createCanvas();
        this.setWall(null);
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
            canvasEl.className = "wall-hanging-grid";

            element.appendChild(canvasEl);
        }

        this.canvas = new fabric.Canvas(this.canvasId, { 
            selection: false,
            data: this
        });

        this.canvas.on('object:moving', function(options) {
            let hanger = this.data;
            let grid = hanger.grid;
            let quilt = options.target.data.quilt;

            let left = Math.round(options.target.left / grid.size) * grid.size;
            let top = Math.round(options.target.top / grid.size) * grid.size;

            left = (left < 0) ? 0 : left;
            top = (top < 0) ? 0 : top;

            left = ((left + hanger.convert(quilt.width)) > grid.canvasWidth) ? Math.max(0, grid.canvasWidth - hanger.convert(quilt.width)): left; 
            top = ((top + hanger.convert(quilt.length)) > grid.canvasHeight) ? Math.max(0, grid.canvasHeight - hanger.convert(quilt.length)): top; 

            options.target.set({
              left: left,
              top: top 
            });
        });

        this.canvas.on('object:modified', function(options) {
            let wallHanger = this.data;
            let hangingLocation = options.target.data;

            if(hangingLocation) {
                hangingLocation.left = wallHanger.deconvert(options.target.left);
                hangingLocation.top = wallHanger.deconvert(options.target.top);

                wallHanger.updateQuilt(hangingLocation.quilt, hangingLocation);
            }
        });  

        document.addEventListener('keydown', (e) => {
            if(e.key === "Delete") {
                this.canvas.getActiveObjects().forEach(o => {
                    let quilt = o.data.quilt;
                    this.deleteQuilt(quilt);
                });
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

        if(!this.wall) {
            this.grid = {canvasWidth: elWidth, canvasHeight: elHeight, pixelsPerInch: 1};
        }
        else {
            // get the conversion factor from pixels to inches
            if(this.wall.width > this.wall.height) {
                this.grid.pixelsPerInch = elWidth / (this.wall.width * 12); 
            }
            else {
                this.grid.pixelsPerInch = elHeight / (this.wall.height * 12); 
            }

            this.grid.size = 4 * this.grid.pixelsPerInch;
            this.grid.canvasWidth = this.wall.width * 12 * this.grid.pixelsPerInch;
            this.grid.canvasHeight = this.wall.height * 12 * this.grid.pixelsPerInch;
        }
    }

    convert(measurement) {
        return Number(measurement) * this.grid.pixelsPerInch;
    }

    deconvert(measurement) {
        return Number(measurement) / this.grid.pixelsPerInch;
    }

    drawGrid() {
        this.canvas.setWidth(this.grid.canvasWidth);
        this.canvas.setHeight(this.grid.canvasHeight);

        if(this.wall) {
            // create grid
            for (var i = 0; i < (this.grid.canvasWidth / this.grid.size); i++) {
                this.canvas.add(new fabric.Line([ i * this.grid.size, 0, i * this.grid.size, this.grid.canvasHeight], { type:'line', stroke: '#ccc', selectable: false }));
                this.canvas.add(new fabric.Line([ 0, i * this.grid.size, this.grid.canvasWidth, i * this.grid.size], { type: 'line', stroke: '#ccc', selectable: false }))
            }
        } 
    }

    clearCanvas() {
        if(this.canvas) {
            this.canvas.clear();
        }
    }


    /* ********************************************************************* */
    /*   Wall operations                                                     */
    /* ********************************************************************* */
    setWall(wall) {
        this.wall = wall;

        this.clearCanvas();
        this.calculateGridValues();
        this.drawGrid();

        (wall?.hangingLocations || []).forEach(loc => this.addHangingLocation(loc));
    }

    addQuilt(quilt) {
        let newHangingLocation =  {left: 0, top: 0, quilt: quilt};
        this.addHangingLocation(newHangingLocation, true);

        return newHangingLocation;
    }

    removeQuilt(quilt) {
        let matches = this.canvas.getObjects().filter(o => o.data?.quilt?.id === quilt.id);
        if(matches.length > 0) {
            matches.forEach(m => this.canvas.remove(m));
        }
    }

    addHangingLocation(hangingLocation){
		this.canvas.add(new fabric.Rect({ 
			left: 0, 
			top: 0, 
			width: this.convert(hangingLocation.quilt.width), 
			height: this.convert(hangingLocation.quilt.length), 
			type: 'rectangle',
			fill: '#fab', 
			stroke:'',
			originX: 'left', 
			originY: 'top',
			id: hangingLocation.quilt.id, 
            selectable: true,
            selectionBackgroundColor: "#00F",
            padding: 4,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            cornerStyle: 'circle',
			hasControls: true,		
			centeredRotation: true,
            data: hangingLocation
		}));
    }

}
