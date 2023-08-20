import { useState } from 'react';

const QuiltLocationForm = (props) => {
    const { updateQuiltLocation, currentQuilt } = props;


    const setTop = (val) => {
        updateQuiltLocation(currentQuilt, currentQuilt.location.left, val);
    };

    const setLeft = (val) => {
        updateQuiltLocation(currentQuilt, val, currentQuilt.location.top);
    };

    const stringify =(num) => {
        if((num === null) || (num === undefined)) {
            return "";
        }

        return String(Number(num).toFixed(0));
    };

    return (
        <div className="quilt-location-form">
            <div className="form-field">
                <div className="label">Top position {currentQuilt?.quilt?.number || "none"}</div>
                <div className="value"><input type="text" id="current-quilt-top" value={stringify(currentQuilt?.location?.top)} onChange={(e) => setTop(Number(e.target.value))}/></div>
            </div>
            <div className="form-field">
                <div className="label">Left position {currentQuilt.left} {currentQuilt.top}</div>
                <div className="value"><input type="text" id="current-quilt-left" value={stringify(currentQuilt?.location?.left)} onChange={(e) => setLeft(Number(e.target.value))}/></div>
            </div>
        </div>
    );
};

export default QuiltLocationForm;