
import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';




const Layout = (props) => {
    const [canvas, setCanvas] = useState('');
    const [gridSize, setGridSize] = useState(props.gridSize || 2);
    const [roomWidth, setRoomWidth] = useState(props.roomWidth || 80);
    const [roomHeight, setRoomHeight] = useState(props.roomHeight || 50);

    const calcCanvasUnits = () => {
        let canvasWidth = window.innerWidth * .5;
        let canvasHeight = window.innerHeight * .5;

        return {
            canvasWidth: canvasWidth,
            canvasHeight: canvasHeight,
            gridUnits: canvasWidth / (roomWidth / gridSize)
        };
    };
    const [canvasUnits, setCanvasUnits] = useState(calcCanvasUnits());

    useEffect(() => {
        let newCanvasUnits = calcCanvasUnits();
        setCanvas(initCanvas(newCanvasUnits));
        setCanvasUnits(newCanvasUnits);
    }, []);

    const initCanvas = (units) => {

        // create the canvase
        let newCanvas = new fabric.Canvas('floorCanvas', {
            width: units.canvasWidth,
            height: units.canvasHeight,
            backgroundColor: `white`
        });

        // create the grid
        for (let i = 1; (i * units.gridUnits) < units.canvasWidth; i++) {
            newCanvas.add(new fabric.Line([i * units.gridUnits, 0, i * units.gridUnits, units.canvasHeight], { stroke: '#888', selectable: false }));
        }
        for (let i = 1; (i * units.gridUnits) < units.canvasHeight; i++) {
            newCanvas.add(new fabric.Line([0, i * units.gridUnits, units.canvasWidth, i * units.gridUnits], { stroke: '#888', selectable: false }));
        }

        let circle = new fabric.Rect({
            left: 0,
            top: 0,
            width: (10 / gridSize) * units.gridUnits,
            height: (5 / gridSize) * units.gridUnits,
            fill: '#faa',
            originX: 'left',
            originY: 'top',
            centeredRotation: true,
            selectable: true,
            lockScalingX: true,
            lockScalingY: true,
            snapAngle: 45.0
        });
        newCanvas.add(circle);

        createBooth(newCanvas);

        newCanvas.on('object:moving', (options) => {
            options.target.set({
                left: Math.round(options.target.left / units.gridUnits) * units.gridUnits,
                top: Math.round(options.target.top / units.gridUnits) * units.gridUnits,
            });
        });

        newCanvas.renderAll();
        setCanvas(newCanvas);
    };

    const createBooth = (targetCanvas) => {
        let lineOptions = {
            originX: 'left',
            originY: 'top',
            centeredRotation: true,
            selectable: false,
            stroke: '#000',
            strokeWidth: '4px',
            strokeLineCap: "round",
            strokeLineJoin: "miter",
        };

        let leftWall = new fabric.Line([0, 0, canvasUnits.gridUnits, 0], lineOptions);
        let rightWall = new fabric.Line([0, canvasUnits.gridUnits * 2, canvasUnits.gridUnits, canvasUnits.gridUnits * 2], lineOptions);
        let backWall = new fabric.Line([canvasUnits.gridUnits, 0, canvasUnits.gridUnits, canvasUnits.gridUnits * 2], lineOptions);

        targetCanvas.add(leftWall, rightWall, backWall);

        var rectGroup = new fabric.Group([leftWall, rightWall, backWall]);
        targetCanvas.add(rectGroup);
    };

    return (
        <canvas id="floorCanvas" />
    );
};

export default Layout;