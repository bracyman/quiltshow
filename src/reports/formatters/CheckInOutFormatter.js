
import { QuiltFields, ReportRenderers, } from "../../components/quilts/QuiltFields";
import "./styles/CheckInOutFormatter.css";

const CheckInOutFormatter = (props) => {
    const { report, results, preview, show } = props;
    const piecingCategory = show.tagCategories.filter(tc => tc.name === "Piecing Type")[0];
    const quiltingCategory = show.tagCategories.filter(tc => tc.name === "Quilting Style")[0];

    const groupResults = () => {
        let people = { entrants: [] };
        results.forEach(qsd => {
            if(people[qsd.quilt.enteredBy.id]) {
                people[qsd.quilt.enteredBy.id].push(qsd);
            }
            else {
                people.entrants.push(qsd.quilt.enteredBy);
                people[qsd.quilt.enteredBy.id] = [qsd];
            }
        });

        people.entrants.sort((a,b) => (a.lastName < b.lastName) 
            ? -1 
            : a.lastName > b.lastName
                ? 1
                : a.firstName < b.firstName
                    ? -1
                    : 1);
        
        return people;
    };


    const render = (field, data) => {
        if(field === "piecingType") {
            return ReportRenderers.tags.forCategory(piecingCategory, data);
        }
        else if(field === "quiltingStyle") {
            return ReportRenderers.tags.forCategory(quiltingCategory, data);
        }

        let renderers = ReportRenderers[field];
        let renderer = renderers.report || renderers.default;

        return renderer(data);
    };
    
    const buildPreview = () => {
 
    };

    const buildPage = (person, qsds) => {
        return (
            <div className="page">
                <div className="header">
                    <div className="title">{show.name}</div>
                    <div className="entrant">{`${person.firstName} ${person.lastName} - ${qsds.length} entries`}</div>
                </div>
                <div className="main">
                    {qsds.map(qsd => (
                        <table>
                            <tr>
                                <td className="initial-label">Drop Off Initials</td>
                                <td className="number">#{render("number", qsd)}</td>
                                <td className="name">{render("name", qsd)}</td>
                                <td className="location">{render("hangingLocation", qsd)}</td>
                                <td className="tags">{qsd.quilt.judged ? "Judged" : "" }</td>
                                <td className="initial-label">Pick Up Initials</td>
                            </tr>
                            <tr>
                                <td className="initial-box"></td>
                                <td>{render("groupSize", qsd)}</td>
                                <td>{render("quiltingStyle", qsd)}</td>
                                <td>{render("category", qsd)}</td>
                                <td>{render("piecingType", qsd)}</td>
                                <td className="initial-box"></td>
                            </tr>
                        </table>
                    ))}
                </div>
                <div className="footer">
                    <div>EIHQ is not responsible for any unclaimed items. Make arrangements if you cannot pick up your quilts.</div>
                    <div>_______________________________________________________</div>
                    <div>Entrant's Signature (at time of drop off)</div>
                    <div>_______________________________________________________</div>
                    <div>Committee Signature (at time of drop off)</div>
                    <div><br/></div>
                    <div>_______________________________________________________</div>
                    <div>Released to Entrant - I have received my entry items in good condition.</div>
                    <div>_______________________________________________________</div>
                    <div>Committee Signature (at time of pick up)</div>
                    <div>Person Picking Up Entries (if not entrant): __________________________________</div>
                </div>
            </div>
        );
    };


    const groups = groupResults();

    return (
        <>
            <div className="report CheckInOut">
                {preview
                    ? buildPreview()
                    : groups.entrants.map((person, i) => <>
                            {buildPage(person, groups[person.id])}
                            {buildPage(person, groups[person.id])}
                        </>
                    )
                }
            </div>
        </>
    );
};

export default CheckInOutFormatter;