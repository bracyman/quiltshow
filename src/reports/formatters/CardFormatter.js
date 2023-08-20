
import { QuiltFields, ReportRenderers } from "../../components/quilts/QuiltFields";
import "./styles/CardFormatter.css";


const CardFormatter = (props) => {
    const { report, results, preview } = props;


    const render = (field, data) => {
        let renderers = ReportRenderers[field];
        let renderer = ReportRenderers.default;
        if (renderers) {
            renderer = renderers.report || renderers.default;
        }

        return renderer(data);
    }


    const buildCard = (data, index) => {
        return (
            <div className="report-card" key={`card_${index}`}>
                {report.fields.map(field => {
                    return (
                        <div className="field">
                            <div className="label">{QuiltFields[field].label}</div>
                            <div className="field-value">{render(field, data)}</div>
                        </div>
                    )
                })}
            </div>
        );
    };


    const buildPreview = () => {
        let previewEntry = {
            quilt: {},
            hangingLocation: { wall: { name: "Booth 10A" } },
        };
        report.fields.map(field => previewEntry.quilt[field] = QuiltFields[field].example);

        return buildCard(previewEntry);
    };


    if (!report || !report.fields) {
        return (<p>Report details missing</p>)
    }

    return (
        <div className="report">
            {preview
                ? buildPreview()
                : results?.map((d, i) =>
                    buildCard(d, i)
                )
            }
        </div>
    );
};

export default CardFormatter;