
import { useState } from "react";
import { Sorters, alphaSort } from "../quilts/QuiltFields";
import {Tab, Tabs} from "react-bootstrap";
import QuiltService from "../../services/QuiltService";
import { useQueryClient, useQuery, useMutation } from "react-query";


const SORT_WIDTH    = "Width";
const SORT_CATEGORY = "Category";
const SORT_NUMBER   = "Entry Number";
const SORT_TAGS     = "Seasonal";

const QuiltSelector = (props) => {
    const [startingWidth, setStartingWidth] = useState(null);
    const [sortType, setSortType] = useState(SORT_WIDTH);
    const { data, isLoading, isError, isSuccess } = useQuery(
        "quiltList",
        QuiltService.fetchQuilts
    );
    const [update, setUpdate] = useState(props.updateFlag);
    
    const show = props.show;
    const getLocation = props.getLocation;
    const goToQuiltLocation = props.selectQuilt;
    const activateQuilt = props.activateQuilt;
    const unHang = props.removeQuilt;


    /* ******************************************************************** */
    /*    Configuration                                                     */
    /* ******************************************************************** */

    /* ******************************************************************** */
    /*    List Action    Handlers                                           */
    /* ******************************************************************** */
    const filterAndSort = () => {
        console.log(`FilterSorting ${data?.length} quilts`)
        let quilts = [];
        if(data) {
            quilts = data;
            if(startingWidth) {
                quilts = quilts.filter(q => q.width <= startingWidth);
            }

            switch(sortType) {
                case SORT_WIDTH:
                    quilts.sort((a, b) => Sorters.width(a,b) * -1);
                    break;

                case SORT_CATEGORY:
                    quilts.sort((a, b) => Sorters.category(a,b));
                    break;

                case SORT_NUMBER:
                    quilts.sort((a, b) => Sorters.number(a,b));
                    break;

                case SORT_TAGS:
                    quilts.sort((a, b) => alphaSort(seasonalTags(a), seasonalTags(b)) );
                    break;

                default:
                    break;
            }
        }
            
        return quilts;
    };

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
    };

    const seasonalTags = (quilt) => {
        let tc = show.tagCategories.filter(c => c.name === "Seasonal")[0];
        let ids = tc.tags.map(t => t.id);
        
        (quilt.tags || []).filter(t => ids.includes(t.id)).sort().join(",");
    };

    const categoryName = (category) => {
        if(category instanceof Object) {
            return category.name;
        }

        let matches = show.categories.filter(c => c.id === category);
        if(matches.length > 0) {
            return matches[0].name;
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

    const buildUnhungQuiltList = () => {
        let unhungQuilts = filterAndSort().filter(q => getLocation(q) === null);
        return (
            <div className="unhung-quilt-list">
                {unhungQuilts.map(q => 
                        <div 
                            className={`quilt`} 
                            key={`quilt${q.id}`} 
                            onDoubleClick={(e) => selectQuilt(e, q)}
                            >
                                <div className="name">{`${q.number} - ${q.name}`}</div>
                                <div className="info">{`${q.width} X ${q.length} | ${categoryName(q.category)}`}</div>
                                <div className="info">{`${q.mainColor || "no color provided"}`}</div>
                        </div>
                    )
                }
            </div>
        );
    };

    const buildHungQuiltList = () => {
        let hungQuilts = filterAndSort().filter(q => getLocation(q) !== null);
        return (
            <div className="hung-quilt-list">
                {hungQuilts.map(q => 
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


    if(isLoading) {
        return (<p>Loading quilts...</p>);
    }
    
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