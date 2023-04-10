import TableFormatter from "./TableFormatter";
import CardFormatter from "./CardFormatter";
import CheckinFormatter from "./CheckInFormatter";
import GroupingFormatter from "./GroupingFormatter";
import DateUtils from "../../utilities/DateUtils";
import "./styles/Report.css";


export const Formatters = ["Table", "Card", "Group"];

const ReportFormatter = (props) => {
    const { report, results, preview, show } = props;


    const selectFormatter = () => {
        switch (report.format?.toLowerCase()) {
            case "card":
                return (<CardFormatter report={report} results={results} preview={preview || false} show={show} />);
    
            case "checkin":
                return (<CheckinFormatter props />);
        
            case "group":
                return (<GroupingFormatter report={report} results={results} preview={preview || false} show={show} />);
            
            case "table":
            default:
                return (<TableFormatter report={report} results={results} preview={preview || false} show={show} />);
        }
    };

    if (!report) {
        return (<>No report specified</>);
    }


    return (
        <>
            {preview 
                ? (<></>)
                : (<div className="report-header">
                    <img alt="EIHQ logo" src="/img/logo.jpg" className="logo"/>
                    <div className="title">{`${report.reportName} – ${show.name} ${DateUtils.getYear(show.startDate)}`}</div>
                </div>)
            }
            { selectFormatter() }
        </>
    );
};

export default ReportFormatter;