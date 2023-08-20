import { useState } from "react";
import "./styles/UnitList.css";

const UnitList = (props) => {
    const [sortBy, setSortBy] = useState("name");

    if(!props.units) {
        return (<></>);
    }

    const renderType = (unitType) => {
        if(unitType === "WALL") return "Wall";
        if(unitType === "UBOOTH") return "U-Booth";
        if(unitType === "HBOOTH") return "H-Booth";
        if(unitType === "DOOR") return "Door";
        if(unitType === "BLOCK") return "Block";
        return unitType;
    };

    const handleClick = (unit) => {
        console.log(`Selected ${unit.unitType} ${unit.id}`);
        props.selectUnit(unit)
    };

    return (
        <div className="unit-list">
            <div className="header" key="units-header">
                <div className="field-name" onClick={() => setSortBy("name")}>Name</div>
                <div className="field-name" onClick={() => setSortBy("unitType")}>Type</div>
            </div>
            {(props.units || []).sort((a, b) => (a[sortBy] > b[sortBy]) ? 1 : -1).map(unit => 
                <div className="unit" onClick={() => handleClick(unit)} onMouseOver={() => props.highlightUnit(unit)} onMouseOut={() => props.highlightUnit(null)} key={`unit${unit.id}`}>
                    <div className="field">{unit.name}</div>
                    <div className="field">{renderType(unit.unitType)}</div>
                </div>
            )}
        </div>
    );


};

export default UnitList;