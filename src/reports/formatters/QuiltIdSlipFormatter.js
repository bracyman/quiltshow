import { useState } from "react";
import { QuiltFields, ReportSorters, ReportRenderers } from "../../components/quilts/QuiltFields";
import "./styles/QuiltIdSlipFormatter.css";


const QuiltIdSlipFormatter = (props) => {
    const { report, results, preview, show } = props;

    const buildRow = (qsd) => {
        return (<div className="quilt-slip" key={`id_slip${qsd?.quilt?.id || "0"}`}>
            <div className="name">{`${qsd?.quilt?.enteredBy.lastName}, ${qsd?.quilt?.enteredBy.firstName}`}</div>
            <div className="location">{ReportRenderers.hangingLocation.default(qsd)}</div>
            <div className="name">{ReportRenderers.name.default(qsd)}</div>
            <div className="category">
                {ReportRenderers.category.default(qsd)}
            </div>
            <div className="size">
                W: {ReportRenderers.width.default(qsd)}<br/>
                L: {ReportRenderers.length.default(qsd)}
            </div>
            <div className="number">#{ReportRenderers.number.default(qsd)}</div>
            <div className="judged">{qsd?.quilt?.judged ? "Judged": ""}</div>
        </div>);
    };

    const buildPreview = () => {

    };

    const sortResults = (results) => {
        if(!results) {
            return [];
        }

        return results.sort(ReportSorters["enteredBy"]);
    };


    if (!report || !report.fields) {
        return (<p>Report details missing</p>)
    }

    return (
        <div className="report quilt-id-slips">
            {preview
                ? buildPreview()
                : sortResults(results).map((d, i) =>
                    buildRow(d, i)
                )
            }
        </div>
    );
};

export default QuiltIdSlipFormatter;