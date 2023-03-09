import TableFormatter from "./TableFormatter";
import CardFormatter from "./CardFormatter";
import CheckinFormatter from "./CheckInFormatter";


const ReportFormatter = (props) => {
    const { report, results, preview } = props;


    if(!report) {
        return (<></>);
    }

 
    switch(report.format?.toLowerCase()) {
        case "card":
            return <CardFormatter props />;

        case "checkin": 
            return <CheckinFormatter props />;

        case "table":
        default:
            return <TableFormatter report={report} results={results} preview={preview || false} />;
    }
};

export default ReportFormatter;