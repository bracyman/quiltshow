import { useState } from "react";
import { ReportRenderers, ReportSorters } from "../../components/quilts/QuiltFields";
import "./styles/ShowAwardsFormatter.css";


const SPECIALTY = "Specialty";

const ShowAwardsFormatter = (props) => {
    const { report, results, preview, show } = props;

    const getAwardCategories = () => {
        return [ ...show.categories.filter(c => ((c.name !== "Holding") && (c.name !== "President's Challenge - Not Judged"))), { name: SPECIALTY }];
    };

    const getAwards = (awardCategory) => {
        let awards = null;
        if(awardCategory === null) {
            awards = show.awards.filter(a => a.category === null);
            awards.sort((a,b) => (a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0);
        }
        else {
            awards = show.awards.filter(a => a.category?.id === awardCategory.id);
            awards.sort((a,b) => (a.displayOrder > b.displayOrder) ? 1 : (a.displayOrder < b.displayOrder) ? -1 : 0);
        }

        return awards;
    };

    const countQuiltsInCategory = (category, qsds) => {
        return qsds.filter(qsd => (qsd.quilt.judged && (qsd.quilt.category.id === category.id))).length;
    };

    const getAwardedQuilts = (qsds, award) => {
        return qsds.filter(qsd => qsd.quilt.awards.find(a => a.id === award.id));   
    };

    const render = (field, qsd) => {
        let renderer = ReportRenderers[field].report || ReportRenderers[field].default;
        return renderer(qsd);
    };

    const buildAwardTable = (awardCategory, qsds) => {
        let awards = getAwards(awardCategory);
        let total = awardCategory === SPECIALTY ? 0 : countQuiltsInCategory(awardCategory, qsds);
        return (
            <div className="award-container">
                <div className="award-name">{`${awardCategory.name || SPECIALTY}${(total > 0) ? (" - " + total + " entries") : ""}`}</div>
                <table className="awards-table">
                    <tr className="header-row">
                        <th className="award">Award</th>
                        <th className="enteredBy">Entered By</th>
                        <th className="quiltedBy">Quilted By</th>
                        <th className="number">Quilt #</th>
                        <th className="name">Name</th>
                    </tr>
                    {awards.map(award => 
                        getAwardedQuilts(qsds, award).map(qsd => (
                            <tr className="award-entry">
                                <td className="award-rank">{`${award.name}${award.color ? (" / " + award.color) : ""}`}</td>
                                <td className="enteredBy">{render("enteredBy", qsd)}</td>
                                <td className="quiltedBy">{render("quiltedBy", qsd)}</td>
                                <td className="number">{render("number", qsd)}</td>
                                <td className="name">{render("name", qsd)}</td>
                            </tr>
                        ))
                    )}
                </table>
            </div>
        );
    };

    return (
        <>
            <div className="report show-awards-formatter">
                {
                    getAwardCategories().map(awardCategory => buildAwardTable(awardCategory, results))
                }
            </div>
        </>
    );
};

export default ShowAwardsFormatter;