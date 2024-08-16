import React, { useEffect, useState } from "react";
import { Button, Modal, Table, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import AvatarStatus from "components/shared-components/AvatarStatus";
import IntlMessage from "components/util-components/IntlMessage";
import moment from "moment";
import utils from "../../../../../utils";
import { APP_PREFIX_PATH } from "../../../../../configs/AppConfig";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/useStore";
import { components } from "../../../../../API/types";
import { ColumnsType } from "antd/es/table";
import { concatBySpace } from "../../../../../utils/format/format";
import HrDocumentTemplatesService from "../../../../../services/HrDocumentTemplatesService";
import UsersService from "../../../../../services/myInfo/UsersService";
import HRVacancyService from "../../../../../services/vacancy/HRVacancyService";
import { resetSliceByOrder } from "store/slices/newInitializationsSlices/initializationNewSlice";

interface ViewCandidatesProps {
    isOpen: boolean;
    onClose: () => void;
    data: components["schemas"]["schemas__hr_vacancy__HrVacancyRead"];
}

const ViewCandidates = ({ isOpen, onClose, data }: ViewCandidatesProps) => {
    const { candidates, isLoading } = useAppSelector((state) => state.vacancyCandidates);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [updatedCandidates, setUpdatedCandidates] = useState<
        Array<{ hasDocument: boolean; candidate: components["schemas"]["HrVacancyCandidateRead"] }>
    >([]);
    const [isLoadingSecond, setIsLoadingSecond] = useState(false);

    useEffect(() => {
        setIsLoadingSecond(true);
        const fetchData = async () => {
            if (data !== null && data.id !== undefined) {
                const template = await HrDocumentTemplatesService.get_hr_doc_templates_by_name(
                    "Приказ о назначении на должность",
                );
                // dispatch(getVacancyCandidates(data.id));
                HRVacancyService.getCandidatesOfVacancy(data.id).then(async (response) => {
                    const requests = response.map(
                        (candidate: components["schemas"]["HrVacancyCandidateRead"]) => {
                            return UsersService.checkUserHasDocument(
                                candidate?.user_id,
                                template[0].id,
                            ).then((response) => ({
                                candidate: candidate,
                                hasDocument: response,
                            }));
                        },
                    );
                    const results = await Promise.all(requests);
                    setUpdatedCandidates(results);
                    setIsLoadingSecond(false);
                });
            }
        };
        fetchData();
        return () => {
            setUpdatedCandidates([]);
        };
    }, [data]);

    const handleOk = () => {
        onClose();
    };

    type Column = {
        hasDocument: boolean;
        candidate: components["schemas"]["HrVacancyCandidateRead"];
    };

    const currentTableColumns: ColumnsType<Column> = [
        {
            title: <IntlMessage fallback={"ru"} id="vacancy.view.table.date" />,
            dataIndex: "last_signed_at",
            render: (text, record) => (
                <div>
                    <p className={"text"}>
                        {moment(record?.candidate?.created_at).format("DD.MM.YYYY HH:mm")}
                    </p>
                    <p style={{ color: "#366EF6" }}>
                        {moment(record?.candidate.created_at).fromNow()}
                    </p>
                </div>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, "last_signed_at"),
            width: "15%",
        },
        {
            title: <IntlMessage fallback={"ru"} id={"personal.breadcrumbs.employee"} />,
            dataIndex: ["first_name"],
            render: (text, record) => (
                <div className="d-flex">
                    {/*<Row>*/}
                    {/*    <Col>*/}
                    <AvatarStatus size={40} src={record?.candidate.user?.icon} />
                    <div className="mt-2">
                        <p style={{ color: "black", display: "block" }}>
                            {concatBySpace([
                                record?.candidate.user?.last_name,
                                record?.candidate.user?.first_name,
                                record?.candidate.user?.father_name,
                            ])}
                        </p>
                    </div>
                </div>
            ),
            sorter: (a: Column, b: Column) => {
                const firstNameA = a?.candidate?.user?.first_name || "";
                const firstNameB = b?.candidate?.user?.first_name || "";
                return firstNameA.localeCompare(firstNameB);
            },
            width: "35%",
        },
        {
            title: <IntlMessage fallback={"ru"} id={"post"} />,
            dataIndex: ["staff_unit", "position", "name"],
            render: (text, record) => {
                return (
                    <div>
                        {LocalText.getName(
                            record?.candidate.user?.staff_unit?.actual_position
                                ? record?.candidate.user?.staff_unit?.actual_position
                                : record?.candidate.user?.staff_unit?.position,
                        )}
                        <br />
                        {LocalText.getName(record?.candidate.user?.staff_unit?.staff_division)}
                    </div>
                );
            },
            sorter: (a: Column, b: Column) => {
                const positionA = a?.candidate.user?.staff_unit?.actual_position
                    ? a?.candidate.user?.staff_unit?.actual_position.name
                    : a?.candidate.user?.staff_unit?.position?.name || "";
                const positionB = b?.candidate.user?.staff_unit?.actual_position
                    ? b?.candidate.user?.staff_unit?.actual_position.name
                    : b?.candidate.user?.staff_unit?.position?.name || "";

                return positionA.localeCompare(positionB);
            },
            width: "25%",
        },
        {
            title: <IntlMessage fallback={"ru"} id={"letters.historytable.actions"} />,
            dataIndex: "id",
            render: (text, record) => {
                return (
                    <div className="text-muted">
                        <Button
                            type="link"
                            size="small"
                            onClick={() =>
                                navigate(
                                    `${APP_PREFIX_PATH}/duty/data/${record?.candidate.user?.id}`,
                                    {
                                        state: { name: "vacancy" },
                                    },
                                )
                            }
                        >
                            <IntlMessage fallback={"ru"} id={"personalBusiness"} />
                        </Button>
                        <span>|</span>
                        {!record.hasDocument ? (
                            <Tooltip
                                placement="topRight"
                                title={<IntlMessage id={"vacancy.docHasCandidate"} />}
                            >
                                <Button type="link" size="small" disabled>
                                    <IntlMessage fallback={"ru"} id="table.checkboxAccept" />
                                </Button>
                            </Tooltip>
                        ) : (
                            <Button
                                type="link"
                                size="small"
                                onClick={async () => {
                                    dispatch(resetSliceByOrder());
                                    const staffUnitID = data?.staff_unit?.id;
                                    const divisionID = data?.staff_unit?.staff_division_id;
                                    navigate(
                                        `${APP_PREFIX_PATH}/management/letters/initiate?candidateUserId=${record?.candidate?.user?.id}&fromVacancy=true&vacancyPosition=${staffUnitID}&vacancyDivision=${divisionID}`,
                                    );
                                }}
                            >
                                <IntlMessage fallback={"ru"} id="table.checkboxAccept" />
                            </Button>
                        )}
                    </div>
                );
            },
            width: "25%",
        },
    ];

    return (
        <Modal
            title={
                <span>
                    <IntlMessage fallback={"ru"} id="vacancy.view.candidates" /> “
                    {LocalText.getName(
                        data?.staff_unit?.actual_position
                            ? data?.staff_unit?.actual_position
                            : data?.staff_unit?.position,
                    )}
                    “
                </span>
            }
            open={isOpen}
            // okText="Продолжить"
            okText={<IntlMessage fallback={"ru"} id={"staffSchedule.save"} />}
            cancelText={<IntlMessage fallback={"ru"} id={"staffSchedule.cancel"} />}
            onOk={handleOk}
            onCancel={onClose}
            width={1200}
        >
            <Table
                loading={isLoadingSecond}
                dataSource={updatedCandidates}
                columns={currentTableColumns}
                pagination={false}
            />
        </Modal>
    );
};

export default ViewCandidates;
