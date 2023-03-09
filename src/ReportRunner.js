import { useState } from "react";
import { useQuery } from "react-query";
import ReportList from "./reports/ReportList";
import ReportPreview from "./reports/ReportPreview";
import { useSearchParams } from 'react-router-dom';
import ReportFormatter from "./reports/formatters/ReportFormatter";
import ExpiringStorage from "./services/ExpiringStorage";
import ReportService, { IN_PROGRESS_REPORT } from "./services/ReportService";

const ReportRunner = (props) => {
    const [searchParams] = useSearchParams();
    const [reportToPreview, setReportToPreview] = useState(null);
    const reportId = searchParams.get("reportId");
    const {data, status} = useQuery("runningReport", async () => { 
        if(!reportId) {
            return null;
        }

        let results = null;
        if(reportId === IN_PROGRESS_REPORT) {
            results = await ReportService.runReport(ExpiringStorage.getItem(IN_PROGRESS_REPORT));
        } 
        else {
            results = await ReportService.runReport(reportId); 
        }

        return results;
    });

    console.log(`Displaying report ${reportId || "none"}`);

    const reports = {
        favorites: [{ id: 1, name: "Check In", description: "The Checkin form", format: "table", columns: [{name: "Quilt Name", field: "name"}]}],
        quilts: [],
        awards: [],
        other: []
    };

    const runReport = (report) => {
        console.log(`Running report ${report}`);
        window.open(`/reports?headless=1&reportId=${report.id}`);
    };

    const previewReport = (report) => {
        setReportToPreview(report);
    };

    if(reportId && (status === "success")) {
        return (<ReportFormatter report={data.report} results={data.results}  />);
    }
    else if(reportId && (status === "loading")) {
        return (<p>Loading report...</p>);
    }
    else {
        return (
            <>
                <ReportList id="reportList" reports={reports} runReport={runReport} previewReport={previewReport} />
                <ReportPreview id="reportPreview" report={reportToPreview} />
            </>
        );
    }

};

export default ReportRunner;