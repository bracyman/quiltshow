import { useState, useContext } from "react";
import { Modal, Button, OverlayTrigger, Tooltip, Badge } from "react-bootstrap";
import QuiltService from "../../services/QuiltService";
import QuiltForm from "./QuiltForm";
import Prompt from "../Prompt";

function QuiltRow(props) {
  const [editQuilt, setEditQuilt] = useState({});
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState(false);

  const [showEdit, setShowEdit] = useState(false);

  let quilt = props.quilt;

  const handleEdit = () => {
    setEditQuilt({ ...props.quilt });
    setShowEdit(true);
  };

  const handleQuiltChange = (propertyName, updatedValue) => {    
    setEditQuilt({ ...quilt, [propertyName]: updatedValue });
  };

  const handleSubmitQuiltChanges = (e) => {
    if(e) {
      e.preventDefault();
    }

    props.mutator({modifier: QuiltService.updateQuilt, validator: QuiltService.validateQuilt, params: editQuilt});
    handleClose();
  };

  const handleClose = () => {
    setShowEdit(false);
  };

  const handleDelete = (id) => {
    setSelectedDelete(id);
    setShowDeletePrompt(true);
  };

  const deleteSelectedQuilt = () => {
    props.mutator({modifier: QuiltService.deleteQuilt, params: selectedDelete});
    handleCloseDelete();
  };

  const handleCloseDelete = () => {
    setSelectedDelete(null);
    setShowDeletePrompt(false);
  };

  return (
    <>
      <div>{quilt.name}</div>
      <div>{quilt.piecedBy}</div>
      <div>{quilt.quiltedBy || ""}</div>
      <div>{quilt.category?.name || ""}</div>
      <div>{quilt.length}</div>
      <div>{quilt.width}</div>
      <div>{quilt.judged ? "Yes" : "No"}</div>
      <div>
          {quilt.tags.map((t) => (
            <Badge pill bg="primary">{t.name}</Badge>
          ))}
      </div>
      <div>
        <OverlayTrigger overlay={<Tooltip id={`tooltip-top`}>Edit</Tooltip>}>
          <button
            onClick={handleEdit}
            className="btn text-warning btn-act"
            data-toggle="modal"
          >
            <i className="material-icons">&#xE254;</i>
          </button>
        </OverlayTrigger>
      </div>
      <div>
        <OverlayTrigger overlay={<Tooltip id={`tooltip-top`}>Delete</Tooltip>}>
          <button
            onClick={() => handleDelete(quilt.id)}
            className="btn text-danger btn-act"
            data-toggle="modal"
          >
            <i className="material-icons">&#xE872;</i>
          </button>
        </OverlayTrigger>
      </div>

      <Modal show={showEdit} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Quilt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <QuiltForm quilt={editQuilt} show={props.show} updateQuilt={handleQuiltChange} saveQuilt={handleSubmitQuiltChanges} validQuilt={QuiltService.validateQuilt} cancelQuilt={handleClose} />
        </Modal.Body>
      </Modal>

      <Prompt
        show={showDeletePrompt}
        message={`Are you sure you want to delete this quilt [${selectedDelete}]?`}
        onYes={deleteSelectedQuilt}
        onNo={handleCloseDelete}
      />
    </>
  );
}

export default QuiltRow;
