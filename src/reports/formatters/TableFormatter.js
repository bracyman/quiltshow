
import { QuiltFields, Renderers } from "../../components/quilts/QuiltFields";
import "./styles/TableFormatter.css";


const TableFormatter = (props) => {
    const { report, results, preview, show } = props;


    const buildHeader = () => {
        return (<tr key={"report_header"}>
            {
                report.fields.map(field => {
                    if(field === "tags") {
                        return (<>
                            {report["tags"].categories.map(tcId => {
                                let tagCategory = getTagCategory(tcId);
                                return (<td>{tagCategory.name}</td>);
                            })}
                        </>);
                    }
                    else if(field === "designSource") {
                        return (<>
                            <td>Pattern</td>
                            <td>Designer</td>
                        </>);
                    }
                    else {
                        return (<td>{QuiltFields[field]?.label || field}</td>);
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

    if (!report || !report.fields) {
        return (<p>Report details missing</p>)
    }

    return (
        <table className="report">
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

export default TableFormatter;