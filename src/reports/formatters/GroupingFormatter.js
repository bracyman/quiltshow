
import { ReportRenderers, } from "../../components/quilts/QuiltFields";
import StringUtils from "../../utilities/StringUtils";
import { ReportSorters } from "../../components/quilts/QuiltFields";
import TableFormatter from "./TableFormatter";
import "./styles/GroupFormatter.css";


const GroupingFormatter = (props) => {
    const { report, results, preview, show } = props;


    const groupResults = () => {
        let groups = {};

        if(report.groupField === "awards") {
            (results || []).forEach(qsd => {
                (qsd.quilt.awards || []).forEach(award => {
                    let group = StringUtils.upperFirstOnly(award.category?.name || "Specialty");
                    if(groups[group])
                        groups[group].push(qsd);
                    else {
                        groups[group] = [qsd];
                }
                });
            });

            Object.keys(groups).forEach(group => {
                groups[group].sort((a, b) => ReportSorters.awards(a, b, group));
            });
        } 
        else {
            (results || []).forEach(qsd => {
                let group = groupName(report.groupField, qsd);
                if(groups[group])
                    groups[group].push(qsd);
                else {
                    groups[group] = [qsd];
                }
            });
        }
        return groups;
    };


    const sortByLastName = (a,b) => {
        let aSplit =  a.trim().split(" ");
        let bSplit =  b.trim().split(" ");
        let aLast = aSplit[aSplit.length - 1];
        let bLast = bSplit[bSplit.length - 1];

        return aLast > bLast ? 1 : aLast < bLast ? -1 : 0;
    };

    const groupName = (field, data) => {
        let renderers = ReportRenderers[field];
        let renderer = renderers.default;
        if (renderers) {
            renderer = renderers.report || renderers.default;
        }

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
        let groupedResults = groupResults(results);
        let distinctGroups = (report.groupField === "enteredBy")
            ?  Object.keys(groupedResults).sort(sortByLastName)
            : Object.keys(groupedResults).sort();

        let subReport = { ...report };
        if(report.groupField === "awards") {
            if(!report.fields.includes("awards")) {
                subReport.fields = ["awards", ...report.fields];
            }

            if(!report.sortOrder.includes("awards")) {
                subReport.sortOrder = ["awards", ...report.sortOrder];
            }
        }

        return (
            <div className="report group-formatter">
                {
                    distinctGroups.map(group => {
                        let groupResults = groupedResults[group];
                        return (<>
                            <div className="group">
                                <div className="group-title">{`${group} | ${groupResults.length} item(s)`}</div>
                                <TableFormatter report={subReport} results={groupResults} preview={false} show={show} />
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