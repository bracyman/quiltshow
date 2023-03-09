import StringUtils from "../utilities/StringUtils";

const reportTypes = [
    { type: "favorites", title: "Favorites"},
    { type: "quilts", title: "Show Quilts"},
    { type: "awards", title: "Awards"},
    { type: "other",title: "Miscellaneous"},
];

const ReportList = (props) => {

    const {id, reports, runReport, previewReport} = props;



    return (
        <div id={id} className="report-list">
            {reportTypes.filter(reportType => reports[reportType.type] !== null).map(reportType => 
                <div className="report-category" key={StringUtils.idIfy(reportType.type)}>
                    <table>
                        <thead><tr><th>{reportType.title}</th></tr></thead>
                        <tbody>
                        {
                            reports[reportType.type].map(report => 
                                <tr key={`report_${report.id}`}>
                                    <td>
                                        <button onClick={() => runReport(report)} className="run-report">Run</button>
                                        <p onClick={() => previewReport(report)} className="preview-report">{report.name}</p>
                                    </td>
                                </tr>
                            )
                        }
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};


export default ReportList;