
const SubmitPaymentCell = (props) => {

    if(!props || !props.quilt) {
        return (<></>);
    }

    if(props.quilt.paymentData?.status === "COMPLETED" ) {
        return (<div>Paid</div>);
    }

    return (<div className="mark-as-paid" onClick={() => props.submitPayment(props.quilt)} key={`SubmitPaymentCell_${props.quilt.id}`}>Mark as Paid</div>)
};

export default SubmitPaymentCell;