import { EditTwoTone, DeleteTwoTone, ExclamationCircleOutlined } from "@ant-design/icons";
import { PrivateServices } from "API";
import {
    Row,
    Col,
    Divider,
    Checkbox,
    notification,
    Typography,
    Tooltip,
    Avatar,
    Modal,
} from "antd";
import AvatarStatus from "components/shared-components/AvatarStatus";
import IntlMessage from "components/util-components/IntlMessage";
import LocalizationText, {
    LocalText,
} from "components/util-components/LocalizationText/LocalizationText";
import { APP_PREFIX_PATH } from "configs/AppConfig";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ServicesService from "services/myInfo/ServicesService";
import {
    editLocalVacancy,
    addLocalVacancy,
    removeLocalVacancy,
} from "store/slices/schedule/Edit/vacancy";
import { addRemoteVacancy, editRemoteVacancy } from "store/slices/schedule/Edit/vacancy";
import { change } from "store/slices/schedule/archiveStaffDivision";
import { concatBySpace } from "utils/format/format";
import uuidv4 from "utils/helpers/uuid";
import { embedStaffUnitNode, formatYears, sumYears } from "utils/schedule/utils";
import ModalConfirmDeleteCandidatePosition from "../../modals/ModalConfirmDeleteCandidatePosition";
import ModalConfirmDeletePosition from "../../modals/ModalConfirmDeletePosition";
import ModalConfirmRemoveCandidatePosition from "../../modals/ModalConfirmRemoveCandidatePosition";
import ModalEditPosition from "../../modals/ModalEditPosition";
import ModalQualReq from "../../modals/ModalQualReq";
import { components } from "API/types";
import {log} from "util";
const { Text } = Typography;

interface Props {
    staffDivision: components["schemas"]["ArchiveStaffDivisionRead"];
    staffUnit: components["schemas"]["ArchiveStaffUnitRead"] & { curator_of_id: string };
}

export const FirstCol = ({ staffDivision, staffUnit }: Props) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const archiveStaffDivision = useAppSelector((state) => state.archiveStaffDivision.data);

    const [emergencyContract, setEmergencyContract] = useState([]);
    const [isModalWarningDeletePosition, setIsModalWarningDeletePosition] = useState(false);
    const [warningDelPosWithoutUser, setWarningDelPosWithoutUser] = useState(false);
    const [warningDelUser, setWarningDelUser] = useState(false);

    const [visible, setVisible] = useState(false);
    const [editPosition, setEditPosition] = useState(false);

    const [divisionParents, setDivisionParents] = useState<
        components["schemas"]["ArchiveStaffDivisionRead"][]
    >([]);

    const LOCAL_archiveVacancy = useAppSelector((state) => state.editArchiveVacancy.local);
    const REMOTE_archiveVacancy = useAppSelector((state) => state.editArchiveVacancy.remote);

    const showModalWarningDeletePosition = (bool: boolean) => {
        setIsModalWarningDeletePosition(bool);
    };

    const showModalWarningDelPosWithoutUser = (bool: boolean) => {
        setWarningDelPosWithoutUser(bool);
    };

    const showModalWarningDelUser = (bool: boolean) => {
        setWarningDelUser(bool);
    };

    function getDivisionParents(
        division: components["schemas"]["ArchiveStaffDivisionRead"],
        data: components["schemas"]["ArchiveStaffDivisionRead"][],
    ) {
        const updatedParents = [
            ...data,
            {
                id: division.id,
                name: division.name,
                nameKZ: division.nameKZ,
                staff_list_id: division.staff_list_id,
                type: division.type,
                staff_division_number: division.staff_division_number,
            },
        ];
        if (division.children && division.children?.length > 0) {
            getDivisionParents(division.children[0] as components["schemas"]["ArchiveStaffDivisionRead"], updatedParents);
        } else {
            setDivisionParents(updatedParents);
        }
    }

    useEffect(() => {
        if (!Object.prototype.hasOwnProperty.call(staffUnit, "isLocal")) {
            const seeLastChildren = async () => {
                if (staffUnit?.user !== null && staffUnit?.staff_division_id) {
                    PrivateServices.get("/api/v1/archive_staff_division/division_parents/{id}/", {
                        params: {
                            path: {
                                id: staffUnit?.staff_division_id,
                            },
                        },
                    }).then((response) => {
                        response.data && getDivisionParents(response.data, []);
                    });
                }
            };
            seeLastChildren();
        }
        if (Object.prototype.hasOwnProperty.call(staffUnit, "user")) {
            const allowance = () => {
                if (
                    staffUnit?.user &&
                    staffUnit.user?.id
                ) {
                    ServicesService.get_services(staffUnit?.user?.id).then((r) => {
                        console.log('response edit: ', r)
                        console.log('current user id: ', staffUnit?.user?.id)
                        setEmergencyContract(r?.emergency_contracts);
                    });
                }
            };
            allowance();
        }
    }, [staffUnit]);

    const divisions = () => {
        return (
            <Row>
                {divisionParents?.map((division) => (
                    <Col
                        key={division.id}
                        xs={24}
                        style={{ color: "#366EF6", display: "flex", justifyContent: "flex-end" }}
                    >
                        {!division.type ? (
                            <LocalizationText text={division} />
                        ) : (
                            division?.staff_division_number +
                            " " +
                            LocalText.getName(division?.type)
                        )}
                    </Col>
                ))}
            </Row>
        );
    };

    const clickCheckbox = (
        vacancy: components["schemas"]["schemas__hr_vacancy__HrVacancyRead"],
        value: boolean,
    ) => {
        // Изменила vacancy.archive_staff_unit_id на vacancy.staff_unit_id
        if (!staffUnit.staff_division_id || !vacancy.id) {
            notification.warning({
                message: <IntlMessage id="schedule.error.edit" />,
            });
            return;
        }

        const changedVacancy = {
            ...vacancy,
            is_active: !vacancy?.is_active ?? false,
        };
        if (Object.prototype.hasOwnProperty.call(vacancy, "isLocal")) {
            const isLocalFound = LOCAL_archiveVacancy.find((item) => item.id === vacancy);

            if (isLocalFound && vacancy.staff_unit_id)
                dispatch(
                    editLocalVacancy({
                        ...changedVacancy,
                        id: vacancy.id,
                        staff_unit_id: vacancy.staff_unit_id,
                        isLocal: true,
                        isStaffUnitLocal: false,
                    }),
                );
        } else {
            const isExists = REMOTE_archiveVacancy.find(
                (item) => item.archive_staff_unit_id === staffUnit.id,
            );

            if (!isExists)
                dispatch(
                    addRemoteVacancy({
                        ...changedVacancy,
                        id: vacancy.id,
                        archive_staff_unit_id: vacancy.archive_staff_unit_id,
                        // WARNING: Проверить на аномалии
                        staff_unit_id: vacancy.staff_unit_id as string,
                    }),
                );
            else
                dispatch(
                    editRemoteVacancy({
                        ...changedVacancy,
                        id: vacancy.id,
                        archive_staff_unit_id: vacancy.archive_staff_unit_id,
                        staff_unit_id: vacancy.staff_unit_id,
                    }),
                );
        }

        dispatch(
            change(
                embedStaffUnitNode(
                    {
                        ...staffUnit,
                        hr_vacancy: [changedVacancy],
                    },
                    staffUnit.staff_division_id,
                    archiveStaffDivision,
                ),
            ),
        );

        if (value == true) {
            notification.success({
                message: <IntlMessage id={"schedule.after.vacancy.save"} />,
            });
        }
    };

    const createVac = (value: boolean) => {
        if (value) {
            if (!staffUnit.id) {
                notification.error({
                    message: <IntlMessage id="schedule.vacancy.error.try.later" />,
                });
                return;
            }
            const isStaffUnitLocal = Object.prototype.hasOwnProperty.call(staffUnit, "isLocal");

            dispatch(
                addLocalVacancy({
                    isLocal: true,
                    isStaffUnitLocal,
                    id: uuidv4(),
                    staff_unit_id: staffUnit.id,
                    is_active: true,
                }),
            );
            notification.success({
                message: <IntlMessage id={"schedule.after.vacancy.save"} />,
            });
        } else if (!value) {
            const found = LOCAL_archiveVacancy.find((item) => item.staff_unit_id === staffUnit.id);
            if (found) {
                dispatch(
                    removeLocalVacancy({
                        id: found.id,
                    }),
                );
            }
        }
        const changedVacancy = {
            id: uuidv4(),
            archive_staff_unit_id: staffUnit.id,
            is_active: value,
            staff_division_id: staffUnit.staff_division_id,
        };
        if (staffUnit.staff_division_id !== undefined)
            dispatch(
                change(
                    embedStaffUnitNode(
                        {
                            ...staffUnit,
                            hr_vacancy: [changedVacancy],
                        },
                        staffUnit.staff_division_id,
                        archiveStaffDivision,
                    ),
                ),
            );
    };

    const showConfirmToNavigatePersonalData = (id: string) => {
        const currentLocale = localStorage.getItem("lan");

        Modal.confirm({
            title:
                currentLocale === "kk"
                    ? "Сіз  жеке кабинетке барғыңыз келе ме?"
                    : "Вы точно хотите перейти в личный кабинет?",
            icon: <ExclamationCircleOutlined style={{ fontSize: "1.4rem", color: "#FAAD14" }} />,
            content:
                currentLocale === "kk"
                    ? "Енгізілген өзгерістер сақталмайды"
                    : "Внесённые изменения не сохранятся",
            okText: currentLocale === "kk" ? "Ия" : "Да",
            cancelText: currentLocale === "kk" ? "Жоқ" : "Нет",
            onOk: () => {
                navigate(`${APP_PREFIX_PATH}/duty/data/${id}`);
            },
        });
    };

    const position: any = staffUnit?.position !== null
        ?
        staffUnit.position
        :
        staffUnit?.position===null && staffUnit?.actual_position!==null
        &&
        staffUnit.actual_position;

    return (
        <>
            <>
                <ModalQualReq
                    isOpen={visible}
                    onClose={() => setVisible(false)}
                    staffUnit={staffUnit}
                />
                <ModalConfirmDeleteCandidatePosition
                    openModal={isModalWarningDeletePosition}
                    modalCase={{ showModalWarningDeletePosition }}
                    staffUnit={staffUnit}
                    staffDivision={staffDivision}
                />
                <ModalConfirmDeletePosition
                    openModal={warningDelPosWithoutUser}
                    modalCase={{ showModalWarningDelPosWithoutUser }}
                    staffUnit={staffUnit}
                    staffDivision={staffDivision}
                />
                <ModalConfirmRemoveCandidatePosition
                    openModal={warningDelUser}
                    modalCase={{ showModalWarningDelUser }}
                    staffUnit={staffUnit}
                    staffDivision={staffDivision}
                />
                <ModalEditPosition
                    key={uuidv4()}
                    staffDivision={staffDivision}
                    isOpen={editPosition}
                    onClose={() => setEditPosition(false)}
                    staffUnit={staffUnit}
                />
            </>
            <div>
                <Row gutter={16}>
                    <Col xs={16} lg={16} xl={16}>
                        <Row>
                            <Col xs={20} lg={20} xl={20}>
                                {staffUnit?.actual_position !== null && staffUnit?.position !== null ?  (
                                    <>
                                        <Text strong>
                                            {LocalText.getName(staffUnit?.actual_position)}
                                        </Text>
                                        &nbsp;
                                        <Text className={"text-muted"}>
                                            ({LocalText.getName(staffUnit?.position)})
                                        </Text>
                                    </>
                                ) : staffUnit?.actual_position === null && staffUnit?.position !== null ? (
                                    <>
                                        <Text strong>{LocalText.getName(staffUnit?.position)}</Text>
                                    </>
                                ) : staffUnit?.actual_position !== null && staffUnit?.position === null && (
                                    <>
                                        <Text strong>{LocalText.getName(staffUnit?.actual_position)}</Text>
                                    </>
                                )}
                            </Col>
                            <Col xs={4} lg={4} xl={4} style={{ whiteSpace: "nowrap" }}>
                                <Tooltip
                                    title={<IntlMessage id="schedulte.treeStaff.add.or.edit" />}
                                >
                                    <EditTwoTone
                                        onClick={() => {
                                            setEditPosition(true);
                                        }}
                                    />
                                </Tooltip>
                                &nbsp;
                                <Tooltip
                                    title={
                                        <IntlMessage id="schedule.treeStaff.delete.position.staff" />
                                    }
                                >
                                    <DeleteTwoTone
                                        twoToneColor="#FF4D4F"
                                        onClick={() => {
                                            staffUnit.user !== null
                                                ? setIsModalWarningDeletePosition(true)
                                                : setWarningDelPosWithoutUser(true);
                                        }}
                                    />
                                </Tooltip>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} lg={12} xl={12}>
                                <Text type="secondary" style={{ whiteSpace: "nowrap" }}>
                                    {position?.category_code}
                                </Text>
                            </Col>
                            <Col xs={12} lg={12} xl={12}>
                                <Text type="secondary" style={{ whiteSpace: "nowrap" }}>
                                    <IntlMessage id={"scheduel.allowance"} />: {position?.form}
                                </Text>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={8} lg={8} xl={8}>
                        {divisions()}
                    </Col>
                </Row>
                <Divider />
                <div>
                    <Row style={{ marginBottom: "10px", marginTop: "-8px" }}>
                        <IntlMessage id={"scheduel.maxRank"} />
                        {":"}&nbsp;
                        <span style={{ color: "#366EF6" }}>
                            {LocalText.getName(position?.max_rank)}
                        </span>
                    </Row>
                    {(staffUnit.user === null || staffUnit.user_id === null) &&
                    Array.isArray(staffUnit.hr_vacancy) &&
                    staffUnit.hr_vacancy?.length === 0 ? (
                        <Row gutter={[16, 16]}>
                            <Col xs={16}>
                                <Row gutter={[16, 16]}>
                                    <Col xs={24}>
                                        <Text strong>
                                            <IntlMessage id={"staffSchedule.vacant"} />
                                        </Text>
                                    </Col>
                                    <Col xs={24}>
                                        <Checkbox onChange={(e) => createVac(e.target.checked)}>
                                            <IntlMessage id={"scheduel.vacancy"} />
                                        </Checkbox>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    ) : staffUnit.user !== null ? (
                        <>
                            <Row gutter={16} style={{ alignItems: "center" }}>
                                <Col xs={5}>
                                    <AvatarStatus
                                        src={staffUnit?.user?.icon}
                                        size={60}
                                        onNameClick={() => {
                                            if (staffUnit?.user?.id) {
                                                showConfirmToNavigatePersonalData(
                                                    staffUnit?.user?.id,
                                                );
                                            }
                                        }}
                                    />
                                </Col>
                                <Col xs={7}>
                                    <Tooltip
                                        title={<IntlMessage id="schedule.direct.personal.page" />}
                                    >
                                        <Text
                                            style={{ cursor: "pointer" }}
                                            strong
                                            onClick={() => {
                                                if (staffUnit?.user?.id) {
                                                    showConfirmToNavigatePersonalData(
                                                        staffUnit?.user?.id,
                                                    );
                                                }
                                            }}
                                        >
                                            {staffUnit?.user?.father_name === null
                                                ? concatBySpace([
                                                      staffUnit?.user?.last_name,
                                                      staffUnit?.user?.first_name,
                                                  ])
                                                : concatBySpace([
                                                      staffUnit?.user?.last_name,
                                                      staffUnit?.user?.first_name,
                                                      staffUnit?.user?.father_name,
                                                  ])}
                                        </Text>
                                    </Tooltip>
                                </Col>

                                <Col xs={4}>
                                    {/*<AvatarStatus*/}
                                    {/*    src={*/}
                                    {/*        staffUnit.user?.is_military === true*/}
                                    {/*            ? staffUnit.user.rank?.military_url*/}
                                    {/*            : staffUnit.user?.is_military === false*/}
                                    {/*            ? staffUnit.user?.rank?.employee_url*/}
                                    {/*            : undefined*/}
                                    {/*    }*/}
                                    {/*    size={40}*/}
                                    {/*/>*/}
                                    <Tooltip
                                        title={<LocalizationText text={staffUnit?.user?.rank} />}
                                    >
                                        <Avatar
                                            src={
                                                staffUnit.user?.is_military === true
                                                    ? staffUnit.user.rank?.military_url
                                                    : staffUnit.user?.is_military === false
                                                    ? staffUnit.user?.rank?.employee_url
                                                    : undefined
                                            }
                                            style={{ color: "black" }}
                                            size={40}
                                        />
                                    </Tooltip>
                                </Col>
                                <Col xs={4}>
                                    <Avatar size={40} style={{ color: "black" }}>
                                        {formatYears(sumYears(emergencyContract))}
                                    </Avatar>
                                </Col>
                                <Col xs={4}>
                                    <Tooltip
                                        title={
                                            <IntlMessage id="schedule.treeStaff.remove.staff.position" />
                                        }
                                    >
                                        <DeleteTwoTone
                                            twoToneColor="#FF4D4F"
                                            onClick={() => {
                                                showModalWarningDelUser(true);
                                            }}
                                        />
                                    </Tooltip>
                                </Col>
                            </Row>
                            <div style={{ marginBottom: "-8px", marginTop: "10px" }}>
                                <IntlMessage id={"scheduel.position"} />
                                {": "}&nbsp;
                                <span style={{ color: "#366EF6" }}>
                                    {LocalText.getName(staffUnit?.user?.rank)}
                                </span>
                            </div>
                        </>
                    ) : staffUnit.hr_vacancy?.length === 1 ? (
                        <Row gutter={[16, 16]}>
                            <Col xs={16}>
                                <Row gutter={[16, 16]}>
                                    <Col xs={24}>
                                        <Text strong>
                                            <IntlMessage id={"staffSchedule.vacant"} />
                                        </Text>
                                        <Text className={"text-muted"}>
                                            &nbsp;&nbsp;&nbsp;
                                            {moment(staffUnit.hr_vacancy[0].created_at).format(
                                                "DD.MM.YYYY",
                                            )}
                                        </Text>
                                    </Col>
                                    <Col xs={24}>
                                        <Checkbox
                                            checked={staffUnit.hr_vacancy[0].is_active}
                                            onChange={(e) =>
                                                staffUnit.hr_vacancy?.length === 1 &&
                                                clickCheckbox(
                                                    staffUnit.hr_vacancy[0],
                                                    e.target.checked,
                                                )
                                            }
                                        >
                                            <IntlMessage id={"scheduel.vacancy"} />
                                        </Checkbox>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    ) : null}
                </div>
            </div>
            <Divider />
            <Row style={{ marginTop: "16px" }}>
                <Col xs={2}>
                    <Tooltip title={<IntlMessage id="schedule.trestaff.add.qual.req.tooltip" />}>
                        <EditTwoTone
                            onClick={() => {
                                setVisible(true);
                            }}
                        />
                    </Tooltip>
                </Col>
                <Col xs={22}>
                    <IntlMessage id={"scheduel.quality"} />
                </Col>
            </Row>
        </>
    );
};
