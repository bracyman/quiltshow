import { useState, useContext } from "react";
import { Modal, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { QuiltContext } from "../../contexts/QuiltContext";
import QuiltForm from "./QuiltForm";
import Prompt from "../Prompt";

function QuiltRow(props) {
  const { validateQuilt, updateQuilt, deleteQuilt } = useContext(QuiltContext);
  const [editQuilt, setEditQuilt] = useState({});
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState(false);

  const [showEdit, setShowEdit] = useState(false);

  let quilt = props.quilt;

  const handleEdit = () => {
    setEditQuilt({ ...props.quilt });
    setShowEdit(true);
  };

  const handleQuiltChange = (quilt) => {
    setEditQuilt(quilt);
  };

  const handleSubmitQuiltChanges = (e) => {
    e.preventDefault();

    if (validateQuilt(editQuilt)) {
      updateQuilt(editQuilt);
      handleClose();
    }
  };

  const handleClose = () => {
    setShowEdit(false);
  };

  const handleDelete = (id) => {
    setSelectedDelete(id);
    setShowDeletePrompt(true);
  };

  const deleteSelectedQuilt = () => {
    deleteQuilt(selectedDelete);
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
      <div>{quilt.width}</div>
      <div>{quilt.length}</div>
      <div>{quilt.judged ? "Yes" : "No"}</div>
      <div>
        <ul>
          {quilt.tags.map((t) => (
            <li className="tag">{t.name}</li>
          ))}
        </ul>
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
          <QuiltForm quilt={editQuilt} updateQuilt={handleQuiltChange} />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            type="submit"
            onClick={handleSubmitQuiltChanges}
          >
            Save Changes
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
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
