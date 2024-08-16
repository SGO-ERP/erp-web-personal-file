import { components } from "API/types";
import { Form, Modal, notification } from "antd";
import React, { useEffect, useState } from "react";
import { change } from "store/slices/schedule/archiveStaffDivision";
import {
    embedStaffUnitNode,
    embedSubDivisionNode,
    findSubDivisionNode,
} from "utils/schedule/utils";
import IntlMessage from "../../../../../../components/util-components/IntlMessage";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/useStore";
import {
    addRemoteStaffUnit,
    editLocalStaffUnit,
    editRemoteStaffUnit,
} from "store/slices/schedule/Edit/staffUnit";
import {
    addRemoteStaffDivision,
    editLocalStaffDivision,
    editRemoteStaffDivision,
} from "store/slices/schedule/Edit/staffDivision";
import EditPosition from "./EditPosition";

interface Props {
    onClose: () => void;
    isOpen: boolean;
    staffUnit: components["schemas"]["ArchiveStaffUnitRead"] & { curator_of_id: string };
    staffDivision: components["schemas"]["ArchiveStaffDivisionRead"];
}

const ModalEditPosition = ({ isOpen, onClose, staffUnit, staffDivision }: Props) => {
    const dispatch = useAppDispatch();
    const archiveStaffDivision = useAppSelector((state) => state.archiveStaffDivision.data);
    const REMOTE_archiveStaffDivision = useAppSelector(
        (state) => state.editArchiveStaffDivision.remote,
    );
    const [form] = Form.useForm();
    const [isLeader, setIsLeader] = useState(staffDivision?.leader_id === staffUnit?.id);
    const [position, setPosition] = useState<components["schemas"]["PositionRead"] | undefined>(
        staffUnit.position,
    );
    const [curator, setCurator] = useState<string>(staffUnit.curator_of_id);

    const currentPosition = staffUnit.actual_position
        ? staffUnit.actual_position
        : staffUnit.position;

    useEffect(() => {
        setPosition(currentPosition);
        setIsLeader(staffDivision?.leader_id === staffUnit?.id);
        setCurator(staffUnit.curator_of_id);
    }, [staffUnit, staffDivision]);

    const REMOTE_archiveStaffUnit = useAppSelector((state) => state.editArchiveStaffUnit.remote);

    const handleOk = async () => {
        if (!position) {
            return notification.warn({ message: "Выберите должность" });
        }
        if (
            !currentPosition ||
            !staffUnit.id ||
            !position.id ||
            !staffUnit.staff_division_id ||
            !staffDivision.id
        ) {
            notification.warn({ message: "Невозможно отредактировать" });
            return;
        }
        const foundStaffDivision = findSubDivisionNode(
            archiveStaffDivision,
            staffUnit.staff_division_id,
        );
        const curator_id = {
            ...(curator !== ""
                ? {
                      curator_of_id: curator,
                  }
                : {
                      curator_of_id: null,
                  }),
        };
        if (currentPosition?.id) {
            if (Object.prototype.hasOwnProperty.call(staffUnit, "isLocal")) {
                dispatch(
                    editLocalStaffUnit({
                        ...staffUnit,
                        ...curator_id,
                        id: staffUnit.id,
                        isLocal: true,
                        position_id: position.id,
                        position: position,
                        staff_division_id: staffUnit.staff_division_id,
                    }),
                );

                if (foundStaffDivision)
                    dispatch(
                        change(
                            embedStaffUnitNode(
                                {
                                    ...staffUnit,
                                    ...curator_id,
                                    isLocal: true,
                                    position_id: position.id,
                                    position: position,
                                },
                                foundStaffDivision,
                                archiveStaffDivision,
                            ),
                        ),
                    );
            } else {
                const isExists = REMOTE_archiveStaffUnit.find(
                    (_staffUnit) => staffUnit.id === _staffUnit?.id,
                );
                if (isExists) {
                    dispatch(
                        editRemoteStaffUnit({
                            ...staffUnit,
                            ...curator_id,
                            id: staffUnit.id,
                            position_id: position.id,
                            position: position,
                            staff_division_id: staffUnit.staff_division_id,
                        }),
                    );
                } else {
                    dispatch(
                        addRemoteStaffUnit({
                            ...staffUnit,
                            ...curator_id,
                            staff_functions: staffUnit.staff_functions,
                            id: staffUnit.id,
                            position_id: position.id,
                            position: position,
                            staff_division_id: staffUnit.staff_division_id,
                        }),
                    );
                }

                dispatch(
                    change(
                        embedStaffUnitNode(
                            {
                                ...staffUnit,
                                ...curator_id,
                                position_id: position.id,
                                position: position,
                            },
                            staffUnit.staff_division_id,
                            archiveStaffDivision,
                        ),
                    ),
                );
            }
        }
        if (isLeader && staffDivision?.leader_id !== staffUnit?.id) {
            dispatch(
                change(
                    embedSubDivisionNode(
                        archiveStaffDivision,
                        {
                            ...staffDivision,
                            leader_id: staffUnit.id,
                        },
                        staffDivision.parent_group_id,
                    ),
                ),
            );
            dispatch(
                change(
                    embedStaffUnitNode(
                        {
                            ...staffUnit,
                            ...curator_id,
                            position_id: position.id,
                            position: position,
                        },
                        staffUnit.staff_division_id,
                        archiveStaffDivision,
                    ),
                ),
            );
            if (Object.prototype.hasOwnProperty.call(staffDivision, "isLocal")) {
                dispatch(
                    editLocalStaffDivision({
                        ...staffDivision,
                        isLocal: true,
                        id: staffDivision.id,
                        leader_id: staffUnit.id,
                    }),
                );
            } else {
                const foundStaffDivision = REMOTE_archiveStaffDivision.find(
                    (item) => item.id === staffDivision.id,
                );
                if (foundStaffDivision)
                    dispatch(
                        editRemoteStaffDivision({
                            ...staffDivision,
                            id: staffDivision.id,
                            leader_id: staffUnit.id,
                        }),
                    );
                else
                    dispatch(
                        addRemoteStaffDivision({
                            ...staffDivision,
                            id: staffDivision.id,
                            leader_id: staffUnit.id,
                        }),
                    );
            }
        } else if (staffDivision?.leader_id === staffUnit?.id && !isLeader) {
            dispatch(
                change(
                    embedSubDivisionNode(
                        archiveStaffDivision,
                        {
                            ...staffDivision,
                            leader_id: null,
                        },
                        staffDivision.parent_group_id,
                    ),
                ),
            );
            dispatch(
                change(
                    embedStaffUnitNode(
                        {
                            ...staffUnit,
                            ...curator_id,
                            position_id: position.id,
                            position: position,
                        },
                        staffUnit.staff_division_id,
                        archiveStaffDivision,
                    ),
                ),
            );
            if (Object.prototype.hasOwnProperty.call(staffDivision, "isLocal")) {
                dispatch(
                    editLocalStaffDivision({
                        ...staffDivision,
                        isLocal: true,
                        id: staffDivision.id,
                        leader_id: null,
                    }),
                );
            } else {
                const foundStaffDivision = REMOTE_archiveStaffDivision.find(
                    (item) => item.id === staffDivision.id,
                );
                if (foundStaffDivision)
                    dispatch(
                        editRemoteStaffDivision({
                            ...staffDivision,
                            id: staffDivision.id,
                            leader_id: null,
                        }),
                    );
                else
                    dispatch(
                        addRemoteStaffDivision({
                            ...staffDivision,
                            id: staffDivision.id,
                            leader_id: null,
                        }),
                    );
            }
        }

        onClose();
    };

    return (
        <Modal
            title={<IntlMessage id={"edit.curator"} />}
            open={isOpen}
            onCancel={onClose}
            onOk={handleOk}
            okText={<IntlMessage id="staffSchedule.history.save" />}
            cancelText={<IntlMessage id="staffSchedule.cancel" />}
        >
            <EditPosition
                position={position}
                setIsLeader={setIsLeader}
                form={form}
                setPosition={setPosition}
                staffDivision={staffDivision}
                isCurator={curator}
                isOpen={isOpen}
                setCurator={setCurator}
            />
        </Modal>
    );
};
export default ModalEditPosition;
