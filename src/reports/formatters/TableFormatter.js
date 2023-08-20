import { useState } from "react";
import { QuiltFields, ReportSorters, ReportRenderers } from "../../components/quilts/QuiltFields";
import "./styles/TableFormatter.css";


const TableFormatter = (props) => {
    const { report, results, preview, show } = props;
    const [sortColumn, setSortColumn] = useState(null);

    const buildHeader = () => {
        return (<tr key={"report_header"}>
            {
                report.fields.map(field => {
                    if(field === "tags") {
                        return (<>
                            {report["tags"].categories.map(tcId => {
                                let tagCategory = getTagCategory(tcId);
                                let className = ((sortColumn?.type === "tagCategory") && (sortColumn.name === tagCategory.name)) ? "sort-column" : "";
                                let sortValue = { type: "tagCategory", name: tagCategory.id };

                                return (<td className={className} onClick={() => setSortColumn(sortValue)}>{tagCategory.name}</td>);
                            })}
                        </>);
                    }
                    else if(field === "designSource") {
                        let patternClassName = ((sortColumn?.type === "designSource") && (sortColumn?.name === "pattern")) ? "sort-column" : "";
                        let designerClassName = ((sortColumn?.type === "designSource") && (sortColumn?.name === "designer")) ? "sort-column" : "";
                        let sortValue = { type: "designSource" };

                        return (<>
                            <td className={patternClassName} onClick={() => setSortColumn({ ...sortValue, name: "pattern" })}>Pattern</td>
                            <td className={designerClassName} onClick={() => setSortColumn({ ...sortValue, name: "designer" })}>Designer</td>
                        </>);
                    }
                    else {
                        let className = ((sortColumn?.type === "field") && (sortColumn?.name === field)) ? "sort-column" : "";
                        let sortValue = { type: "field", name: field };

                        return (<td className={className} onClick={() => setSortColumn(sortValue)}>{QuiltFields[field]?.label || field}</td>);
                    }
                })
            }
        </tr>);
    };

    const buildPreview = () => {
        let preview ={
            quilt: {},
            hangingLocation: { wall: { name: "Wall 4C" } },
            count: 4
        };
        report.fields.forEach(field => preview[field] = QuiltFields[field].example);
        return (
            <tr key={"report_preview"}>
                {report.fields.map(field => 
                    buildCell(field, preview)
                )}
            </tr>
        );
    };


    const getTagCategory = (id) => {
        return show.tagCategories.filter(tc => tc.id === Number(id))[0];
    };


    const render = (field, data) => {
        let renderers = ReportRenderers[field];
        let renderer = renderers.default;
        if (renderers) {
            renderer = renderers.report || renderers.default;
        }

        return renderer(data);
    }

    const buildCell = (field, data, index) => {
        if(field === "tags") {
            return (<>
                {
                    report["tags"].categories.map(tcId => {
                        return(<td className={field} key={`report_${field}_${index}`}>{ReportRenderers.tags.forCategory(getTagCategory(tcId), data)}</td>);
                    })
                }
            </>);
        }
        else if(field === "designSource") {
            let designSource = data.quilt.designSource;
            if(designSource.designSourceType?.toUpperCase() === "MAGAZINE") {
                return (<><td>{designSource.title}</td><td>{`${designSource.name || ""} - ${designSource.issueNumber || ""} - ${designSource.publishedYear || ""}`}</td></>)
            }
            if(designSource.designSourceType?.toUpperCase() === "BOOK") {
                return (<><td>{designSource.title}</td><td>{`${designSource.name || ""} - ${designSource.author || ""} - ${designSource.publishedYear || ""}`}</td></>)
            }
            if(designSource.designSourceType?.toUpperCase() === "WORKSHOP") {
                return (<><td>{`Workshop - ${designSource.name || ""}`}</td><td>{`${designSource.author || ""}`}</td></>)
            }
            if(designSource.designSourceType?.toUpperCase() === "ORIGINAL") {
                return (<><td>Original Design</td><td>Original Design</td></>)
            }
            if(designSource.designSourceType?.toUpperCase() === "OTHER") {
                return (<><td>{designSource.name || ""}</td><td></td></>)
            }

            return (<><td></td><td></td></>);
        }
        else if(field === "perimeter") {
            return (<td className={field} key={`report_${field}_${index}`}>{render(field, data)}</td>);
        }
        else {
            return (<td className={field} key={`report_${field}_${index}`}>{render(field, data)}</td>);
        }
    };

    const buildRow = (data, index) => {
        return (
            <tr key={`report_row_${index}`}>
                {report.fields.map(field =>
                    buildCell(field, data, index)
                )}
            </tr>
        );
    };


    const sortResults = (results) => {
        if(!results) {
            return [];
        }

        if(!sortColumn) {
            return results;
        }

        if(sortColumn.type === "field") {
            return results.sort(ReportSorters[sortColumn.name]);
        }

        if(sortColumn.type === "tagCategory") {
            return results.sort(ReportSorters.tagCategory(getTagCategory(sortColumn.name)));
        }

        if(sortColumn.type === "designSource") {
            if(sortColumn.name === "pattern") {
                return results.sort(ReportSorters.designSource("title"));
            }
            if(sortColumn.name === "designer") {
                return results.sort(ReportSorters.designSource("author"));
            }
        }

        return results;
    };


    if (!report || !report.fields) {
        return (<p>Report details missing</p>)
    }

    return (
        <>
            <div className="row-count">{results.length} rows</div>
            <table className="report table-formatter">
                <thead>{buildHeader()}</thead>
                <tbody>
                    {preview
                        ? buildPreview()
                        : sortResults(results).map((d, i) =>
                            buildRow(d, i)
                        )
                    }
                </tbody>
            </table>
        </>
    );
};

export default TableFormatter;