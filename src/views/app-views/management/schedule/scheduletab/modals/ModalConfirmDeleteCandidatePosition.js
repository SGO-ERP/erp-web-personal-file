import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Col, Modal, Row, Typography, notification } from "antd";
import React, { useEffect, useState } from "react";
import { change } from "store/slices/schedule/archiveStaffDivision";
import {
    embedSubDivisionNode,
    removeStaffUnitNode,
} from "utils/schedule/utils";
import IntlMessage from "../../../../../../components/util-components/IntlMessage";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/useStore";
import { removeLocalStaffUnit, removeRemoteStaffUnit } from "store/slices/schedule/Edit/staffUnit";
import { addRemoteDisposal } from "store/slices/schedule/Edit/disposal";
import { APP_PREFIX_PATH } from "../../../../../../configs/AppConfig";
import { objectToQueryString } from "../../../../../../utils/helpers/common";
import { useNavigate, useSearchParams } from "react-router-dom";

const { Text } = Typography;

const ModalConfirmDeleteCandidatePosition = ({
    modalCase,
    openModal,
    staffUnit,
    staffDivision,
}) => {
    const currentLocale = localStorage.getItem("lan");
    const archiveStaffDivision = useAppSelector((state) => state.archiveStaffDivision.data);
    const dispatch = useAppDispatch();
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
        if (staffDivision?.leader_id === staffUnit.id) {
            notification.warn({
                message:
                    currentLocale === "kk"
                        ? "Департамент бастығын алып тастауға болмайды"
                        : "Нельзя удалять начальника департамента",
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
            if (staffUnit.user === null) {
                dispatch(
                    removeRemoteStaffUnit({
                        id: staffUnit.id,
                    }),
                );
            } else {
                dispatch(addRemoteDisposal(staffUnit));
            }
        }
        const dispositionList = archiveStaffDivision[archiveStaffDivision.length - 1];
        const newDispositionList = {
            ...dispositionList,
            staff_units: [...(dispositionList.staff_units ?? []), staffUnit],
        };
        dispatch(
            change(
                embedSubDivisionNode(
                    removeStaffUnitNode(staffUnit.id, archiveStaffDivision),
                    newDispositionList,
                    null,
                ),
            ),
        );
        modalCase.showModalWarningDeletePosition(false);

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
        modalCase.showModalWarningDeletePosition(false);
    }

    return (
        <div>
            <Modal
                open={openModal}
                onCancel={handleCancel}
                onOk={handleOk}
                okText={<IntlMessage id="yes" />}
                cancelText={<IntlMessage id="no" />}
            >
                <Row justify="center">
                    <Col xs={2} className="gutter-row">
                        <ExclamationCircleOutlined
                            style={{ fontSize: "1.4rem", color: "#FAAD14" }}
                        />
                    </Col>
                    <Col xs={20} className="gutter-row">
                        <Row>
                            <Text strong>
                                <IntlMessage id="staffSchedule.confirmDeleteCandidatePosition" />
                            </Text>
                        </Row>
                        <Row style={{ marginTop: "4px" }}>
                            {currentLocale === "kk" ? (
                                <Text>
                                    “
                                    {staffUnit?.actual_position
                                        ? staffUnit?.actual_position?.nameKZ
                                        : staffUnit?.position?.nameKZ}
                                    ” лауазымы жойылады, Егер сіз қызметкер{" "}
                                    {staffUnit?.user?.last_name + " " + staffUnit?.user?.first_name}{" "}
                                    өзгерістерді сақтамас бұрын басқа позицияға қоймасаңыз, ол{" "}
                                    <b>“билік ету“</b> тізіміне енгізіледі.
                                </Text>
                            ) : (
                                <Text>
                                    Должность “
                                    {staffUnit?.actual_position
                                        ? staffUnit?.actual_position?.name
                                        : staffUnit?.position?.name}
                                    ” будет удален, если вы не поместите сотрудника{" "}
                                    {staffUnit?.user?.last_name + " " + staffUnit?.user?.first_name}{" "}
                                    на другую позицию перед сохранением изменений, он(-а) будет
                                    занесен в списки <b>“В распоряжение”</b>.
                                </Text>
                            )}
                        </Row>
                    </Col>
                </Row>
            </Modal>
        </div>
    );
};

export default ModalConfirmDeleteCandidatePosition;
