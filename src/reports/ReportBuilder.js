
import { useState } from "react";
import SearchQuilts from "../search/SearchQuilts";
import ReportService, { IN_PROGRESS_REPORT } from "../services/ReportService";
import ExpiringStorage from "../services/ExpiringStorage";
import { Formatters } from "./formatters/ReportFormatter";
import { QuiltFields } from "../components/quilts/QuiltFields";


const reportCategories = {
    "SHOW": "Show Quilts",
    "AWARDS": "Award Reports",
    "MISCELLANEOUS": "Miscellaneous"
};

const ReportBuilder = (props) => {
    const [report, setReport] = useState({ fields: [], order: [] });
    const [saveResult, setSaveResult] = useState([]);
    const { show } = props;

    const updateSearch = (newSearch) => {
        setReport(newSearch);
    };

    const runReport = () => {
        ExpiringStorage.setItem(IN_PROGRESS_REPORT, report);
        window.open(`/?headless=1&reportId=${IN_PROGRESS_REPORT}#/reports`, `_blank`);
    };

    const saveReport = () => {

        // validate
        let errors = [];
        if(!report.reportName) { errors.push("Report must have a name");}
        if(!report.reportDescription) { errors.push("Report must have a description");}
        if(!report.fields || report.fields.length === 0) { errors.push("You must select at least one field for the report")};

        if(errors.length > 0) {
            setSaveResult(errors);
        }
        else {
            let result = ReportService.saveReport(report);

            if(result) {
                setSaveResult(["Report saved"]);
            }
            else {
                setSaveResult(["Unable to save report"]);
            }
        }
        document.getElementById("saveResult").showModal();
    };

    return (
        <>
            <div className="report-info">
                <div className="name">
                    <div className="form-label"><label htmlFor="reportName">Name</label></div>
                    <div className="form-input"><input type="text"
                        id="reportName"
                        value={report.reportName}
                        onChange={(e) => updateSearch({ ...report, reportName: e.target.value })} />
                    </div>
                </div>
                <div className="description">
                    <div className="form-label"><label htmlFor="reportDescription">Description</label></div>
                    <div className="form-input"><input type="textarea"
                        id="reportDescription"
                        value={report.reportDescription}
                        onChange={(e) => updateSearch({ ...report, reportDescription: e.target.value })} />
                    </div>
                </div>
                <div className="category">
                    <div className="form-label"><label htmlFor="reportCategory">Category</label></div>
                    <div className="form-input">
                        {Object.keys(reportCategories).map(rc => (
                            <label htmlFor={`reportCategory_${rc}`} >
                                <input type="radio"
                                    id={`reportCategory_${rc}`}
                                    name="reportCategory"
                                    value={rc}
                                    checked={rc === report.reportCategory}
                                    onChange={(e) => updateSearch({ ...report, reportCategory: rc })} />
                                {reportCategories[rc]}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="format">
                    <div className="form-label"><label htmlFor="format">Format</label></div>
                    <div className="form-input">
                        {Formatters.map(f => (
                            <label htmlFor={`format_${f.format}`} >
                                <input type="radio"
                                    id={`format_${f.format}`}
                                    name="format"
                                    value={f.format}
                                    checked={(f.format === report.format) || ((f.name === "Table") && !report.format)}
                                    onChange={(e) => updateSearch({ ...report, format: f.format })} />
                                {f.name}
                            </label>
                        ))}
                    </div>
                    <select id="groupField" value={report.groupField} onChange={(e) => updateSearch({...report, groupField: e.target.value})}>
                        {
                            Object.keys(QuiltFields).filter(f => !(["id","tags","designSource","hangingLocation","submittedOn","additionalQuilters"].includes(f))).map(f => 
                                <option value={f}>{QuiltFields[f].label}</option>
                            )
                        }
                    </select>
                </div>
                <div className="operations">
                    <button id="runReport" onClick={runReport}>Run</button>
                    <button id="saveReport" onClick={saveReport}>Save</button>
                </div>
            </div>
            <SearchQuilts show={show} search={report} updateSearch={updateSearch} />
            <dialog id="saveResult">
                <p>{saveResult.map(msg => 
                    <div>{msg}</div>
                )}</p>
                <form method="dialog">
                    <button>OK</button>
                </form>
            </dialog>
        </>
    );

};

export default ReportBuilder;