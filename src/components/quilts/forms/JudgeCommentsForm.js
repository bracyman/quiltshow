import { useState } from "react";
import QuiltService from "../../../services/QuiltService";
import StringUtils from "../../../utilities/StringUtils";
import LoadingButton from "../../LoadingButton";
import { Renderers } from "../QuiltFields";
import "../../../styles/JudgeCommentsForm.css";

const JudgeCommentsForm = (props) => {
    const [quilt, setQuilt] = useState(null);

    const loadQuilt = async () => {
        let quiltId = document.getElementById("selectedQuiltNumber").value;
        if(StringUtils.hasText(quiltId)) {
            setQuilt(null);
            let loadedQuilt = await QuiltService.fetchQuiltByNumber(quiltId);
            setQuilt(loadedQuilt);
        }
        else {
            document.getElementById("selectedQuiltNumber").focus();
        }
    };

    const saveComment = async () => {
        if(quilt) {
            let savedJudgeComment = await QuiltService.saveJudgeComment(quilt.id, quilt.judgeComment);
            setQuilt({...quilt, judgeComment: savedJudgeComment});
            document.getElementById("selectedQuiltNumber").focus();
            alert("Comments saved");
        }
    }

    const changeScore = (field, score) => {
        let updatedScore = quilt.judgeComment ? { ...quilt.judgeComment } : { judgeRemarks: {} };
        updatedScore.judgeRemarks[field] = score;

        setQuilt({...quilt, judgeComment: updatedScore});
    };

    const updateComments = (e) => {
        let updatedComment = { ...quilt.judgeComment };
        updatedComment.judgeRemarks["comments"] = e.target.value;

        setQuilt({...quilt, judgeComment: updatedComment});
    };

    const buildScoreTable = (selectedQuilt, groupName, categories, quilt) => {
        let remarks = selectedQuilt?.judgeComment?.judgeRemarks || {};
        return (
            <table className="scoring-group">
                <tr className="scoring-header">
                    <td className="scoring-name">{groupName}</td>
                    <td className="score-column">1</td>
                    <td className="score-column">2</td>
                    <td className="score-column">3</td>
                    <td className="score-column">4</td>
                    <td className="score-column">N/A</td>
                </tr>

                {categories.map(c => 
                    <tr className="scoring-row">
                        <td className="scoring-name">{c}</td>
                        <td className="score-column">
                            <input type="radio" id={`${StringUtils.idIfy(c)}_1`} name={StringUtils.idIfy(c)} checked={String(remarks[c] || "") === "1"} onChange={() => changeScore(c, 1)}/>
                        </td>
                        <td className="score-column">  
                            <input type="radio" id={`${StringUtils.idIfy(c)}_2`} name={StringUtils.idIfy(c)} checked={String(remarks[c] || "") === "2"} onChange={() => changeScore(c, 2)} />
                        </td>
                        <td className="score-column">
                            <input type="radio" id={`${StringUtils.idIfy(c)}_3`} name={StringUtils.idIfy(c)} checked={String(remarks[c] || "") === "3"} onChange={() => changeScore(c, 3)} />
                        </td>
                        <td className="score-column">
                            <input type="radio" id={`${StringUtils.idIfy(c)}_4`} name={StringUtils.idIfy(c)} checked={String(remarks[c] || "") === "4"} onChange={() => changeScore(c, 4)} />
                        </td>
                        <td className="score-column">
                            <input type="radio" id={`${StringUtils.idIfy(c)}_5`} name={StringUtils.idIfy(c)} checked={String(remarks[c] || "") === "5"} onChange={() => changeScore(c, 5)} />
                        </td>
                    </tr>
                )}
            </table>
        );
};

    const buildForm = (selectedQuilt) => {
        return (
            <div className="judge-comments">
                <div className="header">
                    <div className="scoring-info">
                        Scoring: 
                        <ul>
                            <li>1 - Excellent</li>
                            <li>2 - Very Good</li>
                            <li>3 - Satisfactory</li>
                            <li>4 - Needs Improvement</li>
                            <li>NA - Not Applicable</li>
                        </ul>
                    </div>
                </div>

                {buildScoreTable(selectedQuilt, "Visual Impact/General Appearance", 
                    ["Visual Impact, overall effect, pleasing appearance", "Long outside edges straight/corners square/hangs straight", "Quilt is in show-ready condition"])}

                {buildScoreTable(selectedQuilt, "Design", 
                    ["Use of principles & elements of design", "Color and value placement", "Layout, setting, border design"])}

                {buildScoreTable(selectedQuilt, "Workmanship", 
                    ["Precision and alignment of pieced elements", "Seams are straight, curves smooth", "Thread matches or blends/invisible in seam lines", 
                     "Sashings consistent in size, properly aligned", "Borders complement, consistent in size", 
                     "Appliqué is secure, free of shadowing, curves smooth/points sharp", "Embellishments complement & enhance; are secure"])}

                {buildScoreTable(selectedQuilt, "Quilting", 
                    ["Quilting thread matches, blends, or complements", "Quilting density is even across quilt and fills spaces well",
                     "Quilting motifs complement style & design of quilt", "Quilting is free of technician/tension issues"])}

                {buildScoreTable(selectedQuilt, "Edge Finish/Backing", 
                    ["Binding is full of batting to the edge", "Corners are 90° square or curves smooth; miters stitched closed",
                     "Binding is a consistent width", "Binding stitches are tight, secure, invisible", "Backing fabric complements, is appropriate for intended use"])}

                <div className="comments">
                    <div className="title"><b>Comments</b></div>
                    <div className="value">
                        <textarea id="quilt.judgeComment.judgeRemarks.comment" value={selectedQuilt?.judgeComment?.judgeRemarks?.comments || ""} onChange={updateComments} />
                    </div>
                </div>

                <div className="save-comment">
                    <LoadingButton id="save-comment" loadingLabel="Saving..." method={saveComment}>Save Remarks</LoadingButton>
                </div>
            </div>

        );
    }

    return (
        <>
            <div className="quilt-select">
                <input type="text" id="selectedQuiltNumber" />
                <LoadingButton id="load-quilt" loadingLabel="Loading..." method={loadQuilt}>Load Quilt</LoadingButton>
                <div className="current-quilt">
                    <div>{quilt ? quilt.name : "Enter quilt number to load"}</div>
                    <div className="value">{quilt ? Renderers.category.default(quilt?.category) : ""}</div>
                </div>
            </div>
            {quilt && buildForm(quilt)}
        </>
    );
};

export default JudgeCommentsForm;
