
import { ReportRenderers } from "../../components/quilts/QuiltFields";
import StringUtils from "../../utilities/StringUtils";
import "./styles/DescriptionCardFormatter.css";


const DescriptionCardFormatter = (props) => {
    const { report, results, preview, show } = props;
    const piecingTagCategory = show?.tagCategories?.filter(tc => tc.name === "Piecing Type")[0];

    
    const buildCard = (qsd, index) => {
        let othersParticipating = ReportRenderers.additionalQuilters.default(qsd);
        let textClassName = qsd.quilt.description.length > 1000 ? "extra-long"
                            : qsd.quilt.description.length > 650 ? "long"
                            : "";
        return (
            <div className="description-card" key={`card_${index}`}>
                <div className="hole-punch">*&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*</div>
                <div className="quilt-card">
                    <table className="header">
                        <tbody>
                            <tr>
                                <td className="title" colSpan={4}>{ReportRenderers.enteredBy.default(qsd)}</td>
                                <td className="number">{ReportRenderers.number.default(qsd)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="quilt-info">
                        <tbody>
                            <tr>
                                <td className="label">Name:</td>
                                <td className="value quilt-name" colSpan={3}>{ReportRenderers.name.default(qsd)}</td>
                            </tr>
                            <tr>
                                <td className="label">Quilted By: </td>
                                <td className="value">{ReportRenderers.quiltedBy.default(qsd)}</td>
                                <td className="label">{StringUtils.hasText(othersParticipating) ? `Others participating:` : ``}</td>
                                <td className="value">{othersParticipating}</td>
                            </tr>
                            <tr>
                                <td className="label">Design</td>
                                <td className="value" colSpan={3}>{ReportRenderers.designSource.long(qsd)}</td>
                            </tr>
                            <tr>
                                <td className="label">Comments</td>
                                <td className={`value ${textClassName}`} colSpan={3}>{ReportRenderers.description.long(qsd)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="details">
                        <tbody>
                            <tr>
                                <td className="details">{ReportRenderers.category.default(qsd)}</td>
                                <td className="details">{ReportRenderers.groupSize.default(qsd)}</td>
                                <td className="details">{ReportRenderers.tags.forCategory(piecingTagCategory, qsd)}</td>
                                <td className="details">{ReportRenderers.hangingLocation.default(qsd)}</td>
                                <td className="details judged">{ReportRenderers.judged.long(qsd)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };


    if (!report || !report.fields) {
        return (<p>Report details missing</p>)
    }

    return (<>
        { 
            results?.map((d, i) =>
                buildCard(d, i)
            )
        }
    </>);
};

export default DescriptionCardFormatter;