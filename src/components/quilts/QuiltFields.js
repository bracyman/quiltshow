
import ObjectUtils from "../../utilities/ObjectUtils";
import StringUtils from "../../utilities/StringUtils";
import { Badge } from "react-bootstrap";

export const QuiltFields = {
    id: { label: "ID", type: "string", example: 15, },
    number: { label: "Number", type: "string", example: 1027, },
    name: { label: "Name", type: "string", example: "Flower Fairies", },
    description: { label: "Description", type: "longString", example: "I made this quilt for my granddaughter Hyacinth. Her favorite book is an old breakdown of how to find fairies in English gardens, and I tried to capture the spirit of the watercolor illustrations.", },
    category: {
        label: "Category",
        type: "category",
        example: {
            name: "Art Quilt",
            judgeable: true,
            displayOrder: 12,
            shortDescription: "An artistic representation rendered with piecing and stitching",
            description: "An artistic representation rendered with piecing and stitching",
        },
    },
    tags: {
        label: "Tags", type: "list(tag)",
        example: [
            { "id": 34, "name": "Machine Piecing", "description": null },
            { "id": 23, "name": "Station Machine Quilted", "description": null },
        ],
    },
    judged: { label: "Judged", type: "boolean", example: true, },
    presidentsChallenge: { label: "President's Challenge", type: "boolean", example: false, },
    length: { label: "Height", type: "number", example: 84, },
    width: { label: "Width", type: "number", example: 45, },
    firstShow: { label: "First Show", type: "boolean", example: false, },
    firstEntry: { label: "First Entry", type: "boolean", example: false, },
    groupSize: { label: "Group Size", type: "groupSize", example: "DUET", },
    mainColor: { label: "Main Color", type: "string", example: "Blue", },
    designSource: { label: "Design Source", type: "designSource", 
        example: {
			"id": 78,
			"designSourceType": "BOOK",
			"name": "Quilts In The Tradition of Frank Lloyd Wright",
			"title": "Darwin D Martin House Tree Of Life",
			"publishedYear": "1995",
			"author": "Jackie Robinson",
			"issueNumber": null,
			"contactInfo": null
		}, 
    },
    enteredBy: { label: "Entrant", type: "person", 
        example: {
			"email": "beldingjeanie@gmail.com",
			"firstName": "Jeanie",
			"lastName": "Belding",
			"address1": "405 South Troy Road",
			"address2": null,
			"city": "Robins",
			"state": "IA",
			"zip": "52328",
			"phone": "(319) 294-1397",
		}
    },
    hangingPreference: { label: "Hanging Preference", type: "number", example: 1, },
    quiltedBy: { label: "Quilted By", type: "string", example: "Joan Jett", },
    additionalQuilters: { label: "Additional Quilters", type: "string", example: "Libby Masters, Beth Anne", },
    submittedOn: { label: "Submitted", type: "date", example: "02/15/23", },
    awards: { label: "Awards", type: "list(award)", example: "2nd Place - Hand Quilted, Judge's Choice", },
    hangingLocation: { label: "Hanging Location", type: "location", 
        example: {
            id: 14,
            name: "14C",
            quilts: []
        }
    },

    judgeComment: { label: "Judge's Comments", type: "judgeComment", 
        example: {}
    },

    /* psuedo-fields */
    perimeter: { label: "Perimeter", type: "number", example: 212.5, },

    count: { label: "Count", type: "number", example: 3, },
};


export const CategoryFields = [
    { field: "name", name: "Name" },
    { field: "shortDescription", name: "Short Description" },
    { field: "description", name: "Full Description", dataType: "longString" },
    { field: "importance", name: "Importance", dataType: "number" },
    { field: "fun", name: "Fun", dataType: "boolean" },
    { field: "strange", name: "Strange", dataType: "string", displayFunction: (v) => v.toUpperCase() },
];


export const alphaSort = (a, b) => {
    if (!a && !b) return 0;
    if (!a) return -1;
    if (!b) return 1;

    return (a.toLowerCase() > b.toLowerCase())
        ? 1
        : (a.toLowerCase() < b.toLowerCase())
            ? -1
            : 0;
};

export const numericSort = (a, b) => {
    if (!a && !b) return 0;
    if (!a) return -1;
    if (!b) return 1;

    return (a > b)
        ? 1
        : (a < b)
            ? -1
            : 0;
};

export const dateSort = (a, b) => {
    if (!a && !b) return 0;
    if (!a) return -1;
    if (!b) return 1;

    return (a > b)
        ? 1
        : (a < b)
            ? -1
            : 0;
}

export const booleanSort = (a, b) => {
    if (ObjectUtils.isNull(a) && ObjectUtils.isNull(b)) return 0;
    if (ObjectUtils.isNull(a)) return -1;
    if (ObjectUtils.isNull(b)) return 1;

    return (a && b)
        ? 0
        : (a && !b)
            ? 1
            : (!a && b)
                ? -1
                : 0;
};

export const listSort = (a, b, field, sortFunction) => {
    if (!a && !b) return 0;
    if (!a) return -1;
    if (!b) return 1;

    if ((a.length === 0) && (b.length === 0)) return 0;
    if (a.length === 0) return -1;
    if (b.length === 0) return 1;

    if (!sortFunction) {
        sortFunction = alphaSort;
    }

    let sortedA = a.sort((a1, a2) => sortFunction(a1[field], a2[field]));
    let sortedB = b.sort((b1, b2) => sortFunction(b1[field], b2[field]));

    return (sortedA[0][field] > sortedB[0][field])
        ? 1
        : (sortedA[0][field] < sortedB[0][field])
            ? -1
            : 0;
};

export const awardSort = (a, b, awardName) => {
    let aAward = (a.awards || []).filter(award => (award.category === awardName) || ((awardName === "Specialty") && award.category === null));
    let bAward = (b.awards || []).filter(award => (award.category === awardName) || ((awardName === "Specialty") && award.category === null));

    if(aAward === null) {
        return (bAward === null) ? 0 : 1;
    }

    if(bAward === null) {
        return -1;
    }

    return (aAward.displayOrder > bAward.displayOrder) 
                ? 1 
                : (aAward.displayOrder < bAward.displayOrder) 
                    ? -1
                    : 0;
};

const categoryTags = (tagCategory, quilt) => {
    if(!tagCategory || !quilt) {
        return [];
    }

    return (quilt.tags || [])
        .filter(qt => 
            tagCategory.tags.map(t => t.id).includes(qt.id))
        .sort((a,b) => 
            a.name > b.name 
                ? 1 
                : a.name === b.name 
                    ? 0 
                    : -1
            );
};

export const Sorters = {
    id: (a, b) => numericSort(a?.id, b?.id),
    number: (a, b) => numericSort(a?.number, b?.number),
    name: (a, b) => alphaSort(a?.name, b?.name),
    description: (a, b) => alphaSort(a?.description, b?.description),
    category: (a, b) => alphaSort(a?.category?.name, b?.category?.name),
    tags: (a, b) => listSort(a?.tags, b?.tags, "name", alphaSort),
    tagCategory: (tc) => (a, b) => listSort(categoryTags(tc, a), categoryTags(tc, b), "name", alphaSort),
    judged: (a, b) => booleanSort(a?.judged, b?.judged),
    presidentsChallenge: (a, b) => booleanSort(a?.presidentsChallenge, b?.presidentsChallenge),
    length: (a, b) => numericSort(a?.length, b?.length),
    width: (a, b) => numericSort(a?.width, b?.width),
    firstShow: (a, b) => booleanSort(a?.firstShow, b?.firstShow),
    firstEntry: (a, b) => booleanSort(a?.firstEntry, b?.firstEntry),
    groupSize: (a, b) => numericSort(a?.groupSize, b?.groupSize),
    mainColor: (a, b) => alphaSort(a?.name, b?.name),
    designSource: (field) => (a, b) => alphaSort(a?.designSource[field || "name"], b?.designSource[field || "name"]),
    enteredBy: (a, b) => alphaSort(a?.enteredBy?.lastName, b?.enteredBy?.lastName),
    quiltedBy: (a, b) => alphaSort(a?.quiltedBy, b?.quiltedBy),
    hangingPreference: (a, b) => numericSort(a?.hangingPreference, b?.hangingPreference),
    additionalQuilters: (a, b) => alphaSort(a?.additionalQuilters, b?.additionalQuilters),
    submittedOn: (a, b) => dateSort(a?.submittedOn, b?.submittedOn),
    awards: (a, b) => listSort(a, b, "name", alphaSort),
    hangingLocation: (a, b) => alphaSort(a?.hangingLocation, b?.hangingLocation),
    count: (a, b) => numericSort(a?.count, b?.count),

    /* psuedo-fields */
    perimeter: (a, b) => numericSort((a.width * a.length), (b.width * b.length)),

    default: (a, b) => alphaSort(a, b),
};


export const ReportSorters = {
    id: (a, b) => numericSort(a?.quilt?.id, b?.quilt?.id),
    number: (a, b) => numericSort(a?.quilt?.number, b?.quilt?.number),
    name: (a, b) => alphaSort(a?.quilt?.name, b?.quilt?.name),
    description: (a, b) => alphaSort(a?.quilt?.description, b?.quilt?.description),
    category: (a, b) => alphaSort(a?.quilt?.category?.name, b?.quilt?.category?.name),
    tags: (a, b) => listSort(a?.quilt?.tags, b?.quilt?.tags, "name", alphaSort),
    tagCategory: (tc) => (a, b) => listSort(categoryTags(tc, a), categoryTags(tc, b), "name", alphaSort),
    judged: (a, b) => booleanSort(a?.quilt?.judged, b?.quilt?.judged),
    presidentsChallenge: (a, b) => booleanSort(a?.quilt?.presidentsChallenge, b?.quilt?.presidentsChallenge),
    length: (a, b) => numericSort(a?.quilt?.length, b?.quilt?.length),
    width: (a, b) => numericSort(a?.quilt?.width, b?.quilt?.width),
    firstShow: (a, b) => booleanSort(a?.quilt?.firstShow, b?.quilt?.firstShow),
    firstEntry: (a, b) => booleanSort(a?.quilt?.firstEntry, b?.quilt?.firstEntry),
    groupSize: (a, b) => numericSort(a?.quilt?.groupSize, b?.quilt?.groupSize),
    mainColor: (a, b) => alphaSort(a?.quilt?.name, b?.quilt?.name),
    designSource: (field) => (a, b) => alphaSort(a?.quilt?.designSource[field || "name"], b?.quilt?.designSource[field || "name"]),
    enteredBy: (a, b) => alphaSort(a?.quilt?.enteredBy?.lastName, b?.quilt?.enteredBy?.lastName),
    hangingPreference: (a, b) => numericSort(a?.quilt?.hangingPreference, b?.quilt?.hangingPreference),
    quiltedBy: (a, b) => alphaSort(a?.quilt?.quiltedBy, b?.quilt?.quiltedBy),
    additionalQuilters: (a, b) => alphaSort(a?.quilt?.additionalQuilters, b?.quilt?.additionalQuilters),
    submittedOn: (a, b) => dateSort(a?.quilt?.submittedOn, b?.quilt?.submittedOn),
    awards: (category) => (a,b) => awardSort(a.quilt, b.quilt, category),
    hangingLocation: (a, b) => alphaSort(a?.hangingLocation?.wall?.name, b?.hangingLocation?.wall?.name),
    count: (a, b) => numericSort(a?.count, b?.count),

    /* psuedo-fields */
    perimeter: (a, b) => numericSort((a?.quilt?.width * a?.quilt?.length), (b?.quilt?.width * b?.quilt?.length)),
};




export const Renderers = {
    id: {
        default: (val) => val,
    },
    number: {
        default: (val) => val,
    },
    name: {
        default: (val) => val,
    },
    description: {
        default: (val) => val,
        list: (val) => StringUtils.trimAfterLength(val, 30),
        report: (val) => val,
        long: (val) => val,
    },
    category: {
        default: (val) => val?.name || "---",
        long: (val) => `${val?.name | "---"} - ${val?.description}`,
    },
    tags: {
        default: (val) => val.map((t) => t.name).join(", "),
        list: (val) =>
            val.map((t) => (
                <Badge pill bg="primary">
                    {t.name}
                </Badge>
            )),
        report: (val) => val.map((t) => t.name).join(", "),
        forCategory: (tc, q) => categoryTags(tc, q).map(t => t.name).join(", ")
    },
    judged: {
        default: (val) => StringUtils.toString(val, "boolean"),
    },
    presidentsChallenge: {
        default: (val) => StringUtils.toString(val, "boolean"),
    },
    length: {
        default: (val) => StringUtils.toString(val, "number"),
    },
    width: {
        default: (val) => StringUtils.toString(val, "number"),
    },
    firstShow: {
        default: (val) => StringUtils.toString(val, "boolean"),
    },
    firstEntry: {
        default: (val) => StringUtils.toString(val, "boolean"),
    },
    groupSize: {
        default: (val) => StringUtils.upperFirstOnly(val),
    },
    mainColor: {
        default: (val) => StringUtils.upperFirstOnly(val || ""),
    },
    designSource: {
        default: (val) => StringUtils.upperFirstOnly(val?.name || ""),
        list: (val) => StringUtils.upperFirstOnly(val?.name || ""),
        report: (val) => StringUtils.upperFirstOnly(val?.name || ""),
        long: (val) => val ? `${StringUtils.upperFirstOnly(val.designSourceType)}: ${val.name}` : '',
    },
    enteredBy: {
        default: (val) => val ? `${val.firstName} ${val.lastName}` : '',
        list: (val) => val ? `${val.firstName} ${val.lastName}` : '',
        report: (val) => val ? ` ${val.lastName}, ${val.firstName}` : '',
        long: (val) => val
            ? (
                <div className="entrant">
                    <span className="name">{val.firstName} {val.lastName}</span>
                    <span className="email">{val.email}</span>
                    <span className="phone">{val.phone}</span>
                    <span className="address">{`${val.address1}`}</span>
                    {val.address2 ? (<span className="address">{`${val.address2}`}</span>) : (<></>)}
                    <span className="address">{`${val.city}, ${val.state}  ${val.zip}`}</span>
                </div>
            )
            : '',
    },
    hangingPreference: {
        default: (val) => StringUtils.toString(val, "number"),
    },
    quiltedBy:  {
        default: (val) => val,
    },
    additionalQuilters: {
        default: (val) => val,
    },
    submittedOn: {
        default: (val) => StringUtils.toString(val, "date"),
    },
    awards: {
        default: (val) => val || "",
    },
    hangingLocation: {
        default: (val) => val?.name || "",
    },
    count: {
        default: (val) => StringUtils.toString(val, "number"),
    },

    /* psuedo-fields */
    perimeter: {
        default: (val) => val ? StringUtils.toString(val.width * 2 + val.length * 2, "number") : "",
    },

    default: (val) => val ? val : '',
};




export const ReportRenderers = {
    id: {
        default: (qsd) => qsd?.quilt?.id || "",
    },
    number: {
        default: (qsd) => qsd?.quilt?.number || "",
    },
    name: {
        default: (qsd) => qsd?.quilt?.name || "",
        report:  (qsd) => qsd?.quilt?.name ? qsd?.quilt?.name : "",
        long:  (qsd) => qsd?.quilt?.judged ? (qsd?.quilt?.name + " *") : (qsd?.quilt?.name ? qsd?.quilt?.name : ""),
    },
    description: {
        default: (qsd) => qsd?.quilt?.description || "",
        list: (qsd) => StringUtils.trimAfterLength(qsd?.quilt?.description || "", 30),
        report: (qsd) => qsd?.quilt?.description || "",
        long: (qsd) => qsd?.quilt?.description || "",
    },
    category: {
        default: (qsd) => qsd?.quilt?.category?.name || "---",
        report:  (qsd) => qsd?.quilt?.category?.name || "",
        long: (qsd) => `${qsd?.quilt?.category?.name | "---"} - ${qsd?.quilt?.category?.description}`,
    },
    tags: {
        default: (qsd) => (qsd?.quilt?.tags || []).map((t) => t.name).join(", "),
        list: (qsd) =>
            (qsd?.quilt?.tags || []).map((t) => (
                <Badge pill bg="primary">
                    {t.name}
                </Badge>
            )),
        report: (qsd) => (qsd?.quilt?.tags || []).map((t) => t.name).join(", "),
        forCategory: (tc, qsd) => categoryTags(tc, qsd?.quilt).map(t => t.name).join(", ")
    },
    judged: {
        default: (qsd) => StringUtils.toString(qsd?.quilt?.judged, "boolean"),
        long: (qsd) => qsd?.quilt?.judged ? "Judged" : ""
    },
    presidentsChallenge: {
        default: (qsd) => StringUtils.toString(qsd?.quilt?.presidentsChallenge, "boolean"),
    },
    length: {
        default: (qsd) => StringUtils.toString(qsd?.quilt?.length, "number"),
    },
    width: {
        default: (qsd) => StringUtils.toString(qsd?.quilt?.width, "number"),
    },
    firstShow: {
        default: (qsd) => StringUtils.toString(qsd?.quilt?.firstShow, "boolean"),
    },
    firstEntry: {
        default: (qsd) => StringUtils.toString(qsd?.quilt?.firstEntry, "boolean"),
    },
    groupSize: {
        default: (qsd) => StringUtils.upperFirstOnly(qsd?.quilt?.groupSize),
    },
    mainColor: {
        default: (qsd) => StringUtils.upperFirstOnly(qsd?.quilt?.mainColor || ""),
    },
    designSource: {
        default: (qsd) => StringUtils.upperFirstOnly(qsd?.quilt?.designSource?.name || ""),
        list: (qsd) => StringUtils.upperFirstOnly(qsd?.quilt?.designSource?.name || ""),
        report: (qsd) => StringUtils.upperFirstOnly(qsd?.quilt?.designSource?.name || ""),
        long: (qsd) => { return qsd?.quilt?.designSource ? 
                        (qsd.quilt.designSource.designSourceType === "MAGAZINE") ? designSourceTypeMagazine(qsd.quilt.designSource)
                        : (qsd.quilt.designSource.designSourceType === "BOOK") ? designSourceTypeBook(qsd.quilt.designSource)
                        : (qsd.quilt.designSource.designSourceType === "WORKSHOP") ? designSourceTypeWorkshop(qsd.quilt.designSource)
                        : (qsd.quilt.designSource.designSourceType === "ORIGINAL") ? designSourceTypeOriginal(qsd.quilt.designSource)
                        : (qsd.quilt.designSource.designSourceType === "OTHER") ? designSourceTypeOther(qsd.quilt.designSource)
                        : ""
                    : ""
            }

    },
    enteredBy: {
        default: (qsd) => qsd ? `${StringUtils.upperFirstOnly(qsd?.quilt?.enteredBy?.firstName)} ${StringUtils.upperFirstOnly(qsd?.quilt?.enteredBy?.lastName)}` : '',
        list: (qsd) => qsd ? `${qsd?.quilt?.enteredBy?.firstName} ${StringUtils.upperFirstOnly(qsd?.quilt?.enteredBy?.lastName)}` : '',
        report: (qsd) => qsd ? ` ${StringUtils.upperFirstOnly(qsd?.quilt?.enteredBy?.firstName)} ${StringUtils.upperFirstOnly(qsd?.quilt?.enteredBy?.lastName)}` : '',
        long: (qsd) => qsd
            ? (
                <div className="entrant">
                    <span className="name">{StringUtils.upperFirstOnly(qsd?.quilt?.enteredBy?.firstName)} {StringUtils.upperFirstOnly(qsd?.quilt?.enteredBy?.lastName)}</span>
                    <span className="email">{qsd?.quilt?.enteredBy?.email}</span>
                    <span className="phone">{qsd?.quilt?.enteredBy?.phone}</span>
                    <span className="address">{`${qsd?.quilt?.enteredBy?.address1}`}</span>
                    {qsd.address2 ? (<span className="address">{`${qsd?.quilt?.enteredBy?.address2}`}</span>) : (<></>)}
                    <span className="address">{`${StringUtils.upperFirstOnly(qsd?.quilt?.enteredBy?.city)}, ${qsd?.quilt?.enteredBy?.state}  ${qsd?.quilt?.enteredBy?.zip}`}</span>
                </div>
            )
            : '',
    },
    hangingPreference: {
        default: (qsd) => StringUtils.toString(qsd?.quilt?.hangingPreference, "number"),
    },
    quiltedBy: {
        default: (qsd) => qsd?.quilt?.quiltedBy ? qsd?.quilt?.quiltedBy : `${StringUtils.upperFirstOnly(qsd?.quilt?.enteredBy?.firstName)} ${StringUtils.upperFirstOnly(qsd?.quilt?.enteredBy?.lastName)}`
    },
    additionalQuilters: {
        default: (qsd) => qsd?.quilt?.additionalQuilters,
        long: (qsd) => (qsd?.quilt?.additionalQuilters || "").split(",").map(q => (
            <span className="additional-quilter">{q}</span>
        ))
    },
    submittedOn: {
        default: (qsd) => StringUtils.toString(qsd?.quilt?.submittedOn, "date"),
    },
    awards: {
        default: (qsd) => (qsd?.quilt?.awards || []).map(a => `${a.name}${a.color ? ("/" + a.color) : ""} ${a.category?.name || "Specialty"}`).join(", "),
    },
    hangingLocation: {
        default: (qsd) => qsd?.hangingLocation 
                    ? (qsd.hangingLocation?.wall?.hangingUnit?.name || "") + "-" + getWallSection(qsd.hangingLocation?.wall)
                    : "",
    },
    count: {
        default: (qsd) => StringUtils.toString(qsd?.count || 0, "number"),
    },

    /* psuedo-fields */
    perimeter: {
        default: (qsd) => qsd?.quilt ? StringUtils.toString(qsd.quilt.width * 2 + qsd.quilt.length * 2, "number") : "",
    },
};

const designSourceTypeMagazine = (ds) => {
    return ds.name 
        ? ds.name + ((ds.issueNumber || ds.year) 
            ? " [" + (ds.issueNumber || "") + 
                    (ds.year ? (ds.issueNumber ? ", " : "") + ds.year : "")
                + "]"
            : "")
        :  "Unknown magazine";
}

const designSourceTypeBook = (ds) => {
    return (ds.title || (ds.name || "")) + ((ds.author || ds.year) 
        ? " [" + (ds.author || "") + (ds.year ? ", " + ds.year : "") + "]"
        : "");
}

const designSourceTypeWorkshop = (ds) => {
    return (ds.name || "") + ", " + (ds.author || "");
}

const designSourceTypeOriginal = (ds) => {
    return `Original design`;
}

const designSourceTypeOther = (ds) => {
    return (ds.name || "");
}

const getWallSection = (wall) => {
    let name = wall?.name || "";

    if(name.endsWith("OA")) return "OA";
    if(name.endsWith("OB")) return "OB";
    if(name.endsWith("OC")) return "OC";
    if(name.endsWith("A")) return "A";
    if(name.endsWith("B")) return "B";
    if(name.endsWith("C")) return "C";

    return name;
};