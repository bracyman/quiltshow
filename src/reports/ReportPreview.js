

import ReportFormatter from "./formatters/ReportFormatter";

const ReportPreview = (props) => {

    const { id, report, runReport, show } = props;


    if (!report) {
        return (<></>);
    }

    return (
        <div id={id} className="report-preview-container">
            <div className="name">{report.reportName}</div>
            <div className="description">{report.description}</div>
            <div className="preview">
                <div>
                    <div className="title">Preview</div>
                    <button className="run-report" onClick={() => runReport(report.id)}>Run Report</button>
                </div>
                <ReportFormatter report={report} preview={true} show={show} />
            </div>
        </div>
    );
};

export default ReportPreview;