
import { useState } from "react";
import SearchQuilts from "../search/SearchQuilts";
import ReportService, {IN_PROGRESS_REPORT} from "../services/ReportService";
import ExpiringStorage from "../services/ExpiringStorage";


const reportCategories = {
    "SHOW": "Show Quilts",
    "AWARDS": "Award Reports",
    "MISCELLANEOUS": "Miscellaneous"
};

const ReportBuilder = (props) => {
    const [report, setReport] = useState({ fields: [], order: [] });
    const { show } = props;

    const updateSearch = (newSearch) => {
        setReport(newSearch);
    };

    const runReport = () => {
        ExpiringStorage.setItem(IN_PROGRESS_REPORT, report);
        window.open(`/reports?headless=1&reportId=${IN_PROGRESS_REPORT}`, `_blank`);
    };

    const saveReport = () => {
        ReportService.saveReport(report);
    };

    return (
        <>
            <div className="report-info">
                <div className="name">
                    <div className="form-label"><label htmlFor="reportName">Name</label></div>
                    <div className="form-input"><input type="text" 
                        id="reportName" 
                        value={report.reportName} 
                        onChange={(e) => updateSearch({...report, reportName: e.target.value})} />
                    </div>
                </div>
                <div className="description">
                    <div className="form-label"><label htmlFor="reportDescription">Description</label></div>
                    <div className="form-input"><input type="textarea" 
                        id="reportDescription" 
                        value={report.reportDescription} 
                        onChange={(e) => updateSearch({...report, reportDescription: e.target.value})} />
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
                                    onChange={(e) => updateSearch({...report, reportCategory: rc})}/>
                                {reportCategories[rc]}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="operations">
                    <button id="runReport" onClick={runReport}>Run</button>
                    <button id="saveReport" onClick={saveReport}>Save</button>
                </div>
            </div>
            <SearchQuilts show={show} search={report} updateSearch={updateSearch} />
        </>
    );

};

export default ReportBuilder;