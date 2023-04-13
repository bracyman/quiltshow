import React from "react";
import { OverlayTrigger, Tooltip, } from "react-bootstrap";
import { Renderers } from "./QuiltFields";
import SubmitPaymentCell from "./forms/SubmitPaymentCell";

function QuiltRow(props) {

  const { columns, quilt, rowClass, editHandler, deleteHandler, submitPayment } = props;

  const render = (field) => {
    if(field === "Payment") {
      return (<SubmitPaymentCell quilt={quilt} submitPayment={submitPayment} />);
    }

    let renderers = Renderers[field];
    let renderer = Renderers.default;
    if (renderer) {
      renderer = renderers.list || renderers.default;
    }

    return renderer(quilt[field]);
  };

  let keyRoot = `quilt${quilt.id}`;

  return (
    <div className="tr" key={keyRoot}>
      {columns.map(field =>
        <div className={`td ${field}  ${rowClass || ''}`} key={`${keyRoot}_${field}`}>{render(field)}</div>
      )}
      {editHandler ? (
        <div className={`td edit`} key={`${keyRoot}_edit`}>
          <OverlayTrigger overlay={<Tooltip id={`tooltip-top`}>Edit</Tooltip>}>
            <button
              onClick={() => editHandler(quilt)}
              className="btn text-warning btn-act"
              data-toggle="modal"
            >
              <i className="material-icons">&#xE254;</i>
            </button>
          </OverlayTrigger>
        </div>
      ) : (<></>)}
      {deleteHandler ? (
        <div className={`td delete`} key={`${keyRoot}_delete`}>
          <OverlayTrigger overlay={<Tooltip id={`tooltip-top`}>Delete</Tooltip>}>
            <button
              onClick={() => deleteHandler(quilt)}
              className="btn text-danger btn-act"
              data-toggle="modal"
            >
              <i className="material-icons">&#xE872;</i>
            </button>
          </OverlayTrigger>
        </div>
      ) : (<></>)}
    </div>
  );
}

export default QuiltRow;
