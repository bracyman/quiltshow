
import "./styles/PaymentStatusFormatter.css";
import StringUtils from "../../utilities/StringUtils";


const fields = ["Payment Links", "Total", "Paid", "Entrant", "Payment Date(s)", "Entry Count" ];
const example = {
    "Payment Links": [""], 
    "Total": 14.0, 
    "Paid": 0.0,
    "Entrant": "Mary Berry", 
    "Payment Date(s)": ["2023-03-21T23:58:27+01:00"],
    "Entry Count": 4
};

const PaymentStatusFormatter = (props) => {
    const { report, results, preview, show } = props;



    const buildHeader = () => {
        return (<tr key={"report_header"}>
            {
                fields.map(field => (<td>{field}</td>))
            }
        </tr>);
    };

    const buildPreview = () => {
        
        return buildRow(example, 0);
    };

    const isEmpty = (data) => {
        if(!data) {
            return true;
        }

        return data["Entrant"] === "null null";
    };

    const buildRow = (data, index) => {
        if(isEmpty(data)) {
            return (<></>);
        }

        let totalMet = (data["Total"] > 0) && (data["Paid"] >= data["Total"]);
        let paymentMade = data["Payment Links"]?.length > 0;

        return (
            <tr key={`report_row_${index}`} className={totalMet ? "paid" : "unpaid" }>
                <td className="link">{ paymentMade ? data["Payment Links"].map(url => (<a href={url}>Payment</a>)) : "" }</td>
                <td className="link">{ data["Total"] ? StringUtils.toString(data["Total"], "currency") : "$0.00" }</td>
                <td className="link">{ data["Paid"] ? StringUtils.toString(data["Paid"], "currency") : "$0.00" }</td>
                <td className="link">{ data["Entrant"] ? data["Entrant"] : "---" }</td>
                <td className="link">{ paymentMade ? StringUtils.dateToString(data["Payment Date(s)"]) : "" }</td>
                <td className="link">{ data["Entry Count"] ? data["Entry Count"] : "0" }</td>
            </tr>
        );
    };

    if (!report || !report.fields) {
        return (<p>Report details missing</p>)
    }

    return (
        <table className="report payment-status">
            <thead>{buildHeader()}</thead>
            <tbody>
                {preview
                    ? buildPreview()
                    : results?.map((d, i) =>
                        buildRow(d, i)
                    )
                }
            </tbody>
        </table>
    );
};

export default PaymentStatusFormatter;