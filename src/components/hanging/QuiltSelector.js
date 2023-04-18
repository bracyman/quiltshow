
import { useState } from "react";
import { Sorters } from "../quilts/QuiltFields";


const QuiltSelector = (props) => {
    const [startingIndex, setStartingIndex] = useState(0);
    const [startingWidth, setStartingWidth] = useState(null);
    const [selectedQuilt, setSelectedQuilt] = useState(null);
    const [lastDropped, setLastDropped] = useState(0);

    const quilts = (props.quilts || []).sort((a, b) => Sorters.width(a,b) * -1);


    /* ******************************************************************** */
    /*    Configuration                                                     */
    /* ******************************************************************** */
    const getAmountToDisplay = () => {
        return 16;
    };


    /* ******************************************************************** */
    /*    Starting Width Handlers                                           */
    /* ******************************************************************** */
    const getStartingWidth = () => {
        return startingWidth || quilts[0].width;
    };

    const updateStartingWidth = (evt) => {
        if(evt.target.value) {
            let newStartingWidth = Number(evt.target.value);

            let newStartingIndex = 0;
            while((newStartingIndex < quilts.length) && (quilts[newStartingIndex].width > newStartingWidth)){ 
                newStartingIndex++; 
            }

            if((quilts.length - getAmountToDisplay()) < newStartingIndex) {
                newStartingIndex = Math.max(0, (quilts.length - getAmountToDisplay()));
            }

            setStartingIndex(newStartingIndex);
            setStartingWidth(newStartingWidth);
        }
    };


    /* ******************************************************************** */
    /*    List Button Handlers                                              */
    /* ******************************************************************** */
    const dragStart = (evt, quilt) => {
        console.log(`Dragging quilt ${quilt.id}`);
        evt.dataTransfer.setData("quilt", JSON.stringify(quilt));
    };


    /* ******************************************************************** */
    /*    List Button Handlers                                              */
    /* ******************************************************************** */
    const stepLeft = () => {
        let newStartingIndex =  Math.max(0, startingIndex - getAmountToDisplay());
        setStartingIndex(newStartingIndex);
        setStartingWidth(quilts[newStartingIndex].width);
    };

    const stepRight = () => {
        let newStartingIndex =  Math.min(quilts.length - getAmountToDisplay(), startingIndex + getAmountToDisplay());
        setStartingIndex(newStartingIndex);
        setStartingWidth(quilts[newStartingIndex].width);
    };

    const goToStart = () => {
        setStartingIndex(0);
        setStartingWidth(quilts[0].width);
    };

    const goToEnd = () => {
        let newStartingIndex =  Math.max(quilts.length - getAmountToDisplay(), 0);
        setStartingIndex(newStartingIndex);
        setStartingWidth(quilts[newStartingIndex].width);
    };


    const buildQuiltList = () => {
        let displayed = quilts.slice(startingIndex, startingIndex + getAmountToDisplay());
        return (
            <div className="quilt-list">
                {displayed.map(q => (
                    <div 
                        className={`quilt ${(q.id === selectedQuilt?.id) ? "selected" : ""}`} 
                        key={`quilt${q.id}`} 
                        onClick={() => setSelectedQuilt(q)}
                        draggable={true}
                        onDragStart={(e) => dragStart(e, q)}
                        >
                            {`${q.width} X ${q.length}`}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="quilt-selector">
            <div className="navigation">
                <div className="step-buttons">
                    <button className="step-start" label="Widest" onClick={goToStart}>&lt;&lt;</button>
                    <button className="step-left" label="Wider" onClick={stepLeft}>&lt;</button>
                </div>
                <div className="width-selector">
                    <label htmlFor="startingWidth">Width</label>
                    <input name="startingWidth" id="startingWith" className="width" value={startingWidth || ""} onChange={updateStartingWidth}/>
                </div>
                <div className="step-buttons">
                    <button className="step-right" label="Narrower" onClick={stepRight}>&gt;</button>
                    <button className="step-end" label="Narrowest" onClick={goToEnd}>&gt;&gt;</button>
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


export default QuiltSelector;