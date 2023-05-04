
import { useState } from "react";
import { Sorters, alphaSort } from "../quilts/QuiltFields";
import {Tab, Tabs} from "react-bootstrap";


const SORT_WIDTH    = "Width";
const SORT_CATEGORY = "Category";
const SORT_NUMBER   = "Entry Number";
const SORT_TAGS     = "Seasonal";


const QuiltSelector = (props) => {
    const [startingWidth, setStartingWidth] = useState(null);
    const [sortType, setSortType] = useState(SORT_WIDTH);
    const [quilts, setQuilts] = useState((props.quilts || []).filter(q => startingWidth ? (q.width <= startingWidth) : true).sort((a, b) => Sorters.width(a,b) * -1));

    const show = props.show;
    const goToQuiltLocation = props.selectQuilt;
    const activateQuilt = props.activateQuilt;
    const unHang = props.removeQuilt;


    /* ******************************************************************** */
    /*    Configuration                                                     */
    /* ******************************************************************** */

    /* ******************************************************************** */
    /*    List Action    Handlers                                           */
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

    const sortQuilts = (evt) => {
        setSortType(evt.target.value);
        switch(evt.target.value) {
            case SORT_WIDTH:
                setQuilts(quilts.sort((a, b) => Sorters.width(a,b) * -1));
                break;

            case SORT_CATEGORY:
                setQuilts(quilts.sort((a, b) => Sorters.category(a,b)));
                break;

            case SORT_NUMBER:
                let newQuilts = quilts.sort((a, b) => Sorters.number(a,b));
                setQuilts(newQuilts);
                break;

            case SORT_TAGS:
                setQuilts(quilts.sort((a, b) => alphaSort(seasonalTags(a), seasonalTags(b)) ));
                break;

            default:
                break;
        }
    };

    const seasonalTags = (quilt) => {
        let tc = show.tagCategories.filter(c => c.name === "Seasonal")[0];
        let ids = tc.tags.map(t => t.id);
        
        (quilt.tags || []).filter(t => ids.includes(t.id)).sort().join(",");
    };

    /* ******************************************************************** */
    /*    Quilt Action Handlers                                             */
    /* ******************************************************************** */
    const selectQuilt = (e, quilt) => {
        if(activateQuilt) {
            activateQuilt(quilt);
        }
    };

    const buildUnhungQuiltList = () => {
        return (
            <div className="unhung-quilt-list">
                {quilts
                    .filter(q => (q.hangingLocation === undefined) || (q.hangingLocation === null))
                    .map(q => 
                        <div 
                            className={`quilt`} 
                            key={`quilt${q.id}`} 
                            onDoubleClick={(e) => selectQuilt(e, q)}
                            >
                                <div className="name">{`${q.number} - ${q.name}`}</div>
                                <div className="info">{`${q.width} X ${q.length} | ${q.category.name}`}</div>
                                <div className="info">{`${q.mainColor || "no color provided"}`}</div>
                        </div>
                    )
                }
            </div>
        );
    };

    const buildHungQuiltList = () => {
        return (
            <div className="hung-quilt-list">
                {quilts
                    .filter(q => (q.hangingLocation !== undefined) && (q.hangingLocation !== null))
                    .map(q => 
                        <div 
                            className={`quilt`} 
                            key={`quilt${q.id}`} 
                            >
                                <div className="name">{`${q.number} - ${q.name}`}</div>
                                <div className="info">{`${q.width} X ${q.length} | ${q.category.name}`}</div>
                                <div className="info">{`${q.mainColor || "no color provided"}`}</div>
                                <div className="buttons">
                                    <button onClick={() => goToQuiltLocation(q)}>Locate</button>
                                    <button onClick={() => unHang(q)}>Unhang</button>
                                </div>
                        </div>
                    )
                }
            </div>
        );
    };


    return (
        <Tabs defaultActiveKey="unhung" id="quilt-selector-tab-group">
            <Tab eventKey={"unhung"} title="Unhung Quilts">
                <div className="list-actions">
                    <div className="width-selector">
                        <label htmlFor="startingWidth">Width</label>
                        <input name="startingWidth" id="startingWith" className="width" value={startingWidth || ""} onChange={updateStartingWidth}/>
                    </div>
                    <div className="sort-order">
                        <label htmlFor="quiltSelectorSortOrder">Sort By</label>
                        <select id="quiltSelectorSortOrder" onChange={sortQuilts}>
                            <option key={SORT_WIDTH.replace(" ", "_")} value={SORT_WIDTH}>{SORT_WIDTH}</option>
                            <option key={SORT_CATEGORY.replace(" ", "_")} value={SORT_CATEGORY}>{SORT_CATEGORY}</option>
                            <option key={SORT_NUMBER.replace(" ", "_")} value={SORT_NUMBER}>{SORT_NUMBER}</option>
                            <option key={SORT_TAGS.replace(" ", "_")} value={SORT_TAGS}>{SORT_TAGS}</option>
                        </select>
                    </div>
                </div>
                {buildUnhungQuiltList()}
            </Tab>
            <Tab eventKey={"hung"} title="Hung Quilts">
                {buildHungQuiltList()}
            </Tab>
        </Tabs>
    );
};

export default QuiltSelector;