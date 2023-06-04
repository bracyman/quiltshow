
import QuiltSelector from "./QuiltSelector";
import "../../styles/hangingTool.css"
import WallHanging from "./WallHanging";
import HangingUnitSelector from "./HangingUnitSelector";
import WallSelectionTool from "./WallSelectionTool";
import { useState, useEffect } from "react";
import RoomSelector from "../floorLayout/RoomSelector";
import RoomService from "../../services/RoomService";
import LoadingButton from "../LoadingButton";

var hangingUnitSelector = null;
var wallSelectionTool = null;
var wallHanger = null;


const QuiltHangingTool = (props) => {
    const [rooms, setRooms] = useState([]);
    const [room, setRoom] = useState(null);
    const [saveMessage, setSaveMessage] = useState("");
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [hangedQuilts, setHangedQuilts] = useState([]);
    const [updateFlag, setUpdateFlag] = useState(0);
    const [breadcrumb, setBreadcrumb] = useState({});
    const show = props.show;


    useEffect(() => {

        if(!wallHanger) {
            console.log("Creating wallHanger");
            hangingUnitSelector = new HangingUnitSelector("hangingUnitSelector", {select: setSelectedHangingUnit});

            wallSelectionTool = new WallSelectionTool("wallSelector", {select: setSelectedWall});

            wallHanger = new WallHanging("wallHanging", {
                update: updateQuiltLocation, 
                remove: removeQuiltFromWall,
            });

        }

        RoomService.getRoomsPromise()
            .then(response => response.json())
            .then(fetchedRooms => {
                console.log(`Loaded ${fetchedRooms.length} rooms`);
                setRooms(fetchedRooms)
                let activeRoom = null;
    
                if(fetchedRooms.length === 1) {
                    activeRoom = fetchedRooms[0];
                }
                else if(fetchedRooms.filter(r => r.active).length > 0) {
                    activeRoom = fetchedRooms.filter(r => r.active)[0];
                }
    
                if(activeRoom) {
                    hangingUnitSelector.setRoom(activeRoom);
                    setRoom(activeRoom);
                    setSelectedRoomId(activeRoom.id);
                }
            });
    }, []);
    
    
    /* ********************************************************************* */
    /* Hanging Display actions                                               */
    /* ********************************************************************* */
    const showRoom = (roomToShow) => {
        // hide the wall selector and hanging display
        document.getElementById("wallSelector").classList.add("hidden");
        document.getElementById("wallHanging").classList.add("hidden");

        // show the room
        document.getElementById("hangingUnitSelector").classList.remove("hidden");

        wallSelectionTool.setHangingUnit(null);
        wallHanger.setWall(null);

        setBreadcrumb({ room: roomToShow });
    };

    const showWallSelector = (unitToShow) => {
        // hide the wall selector and hanging display
        document.getElementById("hangingUnitSelector").classList.add("hidden");
        document.getElementById("wallHanging").classList.add("hidden");

        // show the room
        document.getElementById("wallSelector").classList.remove("hidden");

        wallHanger.setWall(null);
 
        setBreadcrumb({ ...breadcrumb, unit: unitToShow, wall: null });
    };

    const showWallHanger = (wallToShow) => {
        // hide the wall selector and hanging display
        document.getElementById("hangingUnitSelector").classList.add("hidden");
        document.getElementById("wallSelector").classList.add("hidden");

        // show the room
        document.getElementById("wallHanging").classList.remove("hidden");

        setBreadcrumb({ ...breadcrumb, wall: wallToShow });
    };


    /* ********************************************************************* */
    /* Quilt actions                                                         */
    /* ********************************************************************* */
    const setSelectedHangingUnit = (unit) => {
        wallHanger.setWall(null);
        showWallSelector(unit);
        wallSelectionTool.setHangingUnit(unit);
    };

    const setSelectedWall = (wall) => {
        showWallHanger(wall);
        wallHanger.setWall(wall);
    };

    const getQuiltLocation = (quilt) => {
        let quiltLocation = null;
        if(room) {
            room.hangingUnits.forEach(unit => {
                unit.walls.forEach(w => {
                    if(w.hangingLocations) {
                        w.hangingLocations.forEach(location => {
                            if(location.quilt.id === quilt.id) {
                                quiltLocation = location;
                            }
                        });
                    }
                });              
            });
        }

        return quiltLocation;
    };

    const goToQuilt = (quilt) => {
        if(room) {
            room.hangingUnits.forEach(unit => {
                unit.walls.forEach(w => {
                    if(w.hangingLocations) {
                        w.hangingLocations.forEach(location => {
                            if(location.quilt.id === quilt.id) {
                                hangingUnitSelector.setHangingUnit(unit);
                                wallSelectionTool.setHangingUnit(unit);
                                showWallHanger(w);
                                wallHanger.setWall(w);
                                wallHanger.selectQuilt(quilt);
                                return;
                            }
                        });
                    }
                });              
            });
        }
    };

    const addQuiltToWall = async (quilt) => {
        if(wallHanger.showingWall()) {
            console.log(`Adding quilt ${quilt.id} to wall`);
            let location = wallHanger.addQuilt(quilt);
            let wallId = location.wall;

            if(wallId instanceof Object) {
                wallId = wallId.id;
            }
            let submission = {...location, quilt: {id: quilt.id}, wall: { id: wallId} };

            let savedLocation = await RoomService.hangQuilt(wallId, submission);
            setUpdateFlag(updateFlag => updateFlag + 1);
            location.id = savedLocation.id;
        }
    };

    const removeQuiltFromWall = async (quilt) => {
        wallHanger.removeQuilt(quilt);
        let location = getQuiltLocation(quilt);
        if(location) {
            location.quilt = null;
            location.wall.hangingLocations = location.wall.hangingLocations.filter(l => l.id !== location.id);
        }
        await RoomService.unhangQuilt(quilt.id);

        setUpdateFlag(updateFlag => updateFlag - 1);
        return true;
    };

    const updateQuiltLocation = async (hangingLocation, x, y) => {
        hangingLocation.location.left = x;
        hangingLocation.location.top = y;

        let submission = {id: hangingLocation.id, location: hangingLocation.location};

        await RoomService.updateQuiltLocation(hangingLocation.quilt.id, submission);
    };

    const loadRoom = async () => {
        if(selectedRoomId) {
            let loadedRoom = await RoomService.getRoom(selectedRoomId);
            setRoom(loadedRoom);
            hangingUnitSelector.setRoom(loadedRoom);
            showRoom(loadedRoom);
        }
    };

    return (
        <div className="quilt-hanging-tool-container">
            <div className="quilt-hanging-tool">
                <div id="hangingToolActions" className="hanging-tool-actions">
                    <RoomSelector rooms={rooms} currentRoom={selectedRoomId} selectRoom={setSelectedRoomId} />
                    <LoadingButton id="load" loadingLabel="Loading..." method={loadRoom}>Load</LoadingButton>
                </div>
                <div className="hanging-display-breadcrumb">
                    { hangingUnitSelector?.room ? <div className="breadcrumb"><a onClick={() => showRoom(hangingUnitSelector.room)} >{hangingUnitSelector.room.name}</a></div>: <></>}
                    { wallSelectionTool?.hangingUnit ? <div className="breadcrumb"><a onClick={() => showWallSelector(wallSelectionTool.hangingUnit)} >{wallSelectionTool.hangingUnit.name}</a></div>: <></>}
                    { wallHanger?.wall ? <div className="breadcrumb"><a onClick={() => showWallHanger(wallHanger.wall)} >{wallHanger.wall.name}</a></div>: <></>}
                </div>
                <div className="hanging-display-container">
                    <div id="hangingUnitSelector" className="hanging-unit-selector"></div>
                    <div id="wallSelector" className="wall-selector hidden"></div>
                    <div id="wallHanging" className="wall-hanging hidden"></div>
                </div>
                <div id="quiltSelector" className="quilt-selector">
                    <QuiltSelector updateFlag={updateFlag} selectQuilt={goToQuilt} getLocation={getQuiltLocation} activateQuilt={addQuiltToWall} removeQuilt={removeQuiltFromWall} show={show} />
                </div>
            </div>
            <dialog id="saveMessage">
                <p>{saveMessage}</p>
                <form method="dialog">
                    <button>OK</button>
                </form>
            </dialog>
        </div>
    );
};


export default QuiltHangingTool;