import React from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import { useState, useContext } from "react";
import QuiltService from "../../services/QuiltService";
import { useQuery } from "react-query";
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
  const { data, status } = useQuery("quilts", QuiltService.fetchQuilts());
  const [showNewQuiltForm, setShowNewQuiltForm] = useState(false);
  const [newQuilt, setNewQuilt] = useState(EMPTY_QUILT);

  const handleShowNewQuilt = () => setShowNewQuiltForm(true);
  const handleCloseNewQuilt = () => setShowNewQuiltForm(false);

  const handleNewQuiltChange = (quilt) => {
    setNewQuilt(quilt);
  };

 
  const handleSubmitNewQuilt = (e) => {
    e.preventDefault();

    if (QuiltService.validateQuilt(newQuilt)) {
      console.log(`Adding new quilt: ${newQuilt}`);
      QuiltService.addQuilt(newQuilt);
      setNewQuilt(EMPTY_QUILT);
      handleCloseNewQuilt();
    }
  };

  return (
    <>
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

      <div className="table table-striped table-hover">
        <div className="table-header">Name</div>
        <div className="table-header">Pieced By</div>
        <div className="table-header">Quilted By</div>
        <div className="table-header">Category</div>
        <div className="table-header">Width</div>
        <div className="table-header">Length</div>
        <div className="table-header">Judged</div>
        <div className="table-header">Tags</div>
        <div className="table-header"></div>
        <div className="table-header"></div>

        {status === "error" && <p>Error fetching quilts</p>}
        {status === "loading" && <p>Fetching quilts ...</p>}
        {status === "success" && data && (data.length === 0) && <p>No quilts entered yet</p>}
        {status === "success" && data && (data.length > 0) && 
            data.map((quilt) => (
                <QuiltRow key={quilt.id} quilt={quilt} />
            ))
        }
      </div>
        
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
