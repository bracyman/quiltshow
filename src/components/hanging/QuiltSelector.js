
import { useState } from "react";
import { Sorters } from "../quilts/QuiltFields";


const QuiltSelector = (props) => {
    const [startingWidth, setStartingWidth] = useState(null);

    const quilts = (props.quilts || []).filter(q => startingWidth ? (q.width <= startingWidth) : true).sort((a, b) => Sorters.width(a,b) * -1);
    const selectedQuilt = props.selectedQuilt;
    const activateQuilt = props.activateQuilt;


    /* ******************************************************************** */
    /*    Configuration                                                     */
    /* ******************************************************************** */

    /* ******************************************************************** */
    /*    Starting Width Handlers                                           */
    /* ******************************************************************** */
    const updateStartingWidth = (evt) => {
        if(evt.target.value) {
            let newStartingWidth = Number(evt.target.value);
            setStartingWidth(newStartingWidth);
        }
        else {
            setStartingWidth(null);
        }
    };


    /* ******************************************************************** */
    /*    Quilt Action Handlers                                             */
    /* ******************************************************************** */
    const selectQuilt = (e, quilt) => {
        if(activateQuilt) {
            activateQuilt(quilt);
        }
    };

    const buildQuiltList = () => {
        return (
            <div className="quilt-list">
                {quilts.map(q => {
                    if(((q.hangingLocation !== undefined) && (q.hangingLocation !== null))) {
                        console.log(`Hiding quilt ${q.width}`);
                    }
                    return (
                    <button 
                        className={`quilt ${(q.id === selectedQuilt?.id) ? "selected" : ""}`} 
                        hidden={((q.hangingLocation !== undefined) && (q.hangingLocation !== null)) ? true : false}
                        key={`quilt${q.id}`} 
                        onClick={(e) => selectQuilt(e, q)}
                        >
                            {`${q.width} X ${q.length}`}
                    </button>
                );})}
            </div>
        );
    };

    return (
        <div className="quilt-selector">
            <div className="navigation">
                <div className="width-selector">
                    <label htmlFor="startingWidth">Width</label>
                    <input name="startingWidth" id="startingWith" className="width" value={startingWidth || ""} onChange={updateStartingWidth}/>
                </div>
            </div>
            {buildQuiltList()}
            <div className="selected-quilt">
                <div className="name">{selectedQuilt?.name || ""}</div>
                {selectedQuilt 
                    ? (<div className="measurements">{`Width: ${selectedQuilt.width} X Height: ${selectedQuilt.length}`}</div>)
                    : (<></>)
                }
            </div>
        </div>
    );
};


/*
                <div className="step-buttons">
                    <button className="step-start" label="Widest" onClick={goToStart}>&lt;&lt;</button>
                    <button className="step-left" label="Wider" onClick={stepLeft}>&lt;</button>
                </div>
                <div className="step-buttons">
                    <button className="step-right" label="Narrower" onClick={stepRight}>&gt;</button>
                    <button className="step-end" label="Narrowest" onClick={goToEnd}>&gt;&gt;</button>
                </div>




*/

export default QuiltSelector;