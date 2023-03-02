import React from "react";
import Layout from "./components/floorLayout/Layout";
import "./styles/layout.css";

const FloorLayout = (props) => {

    return (
        <>
            <div className="floor-layout-container">
                <div className="floor-container"><Layout /></div>
                <div className="structure-container"></div>
                <div className="group-container"></div>
                <div className="operations-container"></div>
            </div>
        </>
    );

};

export default FloorLayout;