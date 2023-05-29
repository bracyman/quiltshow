
import { QuiltFields, Renderers, } from "../../components/quilts/QuiltFields";
import "./styles/CheckInOutFormatter.css";

const CheckInOutFormatter = (props) => {
    const { report, results, preview, show } = props;
    const piecingCategory = show.tagCategories.filter(tc => tc.name === "Piecing Type")[0];
    const quiltingCategory = show.tagCategories.filter(tc => tc.name === "Quilting Style")[0];

    const groupResults = () => {
        let people = { entrants: [] };
        results.forEach(q => {
            if(people[q.enteredBy.id]) {
                people[q.enteredBy.id].push(q);
            }
            else {
                people.entrants.push(q.enteredBy);
                people[q.enteredBy.id] = [q];
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
            return Renderers.tags.forCategory(piecingCategory, data);
        }
        else if(field === "quiltingStyle") {
            return Renderers.tags.forCategory(quiltingCategory, data);
        }

        if(field === "groupSize") {
            field = field;
        }

        let renderers = Renderers[field];
        let renderer = Renderers.default;
        if (renderers) {
            renderer = renderers.report || renderers.default;
        }

        return renderer(data[field]);
    };
    
    const buildPreview = () => {
 
    };

    const buildPage = (person, quilts) => {
        return (
            <div className="page">
                <div className="header">
                    <div className="title">{show.name}</div>
                    <div className="entrant">{`${person.firstName} ${person.lastName} - ${quilts.length} entries`}</div>
                </div>
                <div className="main">
                    {quilts.map(q => (
                        <table>
                            <tr>
                                <td className="initials">Drop Off Initials</td>
                                <td className="number">#{render("number", q)}</td>
                                <td className="name">{render("name", q)}</td>
                                <td className="location"></td>
                                <td className="tags">{q ? "Judged" : "" }</td>
                                <td className="initials">Pick Up Initials</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>{render("groupSize", q)}</td>
                                <td>{render("quiltingStyle", q)}</td>
                                <td>{render("category", q)}</td>
                                <td>{render("piecingType", q)}</td>
                                <td></td>
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