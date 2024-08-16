import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Col, Modal, Row, Typography, notification } from "antd";
import React, { useEffect, useState } from "react";
import { change } from "store/slices/schedule/archiveStaffDivision";
import { removeStaffUnitNode } from "utils/schedule/utils";
import IntlMessage from "../../../../../../components/util-components/IntlMessage";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/useStore";
import { removeLocalStaffUnit, removeRemoteStaffUnit } from "store/slices/schedule/Edit/staffUnit";
import { APP_PREFIX_PATH } from "../../../../../../configs/AppConfig";
import { objectToQueryString } from "../../../../../../utils/helpers/common";
import { useNavigate, useSearchParams } from "react-router-dom";

const { Text } = Typography;

const ModalConfirmDeletePosition = ({ modalCase, openModal, staffUnit, staffDivision }) => {
    const currentLocale = localStorage.getItem("lan");
    const dispatch = useAppDispatch();

    const archiveStaffDivision = useAppSelector((state) => state.archiveStaffDivision.data);

    const [searchParams] = useSearchParams();
    const staffListId = searchParams.get("staffListId");

    const mode = searchParams.get("mode");
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (mode === "edit") {
            setIsEdit(true);
        }
    }, [mode, searchParams]);

    const navigate = useNavigate();

    const handleOk = () => {
        if (staffDivision?.leader_id === staffUnit?.id) {
            notification.warning({
                message: <IntlMessage id="notification.schedule.leader" />,
            });
            return;
        }
        if (Object.prototype.hasOwnProperty.call(staffUnit, "isLocal")) {
            dispatch(
                removeLocalStaffUnit({
                    id: staffUnit.id,
                }),
            );
        } else {
            dispatch(
                removeRemoteStaffUnit({
                    id: staffUnit.id,
                }),
            );
        }
        dispatch(change(removeStaffUnitNode(staffUnit.id, archiveStaffDivision)));
        modalCase.showModalWarningDelPosWithoutUser(false);

        const queryParams = {
            ...(isEdit && {
                "mode": mode,
            }),
            "type": "staffDivision",
            "staffDivision": staffDivision.id,
            "staffListId": staffListId,
        };
        navigate(
            `${APP_PREFIX_PATH}/management/schedule/${
                isEdit ? "edit/" : "history/"
            }?${objectToQueryString(queryParams)}`,
        );
    };

    function handleCancel() {
        modalCase.showModalWarningDelPosWithoutUser(false);
    }

    return (
        <Modal
            open={openModal}
            onCancel={handleCancel}
            onOk={handleOk}
            okText={<IntlMessage id="yes" />}
            cancelText={<IntlMessage id="no" />}
        >
            <Row justify="center">
                <Col xs={2} className="gutter-row">
                    <ExclamationCircleOutlined style={{ fontSize: "1.4rem", color: "#FAAD14" }} />
                </Col>
                <Col xs={20} className="gutter-row">
                    <Row>
                        <Text strong>
                            <IntlMessage id="staffSchedule.confirmDeletePosition" />
                        </Text>
                    </Row>
                    <Row style={{ marginTop: "4px" }}>
                        {currentLocale === "kk" ? (
                            <Text>
                                “
                                {staffUnit?.actual_position
                                    ? staffUnit?.actual_position?.nameKZ
                                    : staffUnit?.position?.nameKZ}
                                “ лауазымы алынып тасталады.
                            </Text>
                        ) : (
                            <Text>
                                Должность “
                                {staffUnit?.actual_position
                                    ? staffUnit?.actual_position?.name
                                    : staffUnit?.position?.name}
                                ” будет удален.
                            </Text>
                        )}
                    </Row>
                </Col>
            </Row>
        </Modal>
    );
};

export default ModalConfirmDeletePosition;
