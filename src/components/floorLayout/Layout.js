
import React, { useState, useEffect } from 'react';
import "../../styles/layout.css";
import RoomService from "../../services/RoomService";
import HangingUnitFactory from "./hangingUnit/HangingUnitFactory";
import Grid, { SINGLE_UNIT_SELECTION, MULTI_UNIT_SELECTION, SELECTION_CLEARED } from './Grid';
import { HANGING_UNIT_UPDATED, HANGING_UNIT_DELETED } from './hangingUnit/HangingUnit';
import { Room } from './Room';
import { Wall } from './hangingUnit/Wall';
import { Block } from './hangingUnit/Block';
import { Door } from './hangingUnit/Door';
import { UBooth } from './hangingUnit/UBooth';
import { HBooth } from './hangingUnit/HBooth';
import Announcer from '../../utilities/Announcer';
import RoomSelector from './RoomSelector';
import UnitList from './UnitList';




const Layout = (props) => {
    const [selection, setSelection] = useState({ unit: null });
    const [gridSize, setGridSize] = useState(props.gridSize || 2);
    const [room, setRoom] = useState({});
    const [saveResult, setSaveResult] = useState("");
    const [rooms, setRooms] = useState([]);
    const [roomSelection, setRoomSelection] = useState(null);

    const [grid, setGrid] = useState(null);
    const [announcer, setAnnouncer] = useState(new Announcer());


    const announcementHandler = (source, evt, msg) => {
        if (evt.is(SINGLE_UNIT_SELECTION) || evt.is(HANGING_UNIT_UPDATED)) {
            setSelection({ unit: msg });
        }
        else if (evt.is(MULTI_UNIT_SELECTION) || evt.is(SELECTION_CLEARED)) {
            setSelection({ unit: null });
        }
        else if(evt.is(HANGING_UNIT_DELETED)) {
            removeHangingUnit(msg, source);
        }
    };

    useEffect(() => {
        async function fetchRooms() {
            let rooms = await RoomService.getRooms();
            setRooms(rooms);
            announcer.registerEventHandler("Layout", announcementHandler);
            let startingRoom = rooms.length > 0 ? rooms[0] : new Room("room", "room", 80, 60, 2, []);
            rooms.forEach(r => { if(r.active) { startingRoom = r; } });

            normalizeRoom(startingRoom);
            setRoom(startingRoom);
            setGrid(new Grid("floorCanvas", startingRoom, 2, 800, announcer));
        }
        fetchRooms();
    }, []);


    const normalizeRoom = (sysRoom) => {
        if(sysRoom.hangingUnits) {
            sysRoom.hangingUnits = sysRoom.hangingUnits.map(u => HangingUnitFactory.getUnit(u));
        }

        return sysRoom;
    };

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

    const loadRoom = async () => {
        document.getElementById("selectRoom").showModal();
    };

    const selectRoom = async () => {
        if(roomSelection) {
            let selectedRoom = await RoomService.getRoom(roomSelection);

            normalizeRoom(selectedRoom);

            grid.updateRoom(selectedRoom);
            setRoom(selectedRoom);
        }

        document.getElementById("selectRoom").close();
    };

    const newRoom = () => {
        let newRoom = new Room("room", "room", 80, 60, 2, []);
        grid.updateRoom(newRoom);
        setRoom(newRoom);
    };

    const saveRoom = async () => {
        if(room.id) {
            room.hangingUnits = grid.getHangingUnits();
            let savedRoom = await RoomService.saveRoom(room);
            normalizeRoom(savedRoom);

            setRoom(savedRoom);
            setSaveResult("Room saved");
            grid.updateRoom(savedRoom);
            document.getElementById("saveResult").showModal();
        }
        else {
            document.getElementById("newRoomDialog").showModal();
        }
    };

    const saveNewRoom = async() => {
        if(!room.name || room.name === "") {
            return;
        }

        room.hangingUnits = grid.getHangingUnits();
        let savedRoom = await RoomService.saveRoom(room);
        normalizeRoom(savedRoom);

        setRoom(savedRoom);
        setSaveResult("Room saved");
        grid.updateRoom(savedRoom);
        
        setRooms([...rooms, savedRoom]);
        document.getElementById("newRoomDialog").close();
        document.getElementById("saveResult").showModal();
    };


    const addSingleWall = () => {
        let id = RoomService.getTempId();
        let label = grid.getHangingUnits().length + 1;
        let unit = new Wall(id, `Wall ${label}`);
        grid.addHangingUnit(unit, true);
    };

    const addUBooth = () => {
        let id = RoomService.getTempId();
        let label = grid.getHangingUnits().length + 1;
        let unit = new UBooth(id, `Booth ${label}`);
        grid.addHangingUnit(unit, true);
    };

    const addHBooth = () => {
        let id = RoomService.getTempId();
        let label = grid.getHangingUnits().length + 1;
        let unit = new HBooth(id, `Booth ${label}`);
        grid.addHangingUnit(unit, true);
    };

    const addBlock = () => {
        let id = RoomService.getTempId();
        let label = grid.getHangingUnits().length + 1;
        let unit = new Block(id, `Block ${label}`);
        grid.addHangingUnit(unit, true);
    };

    const addDoor = () => {
        let id = RoomService.getTempId();
        let label = grid.getHangingUnits().length + 1;
        let unit = new Door(id, `Door ${id}`);
        grid.addHangingUnit(unit, true);
    };

    const printRoom = () => {
        let url = grid.getDataUrl();
        let link = document.createElement("a");
        link.download = room.name;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const hoverUnit = (hangingUnit, unitGrid) => {
        if(unitGrid) {
            unitGrid.highlightUnit(hangingUnit);
        }
        else {
            grid.highlightUnit(hangingUnit);
        }
    };

    const copyHangingUnit = (unit, unitGrid) => {
        let id = RoomService.getTempId();
        let copiedUnit = unit.copy();
        copiedUnit.setId(id);

        let regex = new RegExp(`^${unit.getName()}( [0-9]*)?$`)
        let copyCount = grid.getHangingUnits().filter(u => u.getName().match(regex)).length;
        copiedUnit.setName(`${copiedUnit.getName()} ${copyCount}`);

        copiedUnit.location.left = copiedUnit.location.left + gridSize * copyCount;
        copiedUnit.location.top = copiedUnit.location.top + gridSize * copyCount;

        grid.addHangingUnit(copiedUnit, false);
    };

    const removeHangingUnit = (unit, unitGrid) => {
        if(unitGrid) {
            unitGrid.removeHangingUnit(unit);
        } else {
            grid.removeHangingUnit(unit);
        }

        if(unit === selection?.unit) {
            setSelection({ unit: null });
        }
    };

    const selectUnit = (unit) => {
        setSelection({ unit: unit });
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
                <div><button id="new-room" onClick={newRoom}>New Room</button></div>
                <div><button id="load-room" onClick={loadRoom}>Load Room</button></div>
                <div><button id="save-room" onClick={saveRoom}>Save Room</button></div>
                <div><button id="add-single-wall" onClick={addSingleWall}>Add Wall</button></div>
                <div><button id="add-booth" onClick={addUBooth}>Add "U" Booth</button></div>
                <div><button id="add-booth" onClick={addHBooth}>Add "H" Booth</button></div>
                <div><button id="add-door" onClick={addDoor}>Add Door</button></div>
                <div><button id="add-block" onClick={addBlock}>Add Block</button></div>
                <div><button id="print-room" onClick={printRoom}>Download Image</button></div>
            </div>
            <div className='grid-controls'>
                {selection?.unit ? selection.unit.buildForm(announcer) : (<></>)}
                {selection?.unit 
                    ?   (<>
                            <button id="remove-unit" onClick={() => removeHangingUnit(selection.unit)}>Remove</button>
                            <button id="copy-unit" onClick={() => copyHangingUnit(selection.unit)}>Create Copy</button>
                        </>)
                    : (<></>)
                }
                {!selection?.unit
                    ? <UnitList units={grid?.getHangingUnits()} highlightUnit={(unit) => hoverUnit(unit, grid)} selectUnit={selectUnit} />
                    : <></>
                }
            </div>
            <dialog id="saveResult">
                <p>{saveResult}</p>
                <form method='dialog'>
                    <button>OK</button>
                </form>
            </dialog>
            <dialog id="selectRoom">
                <RoomSelector rooms={rooms} currentRoom={roomSelection} selectRoom={setRoomSelection} />
                <div>
                    <button onClick={selectRoom}>Ok</button>
                    <button onClick={() => document.getElementById("selectRoom").close()}>Cancel</button>
                </div>
            </dialog>
            <dialog id="newRoomDialog">
                <div>
                    <label htmlFor="room.name">Room Name</label>
                    <input type="text" value={room.name} onChange={(evt) => setRoom({...room, name: evt.target.value})} />
                </div>
                <div>
                    <label htmlFor="room.description">Description</label>
                    <input type="textarea" value={room.description} onChange={(evt) => setRoom({...room, description: evt.target.value})} />
                </div>
                <div>
                    <button onClick={saveNewRoom}>Ok</button>
                    <button onClick={() => document.getElementById("newRoomDialog").close()}>Cancel</button>
                </div>
            </dialog>
        </div>
    )
};

export default Layout;