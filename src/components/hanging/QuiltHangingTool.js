
import QuiltSelector from "./QuiltSelector";
import "../../styles/hangingTool.css"
import WallHanging from "./WallHanging";
import HangingUnitSelector from "./HangingUnitSelector";
import WallSelectionTool from "./WallSelectionTool";
import Announcer from "../../utilities/Announcer";
import { useState, useEffect } from "react";
import { fabric } from 'fabric';
import { withAuthHeader } from "react-auth-kit";


const testQuilts = Array.from(Array(50).keys()).map(i => { return {id: i, name: `Quilt #${i}`, width: 8 + i, length: 40 + i }});
const testWall = { id: 43, name: "TR1-A", width: 10, height: 10, hangingLocations: [
    {left: 12, top: 6, quilt: testQuilts[1]},
    {left: 24, top: 12, quilt: testQuilts[2]},
    {left: 36, top: 18, quilt: testQuilts[3]},
] };
const testRoom = { width: 80, length: 60, hangingUnits: [
    { id: 1, name: "TR1", type: "SINGLE_SIDE_WALL", leftPosition: 0, topPosition: 0, measurements: {width: 40} },
    { id: 2, name: "BO1", type: "SINGLE_BOOTH", leftPosition: 10, topPosition: 10, measurements: {width: 10, depth: 5} , walls: [
        { id: 44, name: "BO1-A", width: 5, height: 10, hangingLocations: [] },
        { id: 45, name: "BO1-B", width: 10, height: 10, hangingLocations: [] },
        { id: 46, name: "BO1-C", width: 5, height: 10, hangingLocations: [] },
        { id: 47, name: "BO1-D", width: 5, height: 10, hangingLocations: [] },
        { id: 48, name: "BO1-E", width: 10, height: 10, hangingLocations: [] },
        { id: 49, name: "BO1-F", width: 5, height: 10, hangingLocations: [] },
        { id: 50, name: "BO1-G", width: 10, height: 10, hangingLocations: [] },
        { id: 51, name: "BO1-H", width: 10, height: 10, hangingLocations: [] },
    ]},
    { id: 3, name: "DB1", type: "DOUBLE_BOOTH", leftPosition: 25, topPosition: 10, measurements: {width: 10, depth: 5} },
    { id: 4, name: "TR8", type: "SINGLE_SIDE_WALL", leftPosition: 1, topPosition: 0, angle: 90, measurements: {width: 40}, walls: [testWall] },
    { id: 4, name: "TR12", type: "SINGLE_SIDE_WALL", leftPosition: 80, topPosition: 0, angle: 90, measurements: {width: 40} },
    { id: 6, name: "TR18", type: "SINGLE_SIDE_WALL", leftPosition: 20, topPosition: 60, angle: 180, measurements: {width: 20} },
]};

var hangingUnitSelector = null;
var wallSelectionTool = null;
var wallHanger = null;

const QuiltHangingTool = (props) => {

    const [wall, setWall] = useState(testWall);
    const [quilts, setQuilts] = useState(testQuilts);


    useEffect(() => {
        if(!wallHanger) {
            console.log("Creating wallHanger");
            hangingUnitSelector = new HangingUnitSelector("hangingUnitSelector", {select: (unit) => console.log(`Selected ${unit.id}`)});
            hangingUnitSelector.setRoom(testRoom);

            wallSelectionTool = new WallSelectionTool("wallSelector", {select: (wall) => console.log(`Selected wall ${wall.id}`)});
            wallSelectionTool.setHangingUnit(testRoom.hangingUnits[1]);

            wallHanger = new WallHanging("wallHanging", {
                update: updateQuiltLocation, 
                remove: removeQuiltFromWall,
            });
            wallHanger.setWall(wall);
        }
    }, []);
    

    /* ********************************************************************* */
    /* Quilt actions                                                         */
    /* ********************************************************************* */
    const addQuiltToWall = (quilt) => {
        console.log(`Adding quilt ${quilt.id} to wall`);
        let hangingLocation = wallHanger.addQuilt(quilt);
        quilt.hangingLocation = hangingLocation;
        let newQuilts = [...quilts.filter(q => q.id !== quilt.id), quilt];
        setQuilts(newQuilts);
    };

    const removeQuiltFromWall = (quilt) => {
        wallHanger.removeQuilt(quilt);
        quilt.hangingLocation = null;
        wall.hangingLocations = wall.hangingLocations.filter(loc => loc.quilt.id !== quilt.id);
        let newQuilts = [...quilts.filter(q => q.id !== quilt.id), quilt];
        setQuilts(newQuilts);
        return true;
    };

    const updateQuiltLocation = (hangingLocation) => {

    };

    return (
    <div className="quilt-hanging-tool-container">
        <div className="quilt-hanging-tool">
            <div id="hangingUnitSelector" className="hanging-unit-selector"></div>
            <div id="wallSelector" className="wall-selector"></div>
            <div id="quiltSelector" className="quilt-selector"><QuiltSelector quilts={quilts} activateQuilt={addQuiltToWall} /></div>
            <div id="wallHanging" className="wall-hanging"> </div>
        </div>
    </div>);
};


export default QuiltHangingTool;