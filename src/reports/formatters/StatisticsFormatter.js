import "./styles/StatisticsFormatter.css";
import DateUtils from "../../utilities/DateUtils";

const StatisticsFormatter = (props) => {
    const { report, preview, show } = props;
    const results = props.results[0];

    const groupSizeSort = (a, b) => {
        let aVal = a === "Solo" ? -1 : a === "Duet" ? 0 : 1;
        let bVal = b === "Solo" ? -1 : b === "Duet" ? 0 : 1;

        return aVal < bVal ? -1 : aVal === bVal ? 0 : 1;
    };

    const ribbonSort = (a, b) => {
        let aVal = a === "First" ? -1 : a === "Second" ? 0 : a === "Third" ? 3 : 4;
        let bVal = b === "First" ? -1 : b === "Second" ? 0 : b === "Third" ? 3 : 4;

        return aVal < bVal ? -1 : aVal === bVal ? 0 : 1;
    };

    return (<>
            <div className="statistics-report-header">
                <img alt="EIHQ Logo" src="/img/logo.jpg" className="logo"/>
                <div className="title">{`Statistics - ${show.name} ${DateUtils.getYear(show.startDate)}`}</div>
            </div>
            <div className="report statistics">
                <div className="entries">
                    <div className="title">Entries</div>
                    <div className="values">
                        <div>Number of entries: {results.totalQuilts || 0}</div>
                        <div>Number judged: {results.totalJudgedQuilts || 0}</div>
                        <div>Number of first-time entries: {results.totalFirstTimeQuilts || 0}</div>
                    </div>
                </div>

                <div className="entrants">
                    <div className="title">Entrants</div>
                    <div className="values">
                        <div>Number of entrants: {results.numEntrants || 0}</div>
                        <div>Average no. of entries per entrant: {results.avgPerEntrant || 0}</div>
                        <div>Number of judged entrants: {results.numJudgedEntrants || 0}</div>
                        <div>Average no. of judged entries per judged entrant: {results.avgJudgedPerEntrant || 0}</div>
                    </div>
                </div>

                <div className="categories">
                    <table>
                        <tr>
                            <th>Category</th>
                            <th>Entries</th>
                            <th>Judged</th>
                        </tr>
                        {Object.keys(results.entriesPerCategory).sort().map(category => 
                            <tr>
                                <td>{category}</td>
                                <td>{results.entriesPerCategory[category] || 0}</td>
                                <td>{results.judgedEntriesPerCategory[category] || 0}</td>
                            </tr>
                        )}
                    </table>
                </div>

                <div className="tag-counts">
                    <div className="techniques">
                        <table>
                            <tr>
                                <th>Technique</th>
                                <th>Entries</th>
                            </tr>
                            {Object.keys(results.entriesPerTechnique).sort().map(technique => 
                                <tr>
                                    <td>{technique}</td>
                                    <td>{results.entriesPerTechnique[technique]}</td>
                                </tr>
                            )}
                        </table>
                    </div>

                    <div className="methods">
                        <table>
                            <tr>
                                <th>Quilting Method</th>
                                <th>Entries</th>
                            </tr>
                            {Object.keys(results.entriesPerMethod).sort().map(method => 
                                <tr>
                                    <td>{method}</td>
                                    <td>{results.entriesPerMethod[method]}</td>
                                </tr>
                            )}
                        </table>
                    </div>

                    <div className="special-events">
                        <table>
                            <tr>
                                <th>Special Event</th>
                                <th>Entries</th>
                            </tr>
                            {Object.keys(results.entriesPerSpecialEvent).sort().map(event => 
                                <tr>
                                    <td>{event}</td>
                                    <td>{results.entriesPerSpecialEvent[event]}</td>
                                </tr>
                            )}
                        </table>
                    </div>
                </div>

                <div className="judging-entries">
                    <div className="group-size">
                        <table>
                            <tr>
                                <th>Group Size</th>
                                <th>Entries</th>
                                <th>Judged</th>
                            </tr>
                            {Object.keys(results.entriesPerGroupSize).sort(groupSizeSort).map(groupSize => 
                                <tr>
                                    <td>{groupSize}</td>
                                    <td>{results.entriesPerGroupSize[groupSize] || 0}</td>
                                    <td>{results.judgedEntriesPerGroupSize[groupSize] || 0}</td>
                                </tr>
                            )}
                        </table>
                    </div>

                    <div className="ribbons">
                        <table>
                            <tr>
                                <th>Ribbon</th>
                                <th>Entries</th>
                                <th>Ribbons</th>
                            </tr>
                            {/*Object.keys(results.entriesPerRibbon || {}).sort(ribbonSort).map(ribbon => 
                                <tr>
                                    <td>{ribbon}</td>
                                    <td>{results?.entriesPerRibbon[ribbon] || 0}</td>
                                    <td>{results?.numRibbonPerType[ribbon] || 0}</td>
                                </tr>
                            )*/}
                        </table>
                    </div>
                </div>

                <div className="alpha-groups">
                    <div className="title">Number of Entries per Entrant Last Name</div>
                    <table>
                        <tr>
                            {Array.from(Array(9)).map((e, i) => i + 65).map(letter => String.fromCharCode(letter)).map(letter =>
                                <td>{letter}<br/>{results.entriesPerAlpha[letter] || 0}</td>
                            )}
                        </tr>
                        <tr>
                            {Array.from(Array(9)).map((e, i) => i + 74).map(letter => String.fromCharCode(letter)).map(letter =>
                                <td>{letter}<br/>{results.entriesPerAlpha[letter] || 0}</td>
                            )}
                        </tr>
                        <tr>
                            {Array.from(Array(8)).map((e, i) => i + 83).map(letter => String.fromCharCode(letter)).map(letter =>
                                <td>{letter}<br/>{results.entriesPerAlpha[letter] || 0}</td>
                            )}
                        </tr>
                    </table>
                </div>


            </div>
        </>
    );
};

export default StatisticsFormatter;
