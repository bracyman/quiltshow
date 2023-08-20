

import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import QuiltService from "../../../services/QuiltService";
import { useQuery } from "react-query";
import StringUtils from "../../../utilities/StringUtils";
import LoadingSpinner from "../../LoadingSpinner";

const PaymentDisplay = (props) => {
    const [showPaymentInfo, setShowPaymentInfo] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    const { data, isLoading, isError, isSuccess } = useQuery(
        "quiltAmountDue",
        QuiltService.getAmountDue
    );

    const payOnline = async () => {
        // show processing indicator
        setPaymentProcessing(true);

        // create payment link
        let paymentUrl = await QuiltService.createPayment();

        // wait for the process to trickle through the payment processor
        await new Promise(r => setTimeout(r, 1500));

        if (paymentUrl) {
            setPaymentProcessing(false);
            setShowPaymentInfo(false);
            window.open(paymentUrl, "blank");
            return;
        }

        else {
            alert("Unexpected error trying to create submission order. Please tell a show coordinator");
        }
    };

    const displayPaymentInfo = () => {
        if (!paymentProcessing) {
            setShowPaymentInfo(true);
        }
    };

    const hidePaymentInfo = () => {
        if (!paymentProcessing) {
            setShowPaymentInfo(false);
        }
    };



    return (
        <>
            <button type="button" onClick={displayPaymentInfo} className="btn btn-success btn btn-primary"><span>Payment Information</span></button>

            <Modal show={showPaymentInfo} onHide={hidePaymentInfo} className="payment-info">
                <Modal.Header closeButton>
                    <Modal.Title>Payment Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {paymentProcessing
                        ? <LoadingSpinner />
                        :
                        <div className="payment-info container">
                            <p>Quilt Submissions can be paid for by check or online. Online payments will include a small processing fee. The quilt submissions are priced at:
                                <div className="address-block">
                                    <span>$5 for each <b>unjudged</b> quilt</span>
                                    <span>$10 for each <b>judged</b> quilt</span>
                                </div>

                            </p>
                            <p>To pay by check, address checks to <b>EIHQ</b> and mail them to
                                <div className="address-block">
                                    <span>Kristie Mattson</span>
                                    <span>2530 Newcastle Rd</span>
                                    <span>Marion, IA 52302</span>
                                </div>
                            </p>
                            <hr />
                            <p>If you wish to pay by credit card, your total payment will be
                                {isLoading
                                    ? <LoadingSpinner />
                                    : isError
                                        ? <p>Error encountered fetching amount due</p>
                                        : <b> {StringUtils.toString(data.totalDue, "currency")}</b>
                                }
                                <br />
                                <button type="button" onClick={payOnline} className="btn btn-success btn btn-primary" disabled={!isSuccess || (data.totalDue <= 0.0)}><span>Pay Online</span></button>
                            </p>
                        </div>
                    }
                </Modal.Body>
            </Modal>
        </>
    );
};

export default PaymentDisplay;

