import React from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import { useState, useContext } from "react";
import { QuiltContext } from "../../contexts/QuiltContext";
import QuiltRow from "./QuiltRow";
import QuiltForm from "./QuiltForm";

const EMPTY_QUILT = {
  id: null,
  name: "",
  description: "",
  tags: [],
  length: null,
  width: null,
  piecedBy: null,
  quiltedBy: null,
};

function QuiltList() {
  const { quilts, addQuilt, validateQuilt, deleteQuilt } =
    useContext(QuiltContext);
  const [showNewQuiltForm, setShowNewQuiltForm] = useState(false);
  const [newQuilt, setNewQuilt] = useState(EMPTY_QUILT);

  const handleShowNewQuilt = () => setShowNewQuiltForm(true);
  const handleCloseNewQuilt = () => setShowNewQuiltForm(false);

  const handleNewQuiltChange = (quilt) => {
    setNewQuilt(quilt);
  };

  const handleSubmitNewQuilt = (e) => {
    e.preventDefault();

    if (validateQuilt(newQuilt)) {
      console.log(`Adding new quilt: ${newQuilt}`);
      addQuilt(newQuilt);
      setNewQuilt(EMPTY_QUILT);
      handleCloseNewQuilt();
    }
  };

  return (
    <>
      <div className="table-title">
        <div className="row">
          <div className="col-sm-6">
            <h2>Quilts</h2>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <Button
            onClick={handleShowNewQuilt}
            className="btn btn-success"
            data-toggle="modal"
          >
            <i className="material-icons">&#xE147;</i>{" "}
            <span>Add New Quilt</span>
          </Button>
        </div>
      </div>

      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Pieced By</th>
            <th>Quilted By</th>
            <th>Width</th>
            <th>Length</th>
          </tr>
        </thead>
        <tbody>
          {quilts &&
            quilts.map((quilt) => (
              <tr key={quilt.id}>
                <QuiltRow quilt={quilt} />
              </tr>
            ))}
        </tbody>
      </table>

      <Modal show={showNewQuiltForm} onHide={handleCloseNewQuilt}>
        <Modal.Header closeButton>
          <Modal.Title>Enter New Quilt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <QuiltForm quilt={newQuilt} updateQuilt={handleNewQuiltChange} />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            type="submit"
            onClick={handleSubmitNewQuilt}
          >
            Enter Quilt
          </Button>
          <Button variant="secondary" onClick={handleCloseNewQuilt}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default QuiltList;
