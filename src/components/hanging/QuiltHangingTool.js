
import QuiltSelector from "./QuiltSelector";
import "../../styles/hangingTool.css"
import WallHanging from "./WallHanging";
import HangingUnitSelector from "./HangingUnitSelector";
import WallSelectionTool from "./WallSelectionTool";
import Announcer from "../../utilities/Announcer";
import { useState, useEffect } from "react";
import { fabric } from 'fabric';
import { withAuthHeader } from "react-auth-kit";


const testQuilts = Array.from(Array(50).keys()).map(i => { return {id: i, number: 1000 + i, name: `Quilt #${i}`, category: { name: 'President\'s Challenge - Not Judged' }, width: 8 + i, length: 40 + i }});
const testWall = { id: 43, name: "TR1-A", width: 10, height: 10 };
testWall.hangingLocations = [
    {left: 12, top: 6, quilt: testQuilts[1], hangingUnit: testWall},
    {left: 24, top: 12, quilt: testQuilts[2], hangingUnit: testWall},
    {left: 36, top: 18, quilt: testQuilts[3], hangingUnit: testWall},
];
const testRoom = { width: 80, length: 60, hangingUnits: [] };
    testRoom.hangingUnits.push({ id: 1, name: "TR1", type: "SINGLE_SIDE_WALL", leftPosition: 0, topPosition: 0, measurements: {width: 40}, walls: []});
    testRoom.hangingUnits[testRoom.hangingUnits.length-1].walls = [
        { id: 44, name: "TR1-A", width: 40, height: 10, hangingLocations: [], hangingUnit: testRoom.hangingUnits[testRoom.hangingUnits.length-1]}
    ];

    testRoom.hangingUnits.push({ id: 2, name: "BO1", type: "SINGLE_BOOTH", leftPosition: 10, topPosition: 10, measurements: {width: 10, depth: 5}, walls: [] });
    testRoom.hangingUnits[testRoom.hangingUnits.length-1].walls = [
        { id: 44, name: "BO1-A", width: 5, height: 10, hangingLocations: [], hangingUnit: testRoom.hangingUnits[testRoom.hangingUnits.length-1] },
        { id: 45, name: "BO1-B", width: 10, height: 10, hangingLocations: [], hangingUnit: testRoom.hangingUnits[testRoom.hangingUnits.length-1] },
        { id: 46, name: "BO1-C", width: 5, height: 10, hangingLocations: [], hangingUnit: testRoom.hangingUnits[testRoom.hangingUnits.length-1] },
        { id: 47, name: "BO1-D", width: 5, height: 10, hangingLocations: [], hangingUnit: testRoom.hangingUnits[testRoom.hangingUnits.length-1] },
        { id: 48, name: "BO1-E", width: 10, height: 10, hangingLocations: [], hangingUnit: testRoom.hangingUnits[testRoom.hangingUnits.length-1] },
        { id: 49, name: "BO1-F", width: 5, height: 10, hangingLocations: [], hangingUnit: testRoom.hangingUnits[testRoom.hangingUnits.length-1] },
        { id: 50, name: "BO1-G", width: 10, height: 10, hangingLocations: [], hangingUnit: testRoom.hangingUnits[testRoom.hangingUnits.length-1] },
        { id: 51, name: "BO1-H", width: 10, height: 10, hangingLocations: [], hangingUnit: testRoom.hangingUnits[testRoom.hangingUnits.length-1] },
    ];

    testRoom.hangingUnits.push({ id: 3, name: "DB1", type: "DOUBLE_BOOTH", leftPosition: 25, topPosition: 10, measurements: {width: 10, depth: 5}, walls: [] });
    testRoom.hangingUnits[testRoom.hangingUnits.length-1].walls = [
        { id: 44, name: "BO1-A", width: 5, height: 10, hangingLocations: [], hangingUnit: testRoom.hangingUnits[testRoom.hangingUnits.length-1] },
        { id: 45, name: "BO1-B", width: 10, height: 10, hangingLocations: [], hangingUnit: testRoom.hangingUnits[testRoom.hangingUnits.length-1] },
        { id: 46, name: "BO1-C", width: 5, height: 10, hangingLocations: [], hangingUnit: testRoom.hangingUnits[testRoom.hangingUnits.length-1] },
        { id: 47, name: "BO1-D", width: 5, height: 10, hangingLocations: [], hangingUnit: testRoom.hangingUnits[testRoom.hangingUnits.length-1] },
        { id: 48, name: "BO1-E", width: 10, height: 10, hangingLocations: [], hangingUnit: testRoom.hangingUnits[testRoom.hangingUnits.length-1] },
        { id: 49, name: "BO1-F", width: 5, height: 10, hangingLocations: [], hangingUnit: testRoom.hangingUnits[testRoom.hangingUnits.length-1] },
        { id: 44, name: "BO1-G", width: 5, height: 10, hangingLocations: [], hangingUnit: testRoom.hangingUnits[testRoom.hangingUnits.length-1] },
        { id: 45, name: "BO1-H", width: 10, height: 10, hangingLocations: [], hangingUnit: testRoom.hangingUnits[testRoom.hangingUnits.length-1] },
        { id: 46, name: "BO1-I", width: 5, height: 10, hangingLocations: [], hangingUnit: testRoom.hangingUnits[testRoom.hangingUnits.length-1] },
        { id: 47, name: "BO1-J", width: 5, height: 10, hangingLocations: [], hangingUnit: testRoom.hangingUnits[testRoom.hangingUnits.length-1] },
        { id: 48, name: "BO1-K", width: 10, height: 10, hangingLocations: [], hangingUnit: testRoom.hangingUnits[testRoom.hangingUnits.length-1] },
        { id: 49, name: "BO1-L", width: 5, height: 10, hangingLocations: [], hangingUnit: testRoom.hangingUnits[testRoom.hangingUnits.length-1] },
        { id: 50, name: "BO1-M", width: 10, height: 10, hangingLocations: [], hangingUnit: testRoom.hangingUnits[testRoom.hangingUnits.length-1] },
        { id: 51, name: "BO1-N", width: 10, height: 10, hangingLocations: [], hangingUnit: testRoom.hangingUnits[testRoom.hangingUnits.length-1] },
    ];
    testRoom.hangingUnits.push({ id: 4, name: "TR8", type: "SINGLE_SIDE_WALL", leftPosition: 1, topPosition: 0, angle: 90, measurements: {width: 40}, walls: [testWall] });
    testRoom.hangingUnits.push({ id: 4, name: "TR12", type: "SINGLE_SIDE_WALL", leftPosition: 80, topPosition: 0, angle: 90, measurements: {width: 40}, walls: [] });
    testRoom.hangingUnits[testRoom.hangingUnits.length-1].walls = [
        { id: 44, name: "TR12-A", width: 40, height: 10, hangingLocations: [], hangingUnit: testRoom.hangingUnits[testRoom.hangingUnits.length-1] },
    ];
    testRoom.hangingUnits.push({ id: 6, name: "TR18", type: "SINGLE_SIDE_WALL", leftPosition: 0, topPosition: 60, angle: 0, measurements: {width: 20}, walls: [testWall] });


var hangingUnitSelector = null;
var wallSelectionTool = null;
var wallHanger = null;

const QuiltHangingTool = (props) => {

    const [quilts, setQuilts] = useState(testQuilts);
    const show = props.show;


    useEffect(() => {
        if(!wallHanger) {
            console.log("Creating wallHanger");
            hangingUnitSelector = new HangingUnitSelector("hangingUnitSelector", {select: setSelectedHangingUnit});
            hangingUnitSelector.setRoom(testRoom);

            wallSelectionTool = new WallSelectionTool("wallSelector", {select: setSelectedWall});

            wallHanger = new WallHanging("wallHanging", {
                update: updateQuiltLocation, 
                remove: removeQuiltFromWall,
            });

            hangingUnitSelector.setHangingUnit(testRoom.hangingUnits[0]);
        }
    }, []);
    

    /* ********************************************************************* */
    /* Quilt actions                                                         */
    /* ********************************************************************* */
    const setSelectedHangingUnit = (unit) => {
        wallHanger.setWall(null);
        wallSelectionTool.setHangingUnit(unit);
    };

    const setSelectedWall = (wall) => {
        wallHanger.setWall(wall);
    };

    const goToQuilt = (quilt) => {
        if(quilt.hangingLocation) {
            hangingUnitSelector.setHangingUnit(quilt.hangingLocation.wall.hangingUnit);
            wallSelectionTool.setHangingUnit(quilt.hangingLocation.wall.hangingUnit);
            wallHanger.setWall(quilt.hangingLocation.wall);
            wallHanger.selectQuilt(quilt);
        }
    };

    const addQuiltToWall = (quilt) => {
        console.log(`Adding quilt ${quilt.id} to wall`);
        let hangingLocation = wallHanger.addQuilt(quilt);
        quilt.hangingLocation = hangingLocation;
        hangingLocation.wall.hangingLocations.push(hangingLocation);
        let newQuilts = [...quilts.filter(q => q.id !== quilt.id), quilt];
        setQuilts(newQuilts);
    };

    const removeQuiltFromWall = (quilt) => {
        wallHanger.removeQuilt(quilt);
        quilt.hangingLocation.wall.hangingLocations = quilt.hangingLocation.wall.hangingLocations.filter(loc => loc.quilt.id !== quilt.id);
        quilt.hangingLocation = null;
        let newQuilts = [...quilts.filter(q => q.id !== quilt.id), quilt];
        setQuilts(newQuilts);
        return true;
    };

    const updateQuiltLocation = (hangingLocation, x, y) => {
        hangingLocation.leftPosition = x;
        hangingLocation.topPosition = y;
    };

    return (
    <div className="quilt-hanging-tool-container">
        <div className="quilt-hanging-tool">
            <div id="hangingUnitSelector" className="hanging-unit-selector"></div>
            <div id="wallSelector" className="wall-selector"></div>
            <div id="quiltSelector" className="quilt-selector"><QuiltSelector quilts={quilts} selectQuilt={goToQuilt} activateQuilt={addQuiltToWall} removeQuilt={removeQuiltFromWall} show={show} /></div>
            <div id="wallHanging" className="wall-hanging"> </div>
        </div>
    </div>);
};


export default QuiltHangingTool;