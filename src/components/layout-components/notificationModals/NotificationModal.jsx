import { Button, Col, Modal, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import UnsignedTable from "../../../views/app-views/management/letters/tables/UnsignedTable";
import HrDocumentService from "services/HrDocumentsService";
import IntlMessage from "components/util-components/IntlMessage";
import { useDispatch, useSelector } from "react-redux";
import { postHrDocumentByIdAndEcp } from "store/slices/lettersOrdersSlice/lettersOrdersSlice";
import { SecondCardPysma } from "../../../views/app-views/management/letters/cards/SecondCardPysma";
import "./style.css";
import {
    notShowHideSecondCard,
    notShowHideThirdCard,
} from "store/slices/tableControllerSlice/tableControllerSlice";
import NotificationService from "services/NotificationService";
import SignEcp from "../../shared-components/SignEcp";

const NotificationModal = ({ setSigned }) => {
    const [selectedIds, setSelectedIds] = useState([]);
    const [document, setDocument] = useState([]);
    const [isNotification, setIsNotification] = useState(false);
    const [spin, setSpin] = useState(false);
    const [comment, setComment] = useState("");
    const [isEcpOpen, setIsEcpOpen] = useState(false);

    const openSteps = useSelector((state) => state.tableController.showHideSecondCard);

    const { orderId } = useSelector((state) => state.notification);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!orderId) return;

        fetchDocuments();
        setIsNotification(true);
    }, [orderId]);

    const fetchDocuments = async () => {
        const docInfo = await HrDocumentService.getDocumentById(orderId);

        setDocument([docInfo]);
    };

    const handleCancel = () => {
        dispatch(notShowHideThirdCard());
        dispatch(notShowHideSecondCard());
        setIsEcpOpen(false);
        setIsNotification(false);
        setSigned("back");
        setDocument([]);
    };

    const sign = async () => {
        dispatch(
            postHrDocumentByIdAndEcp({
                hrDocuments: [{ id: orderId, is_signed: true, comment: comment }],
                page: 1,
                pageSize: 5,
            }),
        );
        setSpin(true);

        try {
            const notification = await NotificationService.get_notifications_details({
                skip: 0,
                limit: 10,
            });

            if (notification.total > 0) {
                handleCancel();
                console.log("not empty");
            } else {
                setIsNotification(false);
                setSigned("close");
                console.log("empty");
            }
            setSpin(false);
            setIsEcpOpen(false);
        } catch (error) {
            console.log("notification error", error);

            setSpin(false);
            setIsEcpOpen(false);
        }
    };

    return (
        <Modal
            open={orderId !== null}
            width={openSteps ? "100%" : "70%"}
            footer={null}
            closable={false}
            className={openSteps && "notification-modal"}
        >
            <SignEcp callback={sign} open={isEcpOpen} onClose={() => setIsEcpOpen(false)} />
            <Spin spinning={document.length === 0 || spin}>
                <Row align="top" justify="center" gutter={40}>
                    <Col xs={openSteps ? 12 : 24}>
                        <Row
                            style={
                                openSteps && {
                                    backgroundColor: "white",
                                    borderRadius: "10px 10px 0 0",
                                    height: 80,
                                    padding: "0 20px",
                                    width: openSteps ? "100%" : "80%",
                                }
                            }
                            align="middle"
                            justify="space-between"
                        >
                            <h4>{document[0]?.document_template.name}</h4>
                            <Col>
                                <Button style={{ marginRight: 10 }} onClick={handleCancel}>
                                    <IntlMessage id="initiate.back" />
                                </Button>
                                <Button type="primary" onClick={() => setIsEcpOpen(true)}>
                                    <IntlMessage id="letters.sign" />
                                </Button>
                            </Col>
                        </Row>
                        <Row
                            style={{
                                backgroundColor: "white",
                                borderRadius: " 0 0 10px 10px",
                                height: "220px",
                            }}
                            justify={"center"}
                        >
                            <div style={{ marginBottom: openSteps ? 5 : 0 }}>
                                <UnsignedTable
                                    selectedIds={selectedIds}
                                    setSelectedIds={setSelectedIds}
                                    hrDocumentsNotSigned={document}
                                    filteredUsers={document}
                                    isNotification={true}
                                    setComment={setComment}
                                />
                            </div>
                        </Row>
                    </Col>
                    {openSteps ? (
                        <Col xs={9}>
                            <SecondCardPysma isModal={true} />
                        </Col>
                    ) : null}
                </Row>
            </Spin>
        </Modal>
    );
};

export default NotificationModal;
