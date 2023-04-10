
import { QuiltFields, Renderers } from "../../components/quilts/QuiltFields";
import "./styles/CardFormatter.css";


const CardFormatter = (props) => {
    const { report, results, preview } = props;


    const render = (field, data) => {
        let renderers = Renderers[field];
        let renderer = Renderers.default;
        if (renderers) {
            renderer = renderers.report || renderers.default;
        }

        return renderer(data[field]);
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
        let previewEntry = {};
        report.fields.map(field => previewEntry[field] = QuiltFields[field].example);

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