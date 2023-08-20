

import { useSearchParams } from 'react-router-dom';
import { useQuery } from "react-query";
import RoomService from "../../services/RoomService";
import "../../styles/printWall.css";


const feetPerPage = 110;

const PrintRoom = (props) => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const roomId = urlSearchParams.get("roomId");
    const { data, status } = useQuery(
        `printRoom${roomId}`,
        async () => {
            let results = null;
            results = await RoomService.getRoom(roomId);
            return results;
        }
    );


    const wallName = (unitName, wall) => {
        return unitName + " - " + (
            wall.name.endsWith("OA") ? "Outside A"
            : wall.name.endsWith("OB") ? "Outside B"
            : wall.name.endsWith("OC") ? "Outside C"
            : wall.name.endsWith("A") ? "A"
            : wall.name.endsWith("B") ? "B"
            : "C"
        ); 
    };

    const quiltLabel = (quilt) => {
        return (quilt.judged ? "* " : "") + quilt.number + " " + quilt.name;
    };

    const isOnPage = (hl, start, end) => {
        let left = Math.floor(hl.location.left / 12);
        return (left >= start) && (left < end); 
    };

    const getLeft = (hl, start, end) => {
        let leftInches = hl.location.left - (start * 12);
        let widthInches = (end - start) * 12;

        return Math.floor((leftInches / widthInches) * 100);
    };

    const getTop = (hl) => {
        let topInches = hl.location.top;
        let heightInches = 10 * 12;

        return Math.floor((topInches / heightInches) * 100);
    };

    const getWidth = (hl, start, end) => {
        let quiltWidthInches = hl.quilt.width;
        let wallSectionWidthInches = (end - start) * 12;

        return Math.floor((quiltWidthInches/ wallSectionWidthInches) * 100);
    };

    const getHeight = (hl) => {
        let quiltHeightInches = hl.quilt.length;
        let wallHeightInches = 10 * 12;

        return Math.floor((quiltHeightInches / wallHeightInches) * 100);
    };


    const printWallPart = (unitName, wall, start, end) => {
        return (<div className="printable-wall" style={{width: `100%`}} key={wall.id}>
            <div className="wall-section-title">{wallName(unitName, wall)}</div>
            <div className="wall-section">
                {(wall.hangingLocations || []).filter(hl => isOnPage(hl, start, end)).map(hl => 
                    <div 
                        key={hl.id}
                        className={`hanging-location ${hl.quilt.judged ? "judged" : ""}`}
                        style={{left: `${getLeft(hl, start, end)}%`, top: `${getTop(hl, start, end)}%`, width: `${getWidth(hl, start, end)}%`, height: `${getHeight(hl, start, end)}%`}} >
                            {quiltLabel(hl.quilt, start, end)}
                    </div>
                )}
            </div>
        </div>);
    };

    const printWall = (unitName, wall) => {
        if(wall.width > feetPerPage) {
            let starts = [0];
            let i = 1;
            while((i * feetPerPage) < wall.width) { 
                starts.push(i * feetPerPage);
                i++;
            }

            return (<>
                {starts.map(start => printWallPart(unitName, wall, start, Math.min(start + feetPerPage, wall.width)))}
            </>);
        }
        else {
            return printWallPart(unitName, wall, 0, wall.width);
        }
    };

    const printHangingUnit = (hu) => {
        // print each wall
        let huContainer = (<>
            {(hu.walls || []).filter(w => (w.hangingLocations || []).length > 0).map(w =>
                printWall(hu.name, w)
            )}
        </>);

        return huContainer;
    };


    if (status === "success") {
        return (
            (data.hangingUnits || []).map(hu => printHangingUnit(hu))
        )
        }
    else {
        if (status === "loading") {
            <p>Loading room data...</p>
        }
        else {
            <p>Something went wrong, try reloading...</p>
        }
    }

};

export default PrintRoom;