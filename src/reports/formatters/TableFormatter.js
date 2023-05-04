import { useState } from "react";
import { QuiltFields, Sorters, Renderers } from "../../components/quilts/QuiltFields";
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
        let preview ={};
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
        let renderers = Renderers[field];
        let renderer = Renderers.default;
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
                        let categoryTags = getTagCategory(tcId).tags.map(tc => tc.id);
                        let filteredTags = data["tags"].filter(t => categoryTags.includes(t.id));
                        return(<td className={field} key={`report_${field}_${index}`}>{render(field, filteredTags)}</td>);
                    })
                }
            </>);
        }
        else if(field === "designSource") {
            let source = data[field];
            if(data[field].designSourceType?.toUpperCase() === "MAGAZINE") {
                return (<><td>{source.title}</td><td>{`${source.name} - ${source.issueNumber} - ${source.publishedYear}`}</td></>)
            }
            if(data[field].designSourceType?.toUpperCase() === "BOOK") {
                return (<><td>{source.title}</td><td>{`${source.name} - ${source.author} - ${source.publishedYear}`}</td></>)
            }
            if(data[field].designSourceType?.toUpperCase() === "WORKSHOP") {
                return (<><td>{`Workshop - ${source.name}`}</td><td>{`${source.author}`}</td></>)
            }
            if(data[field].designSourceType?.toUpperCase() === "ORIGINAL") {
                return (<><td>Original Design</td><td>Original Design</td></>)
            }
            if(data[field].designSourceType?.toUpperCase() === "OTHER") {
                return (<><td>{source.name}</td><td></td></>)
            }

            return (<><td></td><td></td></>);
        }
        else {
            return (<td className={field} key={`report_${field}_${index}`}>{render(field, data[field])}</td>);
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
            return results.sort(Sorters[sortColumn.name]);
        }

        if(sortColumn.type === "tagCategory") {
            return results.sort(Sorters.tagCategory(getTagCategory(sortColumn.name)));
        }

        if(sortColumn.type === "designSource") {
            if(sortColumn.name === "pattern") {
                return results.sort(Sorters.designSource("title"));
            }
            if(sortColumn.name === "designer") {
                return results.sort(Sorters.designSource("author"));
            }
        }

        return results;
    };


    if (!report || !report.fields) {
        return (<p>Report details missing</p>)
    }

    return (
        <table className="report">
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
    );
};

export default TableFormatter;