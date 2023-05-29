import TableFormatter from "./TableFormatter";
import CardFormatter from "./CardFormatter";
import CheckInOutFormatter from "./CheckInOutFormatter";
import GroupingFormatter from "./GroupingFormatter";
import PaymentStatusFormatter from "./PaymentStatusFormatter";
import StatisticsFormatter from "./StatisticsFormatter";
import DateUtils from "../../utilities/DateUtils";
import "./styles/Report.css";


export const Formatters = ["Table", "Card", "Group"];

const ReportFormatter = (props) => {
    const { report, results, preview, show } = props;


    const selectFormatter = () => {
        return (<CheckInOutFormatter report={report} results={results} preview={preview || false} show={show} />);
/*        switch (report.format?.toLowerCase()) {
            case "card":
                return (<CardFormatter report={report} results={results} preview={preview || false} show={show} />);
    
            case "payment_status":
                return (<PaymentStatusFormatter report={report} results={results} preview={preview || false} show={show} />);

            case "statistics":
                return (<StatisticsFormatter report={report} results={results} preview={preview || false} show={show} />);
        
            case "checkin":
                return (<CheckInOutFormatter report={report} results={results} preview={preview || false} show={show} />);
                    
            case "group":
                return (<GroupingFormatter report={report} results={results} preview={preview || false} show={show} />);
            
            case "table":
            default:
                return (<TableFormatter report={report} results={results} preview={preview || false} show={show} />);
        }
//*/
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