

import ReportFormatter from "./formatters/ReportFormatter";

const ReportPreview = (props) => {

    const { id, report } = props;


    if(!report) {
        return (<></>);
    }

    return (
        <div id={id} className="report-preview-container">
            <div className="name">{report.name}</div>
            <div className="description">{report.description}</div>
            <div className="preview">
                <div>
                    <div className="title">Preview</div>
                    <button className="run-report">Run Report</button>
                </div>
                <ReportFormatter report={report} preview={true}/>
            </div>
        </div>    
    );
};

export default ReportPreview;