import { useState } from "react";
import { QuiltFields, Sorters, Renderers } from "../../components/quilts/QuiltFields";
import "./styles/QuiltIdSlipFormatter.css";


const QuiltIdSlipFormatter = (props) => {
    const { report, results, preview, show } = props;
    const piecingCategory = show.tagCategories.filter(tc => tc.name === "Piecing Type")[0];
    const quiltingCategory = show.tagCategories.filter(tc => tc.name === "Quilting Style")[0];


    const buildRow = (quilt) => {
        return (<div className="quilt-slip" key={`id_slip${quilt.id}`}>
            <div className="name">{`${quilt.enteredBy.lastName}, ${quilt.enteredBy.firstName}`}</div>
            <div className="location"></div>
            <div className="name">{quilt.name}</div>
            <div className="tags">
                {Renderers.tags.forCategory(piecingCategory, quilt)}<br/>
                {Renderers.tags.forCategory(quiltingCategory, quilt)}
            </div>
            <div className="size">
                W: {Renderers.width.default(quilt.width)}<br/>
                L: {Renderers.length.default(quilt.length)}
            </div>
            <div className="number">#{quilt.number}</div>
            <div className="judged">{quilt.judged ? "Judged": ""}</div>
        </div>);
    };

    const buildPreview = () => {

    };

    const sortResults = (results) => {
        if(!results) {
            return [];
        }

        return results.sort(Sorters["enteredBy"]);
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