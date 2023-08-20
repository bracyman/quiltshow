import "./styles/JudgeRemarksFormatter.css";
import { ReportRenderers } from "../../components/quilts/QuiltFields";

const JudgeRemarksFormatter = (props) => {
    const { report, results, preview, show } = props;

    const buildScoreTable = (qsd, groupName, categories) => {
        return (
            <div className="scoring-group">
                <div className="scoring-header">
                    <div className="scoring-name">{groupName}</div>
                    <div className="score-column">1</div>
                    <div className="score-column">2</div>
                    <div className="score-column">3</div>
                    <div className="score-column">4</div>
                    <div className="score-column">N/A</div>
                </div>

                {categories.map(c => 
                    <div className="scoring-row">
                        <div className="scoring-name">{c}</div>
                        <div className="score-column">{qsd?.quilt?.judgeComment?.judgeRemarks[c] === "1" ? "X" : ""}</div>
                        <div className="score-column">{qsd?.quilt?.judgeComment?.judgeRemarks[c] === "2" ? "X" : ""}</div>
                        <div className="score-column">{qsd?.quilt?.judgeComment?.judgeRemarks[c] === "3" ? "X" : ""}</div>
                        <div className="score-column">{qsd?.quilt?.judgeComment?.judgeRemarks[c] === "4" ? "X" : ""}</div>
                        <div className="score-column">{qsd?.quilt?.judgeComment?.judgeRemarks[c] === "5" ? "X" : ""}</div>
                    </div>
                )}
            </div>
        );
};

    const buildForm = (qsd) => {
        return (
            <div className="report judge-remarks">
                <div className="header">
                    <div className="category">
                        <div className="label">Category</div><div className="value">{ReportRenderers.category.report(qsd)}</div>
                    </div>
                    <div className="quilt-info">
                        <div className="label">Quilt Name</div>
                        <div className="value quilt-name">{ReportRenderers.name.default(qsd)}</div>
                        <div className="label">Entry #</div>
                        <div className="value entry-number">{ReportRenderers.number.default(qsd)}</div>
                    </div>
                    <div className="scoring-info">
                        <ul>
                            <li>Scoring:</li>
                            <li>1 - Excellent</li>
                            <li>2 - Very Good</li>
                            <li>3 - Satisfactory</li>
                            <li>4 - Needs Improvement</li>
                            <li>5 - Not Applicable</li>
                        </ul>
                    </div>
                </div>

                {buildScoreTable(qsd, "Visual Impact/General Appearance", 
                    ["Visual Impact, overall effect, pleasing appearance", "Long outside edges straight/corners square/hangs straight", "Quilt is in show-ready condition"])}

                {buildScoreTable(qsd, "Design", 
                    ["Use of principles & elements of design", "Color and value placement", "Layout, setting, border design"])}

                {buildScoreTable(qsd, "Workmanship", 
                    ["Precision and alignment of pieced elements", "Seams are straight, curves smooth", "Thread matches or blends/invisible in seam lines", 
                     "Sashings consistent in size, properly aligned", "Borders complement, consistent in size", 
                     "Appliqué is secure, free of shadowing, curves smooth/points sharp", "Embellishments complement & enhance; are secure"])}

                {buildScoreTable(qsd, "Quilting", 
                    ["Quilting thread matches, blends, or complements", "Quilting density is even across quilt and fills spaces well",
                     "Quilting motifs complement style & design of quilt", "Quilting is free of technician/tension issues"])}

                {buildScoreTable(qsd, "Edge Finish/Backing", 
                    ["Binding is full of batting to the edge", "Corners are 90° square or curves smooth; miters stitched closed",
                     "Binding is a consistent width", "Binding stitches are tight, secure, invisible", "Backing fabric complements, is appropriate for intended use`"])}

                <div className="comments">
                    <span className="title">Comments</span>{qsd?.quilt?.judgeComment?.judgeRemarks?.comments || ""}
                </div>

                <div className="signature">
                    <div className="award">Award _________________</div>
                    <div className="signature-line">Kathi Eubank, NACQJ Certified Judge</div>
                </div>
            </div>

        );
    }

    return (
        <>
           { (results || []).map(qsd => buildForm(qsd)) }
        </>
    )
};

export default JudgeRemarksFormatter;
