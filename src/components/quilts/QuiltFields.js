
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
        report: (val) => StringUtils.trimAfterLength(val, 30),
        long: (val) => val,
    },
    category: {
        default: (val) => val.name,
        long: (val) => `${val.name} - ${val.description}`,
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

    default: (val) => val ? val : '',
};


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
    groupSize: (a, b) => numericSort(a?.groupSize, b?.groupSize),
    mainColor: (a, b) => alphaSort(a?.name, b?.name),
    designSource: (field) => (a, b) => alphaSort(a?.designSource[field || "name"], b?.designSource[field || "name"]),
    enteredBy: (a, b) => alphaSort(a?.enteredBy?.lastName, b?.enteredBy?.lastName),
    hangingPreference: (a, b) => numericSort(a?.hangingPreference, b?.hangingPreference),
    additionalQuilters: (a, b) => alphaSort(a?.additionalQuilters, b?.additionalQuilters),
    submittedOn: (a, b) => dateSort(a?.submittedOn, b?.submittedOn),
    awards: (a, b) => listSort(a, b, "name", alphaSort),
    hangingLocation: (a, b) => alphaSort(a?.hangingLocation, b?.hangingLocation),
    count: (a, b) => numericSort(a?.count, b?.count),
    default: (a, b) => alphaSort(a, b),
};

