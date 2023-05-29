
import { Renderers, } from "../../components/quilts/QuiltFields";
import TableFormatter from "./TableFormatter";
import "./styles/GroupFormatter.css";


const GroupingFormatter = (props) => {
    const { report, results, preview, show } = props;


    const getDistinctGroups = () => {
        let groups = {};
        (results || []).forEach(r => {
            console.log(`${r.id} - ${r[report.groupField]}`);
            groups[render(report.groupField, r[report.groupField])] = 1;
        });

        return Object.keys(groups).sort();
    };


    const getGroupRows = (group, data) => {
        return data.filter(d => render(report.groupField, d[report.groupField]) === group);
    };


    const render = (field, data) => {
        let renderers = Renderers[field];
        let renderer = Renderers.default;
        if (renderers) {
            renderer = renderers.report || renderers.default;
        }

        console.log(`Rendering ${field}`);
        console.log(data);
        let renderedValue = renderer(data);
        return renderedValue;
    }

    if (!report || !report.fields) {
        return (<p>Report details missing</p>)
    }

    if(!report.groupField) {
        return (<TableFormatter {...props} />);
    }
    else if(preview) {
        let previewData ={};
        return (
            <TableFormatter {...props} />
        );
    }
    else {
        return (
            <div className="report">
                {
                    getDistinctGroups().map(group => {
                        let groupResults = getGroupRows(group, results);
                        return (<>
                            <div className="group">
                                <div className="group-title">{`${group} | ${groupResults.length} item(s)`}</div>
                                <TableFormatter report={report} results={groupResults} preview={false} show={show} />
                            </div>
                            <div className="pagebreak"> </div>
                        </>);
                    })
                }
            </div>
        );
    }
};

export default GroupingFormatter;