
const UnitSelector = (props) => {

    const {currentRoom, currentUnit, selectUnit, selectQuilt, currentQuilt} = props;

    if(!currentRoom) {
        return (<></>);
    }

    const changeSelection = (e) => {
        let val = e.target.value;
        
        if(val !== "") {
            let id = Number(val);
            selectUnit(currentRoom.hangingUnits.filter(hu => hu.id === id)[0]);
        }
    };

    const changeQuilt = (e) => {
        let val = e.target.value;

        if(val && (val !== "")) {
            let quiltLocation = null;
            currentUnit.walls.forEach(w => w.hangingLocations.forEach(hl => quiltLocation = (hl.quilt.id === Number(val) ? hl : quiltLocation)));
            selectQuilt(quiltLocation.quilt);
        }
    };

    return (
        <div className="unit-selector">
            <br/>
            <b>Select Hanging Unit</b><br/>
            <select id="unit-selector" onChange={changeSelection} value={currentUnit?.id || ""}>
                <option value={""}>Select Hanging Unit</option>
                {
                    currentRoom.hangingUnits.map(hu => <option value={hu.id}>{hu.name}</option>)
                }
            </select>
            <br/><br/>
            {currentUnit && (<div>
            <b>Select Quilt</b><br/>
            <select id="hung-quilts-selector" onChange={changeQuilt} value={currentQuilt?.quilt?.id || ""}>
                    <option value={""}>Select Quilt on Unit</option>
                    {
                        currentUnit.walls.map(w => <>
                            {w.hangingLocations.map(hl => <option value={hl.quilt.id}>{`${hl.quilt.number} - ${hl.quilt.name}`}</option>)}
                        </>)
                    }                   
                </select>
            </div>)}
        </div>
    );
};


export default UnitSelector;