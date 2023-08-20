
import { useState } from "react";
import LoadingButton from "../LoadingButton";
import AwardService from "../../services/AwardService";
import "../../styles/AwardAssignment.css";


const SINGLE_PATTERN = /^\d{0,4}$/;
const MULTI_PATTERN = /^((\d\d\d\d,)*)(\d{0,4}),?$/;

const AwardAssignment = (props) => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [ awardAssignments, setAwardAssignments ] = useState([]);
    const [ changed, setChanged ] = useState([]);

    const { show } = props;
    

    const awardSorter = (a, b) => {
        if((a.category?.name || "special") === (b.category?.name || "special")) {
            return a.displayOrder > b.displayOrder 
                    ? 1 
                    : a.displayOrder === b.displayOrder 
                        ? 0 
                        : -1;
        }

        return (a.name.toLowerCase() > b.name.toLowerCase())
                ? 1
                : (a.name.toLowerCase() < b.name.toLowerCase())
                    ? -1
                    : 0;
    };

    const categorySorter = (a, b) => {
        return (a.name.toLowerCase() > b.name.toLowerCase())
                ? 1
                : (a.name.toLowerCase() < b.name.toLowerCase())
                    ? -1
                    : 0;
    };

    const updateSelectedCategory = (e) => {
        setSelectedCategory(e.target.value)
    };

    const loadAwardCategory = async () => {
        if(selectedCategory === "") {
            return;
        }

        setAwardAssignments([]);
        let newAwardAssignments = await AwardService.fetchCategoryAwards(show.id, selectedCategory);
        (newAwardAssignments || []).forEach(a => a.awardedTo = (a.awardedTo || []).map(a => a.number).join(","));

        setAwardAssignments(newAwardAssignments.sort(awardSorter));
    };

    const saveAssignments = async () => {
        let newAwardAssignments = [];
        for(let i=0; i < (awardAssignments || []).length; i++) {
            let a = awardAssignments[i];
            if(a.changed) {
                let newAwardedTo = ((a.awardedTo || "").length > 0) ? a.awardedTo.split(",") : [];
                let success = await AwardService.assignAwardToQuiltNumbers(show.id, a.id, newAwardedTo);
                newAwardAssignments.push({ ...a, changed: false});
            } else {
                newAwardAssignments.push(a);
            }   
        }
    };

    const updateAssignment = (e, awardAssignment, i) => {

        if(awardAssignment.multipleRecipients) {
            if(!e.target.value.match(MULTI_PATTERN)) {
                return;
            }
        }
        else {
            if(!e.target.value.match(SINGLE_PATTERN)) {
                return;
            }
        }

        let newAwardAssignment = { ...awardAssignment, awardedTo: e.target.value, changed: true };
        let newAwardAssignments = [...awardAssignments];
        newAwardAssignments[i] = newAwardAssignment;
        setAwardAssignments(newAwardAssignments);        
    };

    const buildAwardAssignment = (awardAssignment, i) => {
        return (
            <div className="award-assignment" key={awardAssignment.id}>
                <div className="award-name">{`${awardAssignment.name}${awardAssignment.color ? " / " + awardAssignment.color : ""}`}</div>
                <div className="assigned-quilt">
                    <input type="text" id={`assignment_${awardAssignment.id}`} onChange={(e) => updateAssignment(e, awardAssignment, i)} value={awardAssignment.awardedTo} />
                </div>
            </div>
        );
    };

    return (<div className="award-assignment-container">
            <div className="award-category-selection">
                <select className="award-category-selection" id="award-category-selector" value={selectedCategory} onChange={updateSelectedCategory}>
                    <option value="" key="blank">Select Award Category</option>
                    <option value="special" key="special">Specialty Awards</option>
                    {(show.categories.sort(categorySorter).map(c => (
                        <option value={c.id} key={c.id}>{c.name}</option>
                    )))}
                </select>
                <LoadingButton id="select-award" method={loadAwardCategory} disabled={selectedCategory === ""}>Load</LoadingButton>
            </div>
            {((awardAssignments || []).length > 0) ?
                <div className="award-assignments">
                    {
                        awardAssignments.map((a, i) => buildAwardAssignment(a, i))
                    }
                    <div className="submit-changes">
                        <LoadingButton id="submit-changes" method={saveAssignments} disabled={!changed}>Save awards</LoadingButton>
                    </div>
                </div>
        
                : <></>
            }
        </div>);
};

export default AwardAssignment;