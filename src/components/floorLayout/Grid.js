
import { fabric } from 'fabric';
import { WallWidth, HANGING_UNIT_UPDATED, HANGING_UNIT_DELETED, HANGING_UNIT_LOCATION_UPDATED, HANGING_UNIT_DIMENSIONS_UPDATED } from './hangingUnit/HangingUnit';


export const SINGLE_UNIT_SELECTION = "hangingUnit:selected:single";
export const MULTI_UNIT_SELECTION = "hangingUnit:selected:multiple";
export const SELECTION_CLEARED = "hangingUnit:selected:none";

var canvas = null;

export default class Grid {
    constructor(elementId, room, gridSize, width, announcer) {
        this.elementId = elementId;
        this.gridSize = gridSize || 2;
        this.room = room;
        this.width = width || 800;
        this.copyTarget = null;

        this.announcer = announcer;
        announcer.registerListener(this, this.announcementHandler);

        this.createCanvas(elementId);
    }

    calcCanvasUnits() {
        this.conversionFactor = this.width / this.room.width;
        this.height = this.room.length * this.conversionFactor;
    }

    createCanvas(elementId) {
        this.calcCanvasUnits();

        if (canvas) {
            canvas.clear();
            canvas.setHeight(this.height);
        }
        else {
            canvas = new fabric.Canvas(elementId, {
                width: this.width,
                height: this.height,
                backgroundColor: `white`,
            });
            this.addListeners();
        }

        this.drawGrid();

        this.room.hangingUnits.forEach(hu => this.addHangingUnit(hu));
    }

    drawGrid() {
        let gridSpace = this.width / this.room.width * this.gridSize;

        // draw vertical lines
        for (let i = 1; (i * gridSpace) < this.width; i++) {
            canvas.add(new fabric.Line([i * gridSpace, 0, i * gridSpace, this.height], { stroke: '#888', selectable: false }));
        }

        // draw horizontal lines
        for (let i = 1; (i * gridSpace) < this.height; i++) {
            canvas.add(new fabric.Line([0, i * gridSpace, this.width, i * gridSpace], { stroke: '#888', selectable: false }));
        }

        canvas.on('object:moving', (options) => {
            let gridUnits = this.convert(this.gridSize);
            let snapLeft = Math.round(options.target.left / gridUnits) * gridUnits;
            let snapTop = Math.round(options.target.top / gridUnits) * gridUnits;
            options.target.set({
                left: snapLeft,
                top: snapTop,
            });

            if (options.target.data) {
                let unitLocation = options.target.data.getLocation();
                options.target.data.setLocation({ ...unitLocation, left: this.deconvert(snapLeft), top: this.deconvert(snapTop) });
                this.announcer.announce(this, HANGING_UNIT_UPDATED, options.target.data);
            }
        });

        canvas.renderAll();
    }

    addListeners() {
        canvas.on('object:rotating', (options) => {
            if (options.target.data) {
                let unitLocation = options.target.data.getLocation();
                options.target.data.setLocation({ ...unitLocation, 
                    left: this.deconvert(options.target.left), 
                    top: this.deconvert(options.target.top), 
                    angle: options.target.angle 
                });
                this.announcer.announce(this, HANGING_UNIT_UPDATED, options.target.data);
            }
        });

        canvas.on('selection:created', (options) => {
            if (options.selected.length > 1) {
                this.announcer.announce(this, MULTI_UNIT_SELECTION, options.selected);
            }
            else {
                this.announcer.announce(this, SINGLE_UNIT_SELECTION, options.selected[0].data);
            }
            options.selected.forEach(s => s.set({ 'borderColor': 'blue', 'cornerColor': 'blue' }));
        });
        canvas.on('selection:cleared', (options) => {
            this.announcer.announce(this, SELECTION_CLEARED, null);
        });
        canvas.on('selection:updated', (options) => {
            if (options.selected.length > 1) {
                this.announcer.announce(this, MULTI_UNIT_SELECTION, options.selected);
            }
            else {
                this.announcer.announce(this, SINGLE_UNIT_SELECTION, options.selected[0].data);
            }
            options.selected.forEach(s => s.set({ 'borderColor': 'blue', 'cornerColor': 'blue' }));
        });

    }

    updateRoom(room, gridSize) {
        this.room = room;
        this.gridSize = gridSize || this.gridSize;
        this.createCanvas();
    }

    getUnitShape(id) {
        let shapes = canvas.getObjects().filter(o => o.data?.id === id);
        return (shapes?.length > 0) ? shapes[0] : null;
    }

    announcementHandler(source, evt, msg) {
        if (evt.is(HANGING_UNIT_UPDATED)) {
            let unitShape = this.getUnitShape(msg.getId());
            if (unitShape) {
                if (evt.is(HANGING_UNIT_LOCATION_UPDATED)) {
                    unitShape.left = this.convert(msg.getLocation().left);
                    unitShape.top = this.convert(msg.getLocation().top);
                    unitShape.angle = msg.getLocation().angle;
                }
                else if (evt.is(HANGING_UNIT_DIMENSIONS_UPDATED)) {
                    let i = canvas.remove(unitShape);
                    let newUnitShape = this.createUnitShape(msg);
                    canvas.add(newUnitShape);
                    canvas.setActiveObject(newUnitShape);
                }
                canvas.renderAll();
            }
        }
    }

    createUnitShape(hangingUnit) {
        let lines = hangingUnit.getLines();
        let gridLines = [];

        lines.forEach(line => {
            let gridLine = new fabric.Rect({
                left: this.convert(line.left),
                top: this.convert(line.top - (WallWidth / 2)),
                width: this.convert(line.length),
                height: this.convert(WallWidth),
                angle: line.angle,
                fill: this.getFillColor(hangingUnit),
                originX: 'left',
                originY: 'top',
                centeredRotation: true,
                selectable: false,
                lockScalingX: true,
                lockScalingY: true,
                cornerStyle: 'circle',
            });

            gridLines.push(gridLine);
        });

        let group = new fabric.Group(gridLines, {
            left: this.convert(hangingUnit.getLocation().left),
            top: this.convert(hangingUnit.getLocation().top),
            angle: hangingUnit.getLocation().angle,
            snapAngle: 45.0,
            data: hangingUnit,
            lockScalingX: true,
            lockScalingY: true,
            lockSkewingX: true,
            lockSkewingY: true,
            selectionBackgroundColor: 'rgba(17,119,255,0.3)'
        });

        return group;
    }

    getFillColor(hangingUnit) {
        return hangingUnit.getCanHang() ? '#000' : 'red';
    }

    addHangingUnit(hangingUnit, selectWhenDone) {
        let unitShape = this.createUnitShape(hangingUnit);

        canvas.add(unitShape);

        if (selectWhenDone) {
            canvas.setActiveObject(unitShape);
            this.announcer.announce(this, SINGLE_UNIT_SELECTION, hangingUnit);
        }
    }

    removeHangingUnit(hangingUnit) {
        let match = canvas.getObjects().find(o => o.data === hangingUnit);
        if(match) {
            canvas.remove(match);
        }
    }

    clearHangingUnits() {
        let matches = canvas.getObjects().find(o => o.data);
        if(matches.length > 0) {
            canvas.remove(matches);
        }
    }

    highlightUnit(hangingUnit) {
        if(hangingUnit) {
            this.highlightedShape = this.getUnitShape(hangingUnit.id);
            this.highlightedShape.forEachObject(o => o.set("fill", "aqua"));
            this.highlightedShape.forEachObject(o => o.set("fill", "aqua"));
            canvas.renderAll();
        }
        else {
            let color = this.getFillColor(this.highlightedShape.data);
            this.highlightedShape.forEachObject(o => o.set("fill", color));
            this.highlightedShape = null;
            canvas.renderAll();
        }
    }

    getHangingUnits() {
        return canvas.getObjects().map(o => o.data).filter(d => d);
    }

    convert(roomValue) {
        return Number(roomValue) * this.conversionFactor;
    }

    deconvert(gridValue) {
        return Number(gridValue) / this.conversionFactor;
    }

    getDataUrl() {
        return canvas.toDataURL({
            format: "png",
            quality: 0.8,
        });
    }
}