
import React, { useState, useEffect } from 'react';
import "../../styles/layout.css";
import Grid, { SINGLE_UNIT_SELECTION, MULTI_UNIT_SELECTION, SELECTION_CLEARED } from './Grid';
import { HANGING_UNIT_UPDATED } from './hangingUnit/HangingUnit';
import { Room } from './Room';
import { SingleSideWall } from './hangingUnit/SingleSideWall';
import { DoubleSideWall } from './hangingUnit/DoubleSideWall';
import { Booth } from './hangingUnit/Booth';
import Announcer from './Announcer';




const Layout = (props) => {
    const [selection, setSelection] = useState({ unit: null });
    const [gridSize, setGridSize] = useState(props.gridSize || 2);
    const [room, setRoom] = useState(props.room || new Room("room", "room", 80, 60, 2, []));
    //        new SingleSideWall(1, "sample", { left: 20, top: 10, angle: 90.0 }, { length: 40 }),
    //        new DoubleSideWall(2, "sample2", { left: 50, top: 20, angle: 0.0 }, { length: 20 }),
    //        new Booth(3, "sampleBooth", { left: 0, top: 0, angle: 0.0 }, { depth: 5, width: 10 }),
    //    ]));
    const [grid, setGrid] = useState(null);
    const [announcer, setAnnouncer] = useState(new Announcer());


    const announcementHandler = (source, evt, msg) => {
        if (evt.is(SINGLE_UNIT_SELECTION) || evt.is(HANGING_UNIT_UPDATED)) {
            setSelection({ unit: msg });
        }
        else if (evt.is(MULTI_UNIT_SELECTION) || evt.is(SELECTION_CLEARED)) {
            setSelection({ unit: null });
        }
    };

    useEffect(() => {
        announcer.registerEventHandler("Layout", announcementHandler);
        setGrid(new Grid("floorCanvas", room, 2, 800, announcer));
    }, []);


    const updateRoomWidth = (evt) => {
        let newWidth = Number(evt.target.value.replaceAll(/[^0-9.]/ig, ''));
        setRoom({ ...room, width: newWidth });
    };

    const updateRoomLength = (evt) => {
        let newLength = Number(evt.target.value.replaceAll(/[^0-9.]/ig, ''));
        setRoom({ ...room, length: newLength });
    };
    const updateGridSize = (evt) => {
        setGridSize(evt.target.value.replaceAll(/[^0-9.]/ig, ''));
    };

    const updateGrid = () => {
        grid.updateRoom(room, gridSize);
    };


    const addSingleWall = () => {
        let id = Date.now();
        let unit = new SingleSideWall(id, `Wall ${id}`);
        grid.addHangingUnit(unit, true);
        room.hangingUnits.push(unit);
        setRoom({ ...room });
    };

    const addDoubleWall = () => {
        let id = Date.now();
        let unit = new DoubleSideWall(id, `Wall ${id}`);
        grid.addHangingUnit(unit, true);
        room.hangingUnits.push(unit);
        setRoom({ ...room });
    };

    const addBooth = () => {
        let id = Date.now();
        let unit = new Booth(id, `Booth ${id}`);
        grid.addHangingUnit(unit, true);
        room.hangingUnits.push(unit);
        setRoom({ ...room });
    };


    return (
        <div className="floor-layout-container">
            <div className='grid-container'>
                <div className="room-values">
                    <div><label htmlFor="room-width">Room Width (ft) &#8596;</label><input id="room-width" value={room.width} onChange={updateRoomWidth} /></div>
                    <div><label htmlFor="room-length">Room Length (ft)  &#8597;</label><input id="room-length" value={room.length} onChange={updateRoomLength} /></div>
                    <div><label htmlFor="grid-size">Grid size (ft)</label><input id="grid-size" value={gridSize} onChange={updateGridSize} /></div>
                    <div><button id="update-grid" onClick={updateGrid}>Update Room</button></div>
                </div>
                <canvas id="floorCanvas" />
            </div>
            <div className="floor-layout-operations">
                <div className='add-units'>
                    <button id="add-single-wall" onClick={addSingleWall}>Add Single Sided Wall</button>
                    <button id="add-single-wall" onClick={addDoubleWall}>Add Double Sided Wall</button>
                    <button id="add-single-wall" onClick={addBooth}>Add Booth</button>
                </div>
                <div className='grid-controls'>
                    {selection?.unit ? selection.unit.buildForm(announcer) : (<></>)}
                </div>
            </div>
        </div>
    )
};

export default Layout;