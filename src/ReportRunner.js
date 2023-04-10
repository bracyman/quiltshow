import { useState } from "react";
import { useQuery } from "react-query";
import ReportList from "./reports/ReportList";
import ReportPreview from "./reports/ReportPreview";
import { useSearchParams } from 'react-router-dom';
import ReportFormatter from "./reports/formatters/ReportFormatter";
import ExpiringStorage from "./services/ExpiringStorage";
import ReportService, { IN_PROGRESS_REPORT } from "./services/ReportService";

const ReportRunner = (props) => {
    const [reportToPreview, setReportToPreview] = useState(null);
    const urlSearchParams = new URLSearchParams(window.location.search);
    const reportId = urlSearchParams.get("reportId");
    const { data, status } = useQuery(
        reportId ? "runningReport" : "listReports",
        reportId
            ?  // run the report and display the results
            async () => {
                let results = null;
                if (reportId === IN_PROGRESS_REPORT) {
                    results = await ReportService.runReport(ExpiringStorage.getItem(IN_PROGRESS_REPORT));
                }
                else {
                    results = await ReportService.runReport(reportId);
                }

                return results;
            }

            : // list the available reports
            async () => {
                let results = await ReportService.getReports();
                let reports = {
                    favorites: results.filter(r => r.favorite),
                    quilts: results.filter(r => (r.reportCategory === `SHOW`)),
                    awards: results.filter(r => (r.reportCategory === `AWARDS`)),
                    other: results.filter(r => (r.reportCategory === `MISCELLANEOUS`)),
                };

                return reports;
            }
    );

    console.log(`Displaying report ${reportId || "none"}`);


    const runReport = (report) => {
        console.log(`Running report ${report}`);
        if (report instanceof Object) {
            window.open(`/?headless=1&reportId=${report.id}#/reports`);
        }
        else {
            window.open(`/?headless=1&reportId=${report}#/reports`);
        }
    };

    const previewReport = (report) => {
        setReportToPreview(report);
    };

    const createNewReport = () => {
        window.location.href = '/#/reportBuilder';
    };

    if (reportId && (status === "success")) {
        return (<ReportFormatter report={data.report} results={data.results} show={props.show} />);
    }
    else if (reportId && (status === "loading")) {
        return (<p>Loading report...</p>);
    }
    else {
        if (status === "loading") {
            <p>Loading reports...</p>
        }
        else {
            return (
                <>
                    <button onClick={createNewReport}>Create Report</button>
                    <ReportList id="reportList" reports={data || []} runReport={runReport} previewReport={previewReport} show={props.show} />
                    <ReportPreview id="reportPreview" report={reportToPreview} runReport={runReport} show={props.show} />
                </>
            );
        }
    }

};

export default ReportRunner;