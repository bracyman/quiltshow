import { QuiltFields } from "../../utilities/ObjectUtils";
import StringUtils from "../../utilities/StringUtils";


const TableFormatter = (props) => {
    const {report, results, preview} = props;


    const buildHeader = () => {
        return (<tr key={"report_header"}>
            {
                report.fields.map(field => 
                    <td>{QuiltFields[field].label || field }</td>
                )
            }
            </tr>);
    };

    const buildPreview = () => {
        return (
            <tr key={"report_preview"}>
                {report.fields.map(field => 
                    <td>{QuiltFields[field].example}</td>
                )}
            </tr>
        );
    };

    const buildRow = (data, index) => {
        return (
            <tr key={`report_row_${index}`}>
                {report.fields.map(field => 
                    <td className={field} key={`report_${field}_${index}`}>{StringUtils.toString(data[field], QuiltFields[field]?.type)}</td>
                )}
            </tr>
        );
    };

    if(!report || !report.fields) {
        return (<p>Report details missing</p>)
    }

    return (
        <table className="report">
            <thead>{buildHeader()}</thead>
            <tbody>
                { preview 
                    ? buildPreview() 
                    : results?.map((d, i) => 
                        buildRow(d, i)
                    )
                }
            </tbody>
        </table>
    );
};

export default TableFormatter;