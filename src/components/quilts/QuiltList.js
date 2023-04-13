import React from "react";
import { Modal, Button, Badge } from "react-bootstrap";
import { useState } from "react";
import QuiltService from "../../services/QuiltService";
import { useQueryClient, useQuery, useMutation } from "react-query";
import QuiltRow from "./QuiltRow";
import QuiltForm from "./QuiltForm";
import Prompt from "../Prompt";
import PaymentDisplay from "./forms/PaymentDisplay";
import ObjectUtils from "../../utilities/ObjectUtils";
import AuthService from "../../services/AuthService";
import "../../styles/quiltList.css";
import { QuiltFields, Sorters } from "./QuiltFields";
import SubmitExternalPayment from "./forms/SubmitExternalPayment";

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

const QuiltList = (props) => {
  const [showNewQuiltForm, setShowNewQuiltForm] = useState(false);
  const [newQuilt, setNewQuilt] = useState(EMPTY_QUILT);
  const [showEditQuiltForm, setShowEditQuiltForm] = useState(false);
  const [editQuilt, setEditQuilt] = useState(EMPTY_QUILT);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState(false);
  const [quiltsToPay, setQuiltsToPay] = useState([]);
  const [showMarkAsPaid, setShowMarkAsPaid] = useState(false);
  const [sortField, setSortField] = useState(AuthService.userHasRole("admin") ? "enteredBy" : "hangingPreference");
  const [sortDirection, setSortDirection] = useState(1);
  const queryClient = useQueryClient();
  const { data, isLoading, isError, isSuccess } = useQuery(
    "quiltList",
    QuiltService.fetchQuilts
  );
  const quiltMutator = useMutation({
    mutationFn: (mutator, quilt) => {
      if (!mutator.validator || mutator.validator(mutator.params)) {
        return mutator.modifier(mutator.params);
      }
    },
    onSuccess: (data, error, variables, context) => {
      setNewQuilt(EMPTY_QUILT);
      queryClient.invalidateQueries("quiltList");
      queryClient.invalidateQueries("quiltAmountDue");
    },
    onError: (error, variables, context) => {
      console.log(`Error updating quilts ${error}`);
      alert("An error occured while updating the quilt(s)");
    },
  });



  /**********************************************************************/
  /*     New Quilt Entry                                                */
  /**********************************************************************/
  const handleShowNewQuilt = () => setShowNewQuiltForm(true);
  const handleCloseNewQuilt = () => setShowNewQuiltForm(false);

  const handleNewQuiltChange = (propertyName, updatedValue) => {
    if (ObjectUtils.isObject(propertyName)) {
      setNewQuilt({ ...newQuilt, ...propertyName });
    } else {
      setNewQuilt({ ...newQuilt, [propertyName]: updatedValue });
    }
  };

  const handleSubmitNewQuilt = (e) => {
    if (e) {
      e.preventDefault();
    }
    console.log(`Adding new quilt: ${newQuilt}`);

    // check the hanging preference
    if (!newQuilt.hangingPreference) {
      newQuilt.hangingPreference = data.length + 1;
    }

    quiltMutator.mutate({
      modifier: QuiltService.addQuilt,
      validator: QuiltService.validateQuilt,
      params: newQuilt,
    });
    setNewQuilt({});
    handleCloseNewQuilt();
  };


  

  /**********************************************************************/
  /*     Edit Quilt Entry                                               */
  /**********************************************************************/
  const handleEditQuilt = (quilt) => {
    setEditQuilt(quilt);
    setShowEditQuiltForm(true);
  };
  const handleCloseEditQuilt = () => {
    setShowEditQuiltForm(false);
  };

  const handleEditQuiltChange = (propertyName, updatedValue) => {
    setEditQuilt({ ...editQuilt, [propertyName]: updatedValue });
  };

  const handleSubmitEditQuiltChanges = () => {
    quiltMutator.mutate({
      modifier: QuiltService.updateQuilt,
      validator: QuiltService.validateQuilt,
      params: editQuilt,
    });
    setEditQuilt({});
    handleCloseEditQuilt();
  };


  

  /**********************************************************************/
  /*     Delete Quilt                                                   */
  /**********************************************************************/
  const handleDeleteQuilt = (quilt) => {
    setSelectedDelete(quilt);
    setShowDeletePrompt(true);
  };
  const handleCloseDelete = () => {
    setShowDeletePrompt(false);
  };

  const deleteSelectedQuilt = () => {
    quiltMutator.mutate({
      modifier: QuiltService.deleteQuilt,
      params: selectedDelete.id,
    });
    handleCloseDelete();
  };


  

  /**********************************************************************/
  /*     Mark as already Paid                                           */
  /**********************************************************************/
  const submitPayment = (quilt) => {
    let filteredQuilts = (data || [])
      .filter(q => q.enteredBy.email === quilt.enteredBy.email)
      .filter(q => q.paymentData?.status != 'COMPLETED')
      .map(q => { return { id: q.id, name: q.name }; });

    setQuiltsToPay(filteredQuilts);
    setShowMarkAsPaid(true);
  };

  const markAsPaid = (paidQuilts) => {
    quiltMutator.mutate({
      modifier: QuiltService.markQuiltsAsPaid,
      params: paidQuilts.map(q => q.id),
    });

    closeMarkAsPaid();
  };

  const closeMarkAsPaid = () => {
    setQuiltsToPay([]);
    setShowMarkAsPaid(false);
  };



  

  /**********************************************************************/
  /*     Sort by columns                                                */
  /**********************************************************************/
  const changeSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection * -1);
    }
    else {
      setSortField(field);
    }
  };

  const sortQuilts = (quilts) => {
    let sorter = Sorters[sortField];
    if (!sorter) {
      sorter = Sorters.default;
    }

    quilts.sort((a, b) => (sorter(a, b) * sortDirection));
  };



  

  /**********************************************************************/
  /*     Configure list                                                 */
  /**********************************************************************/
  let listClass = "pre-show-user";
  let standardColumns = ["name", "category", "width", "length", "judged", "tags",];
  let adminColumns = ["enteredBy", "name", "category", "hangingPreference", "width", "length", "judged", "Payment"];

  let columns = AuthService.userHasRole("admin") ? adminColumns : standardColumns;

  const rowProperties = {
    columns: columns,
    editHandler: handleEditQuilt,
    deleteHandler: handleDeleteQuilt,
    submitPayment: submitPayment,
    rowClass: listClass,
  };


  

  /**********************************************************************/
  /*     Create Table                                                   */
  /**********************************************************************/
  if (isLoading) {
    return <p>Loading quilts...</p>;
  } else if (isError) {
    return <p>Failed to load quilts</p>;
  } else if (isSuccess) {
    sortQuilts(data);
    return (
      <>
        <div className={`table table-striped table-hover ${listClass}`}>
          <div className="tr operations">
            <Button
              onClick={handleShowNewQuilt}
              className="btn btn-success"
              data-toggle="modal"
            >
              <i className="material-icons">&#xE147;</i>{" "}
              <span>Add New Quilt</span>
            </Button>
            <PaymentDisplay {...props} />
          </div>

          <div className="tr header">
            {columns.map((field) => 
              (QuiltFields[field]) 
                ? (<div className={`td ${field}`} onClick={() => changeSort(field)} key={`header_${field}`}>{QuiltFields[field].label}</div>)
                : (<div className={`td ${field}`} key={`header_${field}`} >{field}</div>)
            )}
            <div className="td edit" key={`header_edit`}>Edit</div>
            <div className="td delete" key={`header_delete`}>Delete</div>
          </div>

          {data && data.length === 0 && <p>No quilts entered yet</p>}
          {data &&
            data.length > 0 &&
            data.map((quilt) => (
              <QuiltRow {...rowProperties} quilt={quilt} key={`quiltRow${quilt.id}`} />
            ))}
        </div>

        <Modal show={showNewQuiltForm} onHide={handleCloseNewQuilt}>
          <Modal.Header closeButton>
            <Modal.Title>Enter New Quilt</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <QuiltForm
              quilt={newQuilt}
              numQuilts={data.length}
              show={props.show}
              updateQuilt={handleNewQuiltChange}
              saveQuilt={handleSubmitNewQuilt}
              validQuilt={QuiltService.validateQuilt}
              cancelQuilt={handleCloseNewQuilt}
            />
          </Modal.Body>
        </Modal>

        <Modal show={showEditQuiltForm} onHide={handleCloseEditQuilt}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Quilt</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <QuiltForm
              quilt={editQuilt}
              numQuilts={data.length}
              show={props.show}
              updateQuilt={handleEditQuiltChange}
              saveQuilt={handleSubmitEditQuiltChanges}
              validQuilt={QuiltService.validateQuilt}
              cancelQuilt={handleCloseEditQuilt}
            />
          </Modal.Body>
        </Modal>

        <Prompt
          show={showDeletePrompt}
          message={`Are you sure you want to delete ${selectedDelete?.name || "this quilt"}?`}
          onYes={deleteSelectedQuilt}
          onNo={handleCloseDelete}
        />

        { showMarkAsPaid
          ? <SubmitExternalPayment show={showMarkAsPaid} quilts={quiltsToPay} markAsPaid={markAsPaid} cancelMarkAsPaid={closeMarkAsPaid} />
          : <></>
        }
      </>
    );
  }
};

export default QuiltList;
