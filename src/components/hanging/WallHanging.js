import { useState, useEffect } from "react";
import { fabric } from 'fabric';

const WallHanging = (props) => {
    const { wall, announcer } = props;
    const [draggingQuilt, setDraggingQuilt] = useState(false);
    var canvas = null;
    var canvasWidth = 100, canvasHeight = 100;


    /* ********************************************************************* */
    /*   Wall operations                                                     */
    /* ********************************************************************* */
    useEffect(() => {
        initializeWall();
    });

    const calcCanvasUnits = (elementId) => {
        canvasWidth = document.getElementById(elementId).clientWidth;
        canvasHeight = document.getElementById(elementId).clientHeight;
    };

    const initializeWall = () => {
        calcCanvasUnits("wallContainer");
/*
        if (canvas) {
            canvas.clear();
            canvas.setHeight(canvasHeight);
        }
        else {
            canvas = new fabric.Canvas("wallCanvas", {
                width: canvasWidth,
                height: canvasHeight,
                backgroundColor: `white`,
            });
            //this.addListeners();
        }

        drawGrid();
        //*/

        (wall.hangingLocations || []).forEach(h => drawHangingLocation(h));
    };

    const drawGrid = () => {
        if(canvas) {
            let gridSpace = (canvasWidth / wall.width) / 2;

            // draw vertical lines
            for (let i = 1; (i * gridSpace) < canvasWidth; i++) {
                canvas.add(new fabric.Line([i * gridSpace, 0, i * gridSpace, canvasHeight], { stroke: '#888', selectable: false }));
            }
    
            // draw horizontal lines
            for (let i = 1; (i * gridSpace) < canvasHeight; i++) {
                canvas.add(new fabric.Line([0, i * gridSpace, canvasWidth, i * gridSpace], { stroke: '#888', selectable: false }));
            }
    
            /*
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
    */
            canvas.renderAll();
        }
    };

    const drawHangingLocation = (hangingLocation) => {

    };


    /* ********************************************************************* */
    /*   Drag operations                                                     */
    /* ********************************************************************* */
    const dragEnter = (evt) => {
        evt.preventDefault();
        setDraggingQuilt(true);
    };
    
    const dragLeave = (evt) => {
        evt.preventDefault();
        setDraggingQuilt(false);
    };

    const dragging = (evt) => {
        evt.preventDefault();
    };
    
    const quiltDrop = (evt) => {
        console.log("QuiltDropped");
        console.log(evt.dataTransfer.getData("quilt"));
    };
    

    return (
        <div className="wall-hanging-container">
            <div className="wall-name">{wall?.name || ""}</div>
            <div id="wallContainer" className="wall-hanging"
                onDragEnter={dragEnter} 
                onDragLeave={dragLeave}
                onDragOver={dragging}
                onDrop={quiltDrop}
            >
                <canvas id="wallCanvas" />
            </div>
        </div>
    );

};

export default WallHanging;