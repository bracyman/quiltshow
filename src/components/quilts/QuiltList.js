import React from "react";
import { Modal, Button, Badge } from "react-bootstrap";
import { useState, useContext } from "react";
import QuiltService from "../../services/QuiltService";
import { useQueryClient, useQuery, useMutation } from "react-query";
import BasicRow from "../BasicRow";
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



const QuiltList = (props) =>  {
  const [showNewQuiltForm, setShowNewQuiltForm] = useState(false);
  const [newQuilt, setNewQuilt] = useState(EMPTY_QUILT);
  const queryClient = useQueryClient();
  const {data, isLoading, isError, isSuccess} = useQuery("quilts", QuiltService.fetchQuilts);
  const mutation = useMutation({
    mutationFn: (mutator) => {
      if (!mutator.validator || mutator.validator(mutator.params)) {
        return mutator.modifier(mutator.params);
      }
    },
    onSuccess: (data, error, variables, context) => {
      setNewQuilt(EMPTY_QUILT);
      return queryClient.invalidateQueries({ queryKey: ['quilts'] });
    }
  });

  const handleShowNewQuilt = () => setShowNewQuiltForm(true);
  const handleCloseNewQuilt = () => setShowNewQuiltForm(false);

  const handleNewQuiltChange = (propertyName, updatedValue) => { 
    setNewQuilt({ ...newQuilt, [propertyName]: updatedValue });
  };

  const handleEditQuilt = (quilt) => {
    alert(`Editing quilt ${quilt.id}`);
  };

  const handleDeleteQuilt = (quilt) => {
    alert(`Deleting quilt ${quilt.id}`);
  };
 
  const handleSubmitNewQuilt = (e) => {
    if(e) {
      e.preventDefault();
    }
    console.log(`Adding new quilt: ${newQuilt}`);
    mutation.mutate({modifier: QuiltService.addQuilt, validator: QuiltService.validateQuilt, params: newQuilt});
    setNewQuilt({});
    handleCloseNewQuilt();
  };


  const converters = {
    category: (val) => val.name,
    tags: (val) => val.map((t) => (
      <Badge pill bg="primary">{t.name}</Badge>
    ))
  };

  let listClass = "pre-show-user";
  let columns = [
      {field: "name", name: "Name"}, 
      {field: "category", name: "Category", displayFunction: converters.category}, 
      {field: "width", name: "Width"}, 
      {field: "length", name: "Height"}, 
      {field: "judged", name: "Judged"}, 
      {field: "tags", name: "Tags", displayFunction: converters.tags}];

  const rowProperties = { 
     columns: columns,
     name: "quilt", 
     editHandler: handleEditQuilt,  
     deleteHandler: handleDeleteQuilt, 
     rowClass: listClass
  };


  if(isLoading) {
    return (<p>Loading quilts...</p>);
  }
  else if(isError) {
    return (<p>Failed to load quilts</p>);
  }
  else if(isSuccess) {
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

        <div className={`table table-striped table-hover ${listClass}`}>
          <div class="tr header">
            {columns.map(col => (
              <div className={`td ${col.field}`}>{col.name}</div>
            ))}
            <div className="td edit">Edit</div>
            <div className="td delete">Delete</div>
          </div>

          {data && (data.length === 0) && <p>No quilts entered yet</p>}
          {data && (data.length > 0) && 
              data.map((quilt) => (
                  <BasicRow {...rowProperties} key={quilt.id} data={quilt} />
              ))
          }
        </div>
          
        <Modal show={showNewQuiltForm} onHide={handleCloseNewQuilt}>
          <Modal.Header closeButton>
            <Modal.Title>Enter New Quilt</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <QuiltForm quilt={newQuilt} show={props.show} updateQuilt={handleNewQuiltChange} saveQuilt={handleSubmitNewQuilt} validQuilt={QuiltService.validateQuilt} cancelQuilt={handleCloseNewQuilt}/>
          </Modal.Body>       
        </Modal>
      </>
    );
  }
}

export default QuiltList;
