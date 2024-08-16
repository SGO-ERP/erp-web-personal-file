import { RightCircleFilled } from "@ant-design/icons";
import { Button, Row } from "antd";
import AvatarStatus from "components/shared-components/AvatarStatus";
import DataText from "components/shared-components/DataText";
import TableWithPagination from "components/shared-components/TableWithPagination";
import IntlMessage from "components/util-components/IntlMessage";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getDraftLetters } from "store/slices/signedLettersSlice/draftLettersSlice";
import {
    changeCurrentPage,
    showHideSecondCardAction,
} from "store/slices/tableControllerSlice/tableControllerSlice";
import { APP_PREFIX_PATH } from "../../../../../configs/AppConfig";
import HrDocumentService from "../../../../../services/HrDocumentsService";
import utils from "../../../../../utils";
import "../tables/unsigned.css";
import { useTranslation } from "react-i18next";
import ServicesService from "../../../../../services/myInfo/ServicesService";
import UserRankById from "../../../../../services/GetRankByIdService";
import { resetSliceByOrder } from "store/slices/newInitializationsSlices/initializationNewSlice";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";

export const DraftLetters = () => {
    const dispatch = useDispatch();
    const hrDraftDocuments = useSelector((state) => state.draftLetters.hrDraftDocuments);
    const hasNextPage = useSelector((state) => state.draftLetters.hasMore);
    const isLoading = useSelector((state) => state.draftLetters.isLoading);
    const currentPage = useSelector((state) => state.tableController.currentPage);
    const currentPageSize = useSelector((state) => state.tableController.pageSize);

    const tableControllerSearch = useSelector((state) => state.tableController.searchValue);

    const [oldValues, setOldValues] = useState([]);

    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const [oldPos, setOldPos] = useState([]);

    useEffect(() => {
        const fetchOldValues = async () => {
            const fetchedOldValues = {};

            for (const record of hrDraftDocuments) {
                const oldValue = await ServicesService.get_services(record.users[0].id);
                fetchedOldValues[record.id] = oldValue.ranks.map((rank) => {
                    return { name: rank.name, nameKZ: rank.nameKZ };
                });
            }

            setOldValues(fetchedOldValues);
        };

        fetchOldValues();

        const fetchOldData = async () => {
            if (hrDraftDocuments) {
                const allPromises = hrDraftDocuments.map((el) => {
                    if (el.old_history_id !== null) {
                        return getOldPos(el.old_history_id);
                    } else {
                        return null;
                    }
                });
                const allData = await Promise.all(allPromises);
                setOldPos(allData);
            }
        };

        if (oldPos.length === 0) {
            fetchOldData();
        }
    }, [hrDraftDocuments]);

    const getOldPos = async (id) => {
        if (id !== null) {
            return await UserRankById.get_user_positionId(id);
        }

        return null;
    };

    function formatDate(dateString) {
        return moment(dateString).format("DD.MM.YYYY");
    }

    const getDates = (arr) => {
        let date1;
        let date2;
        for (let item of arr) {
            if (typeof item === "object") continue;

            if (!date1) {
                date1 = formatDate(item);
            } else {
                date2 = formatDate(item);
                let date21 = formatDate(item);
                if (date1 > date2) {
                    date2 = date1;
                    date1 = date21;
                }
            }
        }

        return [date1, date2];
    };

    let keyNum = 0;
    useEffect(() => {
        dispatch(changeCurrentPage({ page: 1, pageSize: 5 }));
        dispatch(getDraftLetters({ page: 1, limit: 5 }));
    }, [tableControllerSearch]);

    // SAVE CURRENT PAGE INDEX IN ORDER TO GIVE IT TO TABLE WHEN SECOND CARD OPENED
    const saveCurrentPageSettings = (page, pageSize) => {
        dispatch(changeCurrentPage({ page: page, pageSize: pageSize }));
    };
    // Fetch signed documents with the given parameters.
    const fetchData = async (params) => {
        return dispatch(getDraftLetters(params));
    };

    let showHideSecondCardFunction = (record) => {
        dispatch(showHideSecondCardAction(record));
    };

    const findPreviousRank = (ranks, newRank) => {
        const index = ranks.indexOf(newRank);

        if (index === -1) {
            if (ranks.length > 1) {
                return ranks[ranks.length - 1];
            } else {
                return "";
            }
        } else {
            if (index === 0) {
                return "";
            } else {
                return ranks[index - 1];
            }
        }
    };

    const drawRowInfo = (record, index) => {
        const info = record.new_value[0];
        const infoUser = record.users[0];

        if (info && info["add_badge"] !== undefined) {
            return (
                <Row
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        columnGap: "5px",
                        flexWrap: "nowrap",
                        flexDirection: "row",
                    }}
                >
                    <p
                        style={{
                            color: "black",
                            display: "block",
                            margin: "0",
                            marginLeft: 10,
                        }}
                    >
                        <img
                            src={info["add_badge"].url}
                            alt="Изображение черного берета"
                            style={{ marginRight: 15, width: 25, height: 46 }}
                        />
                        {i18n.language === "ru" ? info["add_badge"].name : info["add_badge"].nameKZ}
                    </p>
                </Row>
            );
        }

        if (info && info["add_black_beret"] !== undefined) {
            return (
                <Row
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        columnGap: "5px",
                        flexWrap: "nowrap",
                        flexDirection: "row",
                    }}
                >
                    <p
                        style={{
                            color: "black",
                            display: "block",
                            margin: "0",
                            marginLeft: 10,
                        }}
                    >
                        <img
                            src={info["add_black_beret"].url}
                            alt="Изображение черного берета"
                            style={{ marginRight: 15, width: 46, height: 46 }}
                        />
                        {i18n.language === "ru"
                            ? info["add_black_beret"].name
                            : info["add_black_beret"].nameKZ}
                    </p>
                </Row>
            );
        }

        if (info && info["delete_badge"] !== undefined) {
            return (
                <Row
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        columnGap: "5px",
                        flexWrap: "nowrap",
                        flexDirection: "row",
                    }}
                >
                    <p
                        style={{
                            color: "black",
                            display: "block",
                            margin: "0",
                            marginLeft: 10,
                        }}
                    >
                        <img
                            src={info["delete_badge"].url}
                            alt="Изображение черного берета"
                            style={{ marginRight: 15, width: 25, height: 46 }}
                        />
                        {i18n.language === "ru"
                            ? info["delete_badge"].name
                            : info["delete_badge"].nameKZ}
                    </p>
                </Row>
            );
        }

        if (info && info["delete_black_beret"] !== undefined) {
            return (
                <Row
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        columnGap: "5px",
                        flexWrap: "nowrap",
                        flexDirection: "row",
                    }}
                >
                    <p
                        style={{
                            color: "black",
                            display: "block",
                            margin: "0",
                            marginLeft: 10,
                        }}
                    >
                        <img
                            src={info["delete_black_beret"].url}
                            alt="Изображение черного берета"
                            style={{ marginRight: 15, width: 46, height: 46 }}
                        />
                        {i18n.language === "ru"
                            ? info["delete_black_beret"].name
                            : info["delete_black_beret"].nameKZ}
                    </p>
                </Row>
            );
        }

        if (info?.["position_change"] !== undefined) {
            const position = infoUser.staff_unit.actual_position
                ? infoUser.staff_unit.actual_position
                : infoUser.staff_unit.position;
            const oldPosition = oldPos[index] || {
                position: {
                    name: position.name,
                    nameKZ: position.nameKZ,
                },
            };

            const propertiesKeys = Object.keys(record.properties);
            const newPosition = propertiesKeys
                .map(
                    (item) =>
                        record.properties[item].value === info["position_change"].id &&
                        record.properties[item],
                )
                .filter(Boolean);

            const actual_position = propertiesKeys.includes("actual_position_id")
                ? record.properties["actual_position_id"]
                : null;

            const actual_position_lang =
                i18n.language === "ru"
                    ? ` (за счет должности ${LocalText.getName(newPosition[0])})`
                    : ` (лауазымы есебінен ${LocalText.getName(newPosition[0])})`;

            const finalPosition = actual_position
                ? LocalText.getName(actual_position) + actual_position_lang
                : LocalText.getName(newPosition[0]);

            return (
                <Row
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        columnGap: "5px",
                        flexWrap: "nowrap",
                        flexDirection: "row",
                    }}
                >
                    <p
                        style={{
                            color: "black",
                            marginBottom: 0,
                        }}
                    >
                        {LocalText.getName(oldPosition?.position)}
                    </p>
                    <RightCircleFilled
                        style={{
                            fontSize: "27.5px",
                            color: "blue",
                            display: "block",
                            margin: "0 auto ",
                            cursor: "pointer",
                        }}
                    />
                    <p style={{ color: "#366EF6", display: "block", margin: "0" }}>
                        {finalPosition}
                    </p>
                </Row>
            );
        }

        if (info && info["add_secondment"] !== undefined) {
            let findObj;

            for (let item of info["add_secondment"]) {
                if (typeof item === "object") {
                    findObj = item;
                }
            }

            return (
                <Row
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        columnGap: "5px",
                        flexWrap: "nowrap",
                        flexDirection: "row",
                    }}
                >
                    <p
                        style={{
                            color: "black",
                            marginBottom: 0,
                        }}
                    >
                        {i18n.language === "ru"
                            ? infoUser.staff_unit.staff_division.name
                            : infoUser.staff_unit.staff_division.nameKZ}
                    </p>
                    <RightCircleFilled
                        style={{
                            fontSize: "27.5px",
                            color: "blue",
                            display: "block",
                            margin: "0 auto ",
                            cursor: "pointer",
                        }}
                    />
                    <p style={{ color: "#366EF6", display: "block", margin: "0" }}>
                        {i18n.language === "ru" ? findObj.name : findObj.nameKZ}
                    </p>
                </Row>
            );
        }

        if (info && info["grant_leave"] !== undefined) {
            const [date1, date2] = getDates(info["grant_leave"]);

            return (
                <Row
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        columnGap: "5px",
                        flexWrap: "nowrap",
                        flexDirection: "row",
                    }}
                >
                    <p
                        style={{
                            color: "black",
                            marginBottom: 0,
                        }}
                    >
                        {date1}
                    </p>
                    <RightCircleFilled
                        style={{
                            fontSize: "27.5px",
                            color: "blue",
                            display: "block",
                            margin: "0 auto ",
                            cursor: "pointer",
                        }}
                    />
                    <p style={{ color: "#366EF6", display: "block", margin: "0" }}>{date2}</p>
                </Row>
            );
        }

        if (info && info["temporary_status_change"] !== undefined) {
            const [date1, date2] = getDates(info["temporary_status_change"]);

            return (
                <Row
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        columnGap: "5px",
                        flexWrap: "nowrap",
                        flexDirection: "row",
                    }}
                >
                    <p
                        style={{
                            color: "black",
                            marginBottom: 0,
                        }}
                    >
                        {date1}
                    </p>
                    <RightCircleFilled
                        style={{
                            fontSize: "27.5px",
                            color: "blue",
                            display: "block",
                            margin: "0 auto ",
                            cursor: "pointer",
                        }}
                    />
                    <p style={{ color: "#366EF6", display: "block", margin: "0" }}>{date2}</p>
                </Row>
            );
        }

        if (info && info["sick_leave"] !== undefined) {
            const [date1, date2] = getDates(info["sick_leave"]);

            return (
                <Row
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        columnGap: "5px",
                        flexWrap: "nowrap",
                        flexDirection: "row",
                    }}
                >
                    <p
                        style={{
                            color: "black",
                            marginBottom: 0,
                        }}
                    >
                        {date1}
                    </p>
                    <RightCircleFilled
                        style={{
                            fontSize: "27.5px",
                            color: "blue",
                            display: "block",
                            margin: "0 auto ",
                            cursor: "pointer",
                        }}
                    />
                    <p style={{ color: "#366EF6", display: "block", margin: "0" }}>{date2}</p>
                </Row>
            );
        }

        if (info && info["stop_leave"] !== undefined) {
            return (
                <Row
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        columnGap: "5px",
                        flexWrap: "nowrap",
                        flexDirection: "row",
                    }}
                >
                    {i18n.language === "ru" ? "Отзыв:" : "Қайтарып алу:"}
                    <p
                        style={{
                            color: "#366EF6",
                            display: "block",
                            margin: "0",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {i18n.language === "ru"
                            ? info["stop_leave"].status_name
                            : info["stop_leave"].status_nameKZ}
                    </p>
                </Row>
            );
        }

        if (info && info["increase_rank"] !== undefined) {
            const currentRanks = info["increase_rank"];

            return (
                <Row
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        columnGap: "5px",
                        flexWrap: "nowrap",
                        flexDirection: "row",
                    }}
                >
                    <p
                        style={{
                            color: "black",
                            marginBottom: 0,
                        }}
                    >
                        {LocalText.getName(currentRanks?.old_rank)}
                    </p>
                    <RightCircleFilled
                        style={{
                            fontSize: "27.5px",
                            color: "blue",
                            display: "block",
                            margin: "0 auto ",
                            cursor: "pointer",
                        }}
                    />
                    <p style={{ color: "#366EF6", display: "block", margin: "0" }}>
                        {LocalText.getName(currentRanks?.new_rank)}
                    </p>
                </Row>
            );
        }

        if (info && info["decrease_rank"] !== undefined) {
            const currentRanks = info["decrease_rank"];

            return (
                <Row
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        columnGap: "5px",
                        flexWrap: "nowrap",
                        flexDirection: "row",
                    }}
                >
                    <p
                        style={{
                            color: "black",
                            marginBottom: 0,
                        }}
                    >
                        {LocalText.getName(currentRanks?.old_rank)}
                    </p>
                    <RightCircleFilled
                        style={{
                            fontSize: "27.5px",
                            color: "blue",
                            display: "block",
                            margin: "0 auto ",
                            cursor: "pointer",
                        }}
                    />
                    <p style={{ color: "#366EF6", display: "block", margin: "0" }}>
                        {LocalText.getName(currentRanks?.new_rank)}
                    </p>
                </Row>
            );
        }

        if (info && info["renew_contract"] !== undefined) {
            const [date1, date2] = getDates(info["renew_contract"]);

            let findObj;

            for (let item of info["renew_contract"]) {
                if (typeof item === "object") {
                    findObj = item;
                }
            }

            return findObj.years > 0 ? (
                <Row
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        columnGap: "5px",
                        flexWrap: "nowrap",
                        flexDirection: "row",
                    }}
                >
                    <p style={{ color: "black", marginBottom: 0 }}>{date1}</p>
                    <RightCircleFilled
                        style={{
                            fontSize: "27.5px",
                            color: "blue",
                            display: "block",
                            margin: "0 auto ",
                            cursor: "pointer",
                        }}
                    />
                    <p style={{ color: "#366EF6", display: "block", margin: "0" }}>{date2}</p>
                </Row>
            ) : (
                <Row
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        columnGap: "5px",
                        flexWrap: "nowrap",
                        flexDirection: "row",
                    }}
                >
                    <p style={{ color: "black", marginBottom: 0 }}>
                        {i18n.language ? findObj.name : findObj.nameKZ}
                    </p>
                </Row>
            );
        }

        if (info && info["add_penalty"] !== undefined) {
            return (
                <Row
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        columnGap: "5px",
                        flexWrap: "nowrap",
                        flexDirection: "row",
                    }}
                >
                    <p style={{ color: "#366EF6", display: "block", margin: "0" }}>
                        {info["add_penalty"].name}
                    </p>
                </Row>
            );
        }

        if (info && info["delete_penalty"] !== undefined) {
            return (
                <Row
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        columnGap: "5px",
                        flexWrap: "nowrap",
                        flexDirection: "row",
                    }}
                >
                    Cнятие:
                    <p style={{ color: "#366EF6", display: "block", margin: "0" }}>
                        {i18n.language === "ru"
                            ? info["delete_penalty"].penalty_type.name
                            : info["delete_penalty"].penalty_type.nameKZ}
                    </p>
                </Row>
            );
        }

        if (info && info["add_secondment_to_state_body"] !== undefined) {
            let findObj;

            for (let item of info["add_secondment_to_state_body"]) {
                if (typeof item === "object") {
                    findObj = item;
                }
            }

            return (
                <Row
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        columnGap: "5px",
                        flexWrap: "nowrap",
                        flexDirection: "row",
                    }}
                >
                    <p style={{ color: "#366EF6", display: "block", margin: "0" }}>
                        {i18n.language === "ru" ? findObj.name : findObj.nameKZ}
                    </p>
                </Row>
            );
        }

        if (info && info["status_change"] !== undefined) {
            return (
                <Row
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        columnGap: "5px",
                        flexWrap: "nowrap",
                        flexDirection: "row",
                    }}
                >
                    <p style={{ color: "#366EF6", display: "block", margin: "0" }}>
                        {i18n.language === "ru"
                            ? info["status_change"].name
                            : info["status_change"].nameKZ}
                    </p>
                </Row>
            );
        }
    };

    const columns = [
        {
            title: <IntlMessage id="archieve.data.created" />,
            dataIndex: "created_at",
            render: (text, record) => (
                <div className={"d-inline"} style={{ justifyContent: "flex-start" }} key={keyNum++}>
                    <p className={"text"}> {moment(record.created_at).format("DD.MM.YYYY")}</p>
                    <p style={{ color: "#366EF6" }}>{moment(record.created_at).fromNow()}</p>
                </div>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, "created_at"),
        },
        {
            title: "Субъект",
            dataIndex: ["users", 0, "first_name"],
            render: (text, record) => (
                <div
                    key={keyNum++}
                    className={"d-flex"}
                    onClick={() => showHideSecondCardFunction(record)}
                >
                    <AvatarStatus size={40} src={record.users[0].icon} />
                    <div className="mt-2" key={keyNum++}>
                        {record.users[0].father_name !== null ? (
                            <DataText
                                style={{ color: "#1A3353" }}
                                name={`${record.users[0].first_name} ${record.users[0].last_name} ${record.users[0].father_name}`}
                            />
                        ) : (
                            <DataText
                                style={{ color: "#1A3353" }}
                                name={`${record.users[0].first_name} ${record.users[0].last_name} `}
                            />
                        )}
                    </div>
                </div>
            ),
        },
        {
            title: <IntlMessage id="letters.historyTable.orderName" />,
            dataIndex: ["document_template", "name"],
            render: (text, record) => (
                <DataText displayType={"text"} name={record.document_template.name} />
            ),
            sorter: (a, b) => {
                return a.document_template.name.localeCompare(b.document_template.name);
            },
            sortDirections: ["ascend", "descend"],
        },
        {
            title: <IntlMessage id="letters.unsignedTable.more" />,
            dataIndex: "users",
            render: (text, record, index) => {
                if (record.beforeRows === undefined) {
                    return drawRowInfo(record, index);
                }

                return <div>Изменение штатного расписания</div>;
            },
        },
        {
            title: <IntlMessage id="letters.historytable.actions" />,
            dataIndex: ["action"],
            render: (text, record) => (
                <Button
                    type="link"
                    onClick={() => {
                        HrDocumentService.getDocumentById(record.id).then((r) => {
                            dispatch(resetSliceByOrder());
                            const editOrderId = r.document_template.id;
                            const editCandidateId = r.users[0].id;
                            const draftId = r.id;
                            if (
                                r.document_template.name ===
                                    "Приказ о зачислении на службу сотрудника" ||
                                r.document_template.name === "Приказ о назначении на должность"
                            ) {
                                navigate(
                                    `${APP_PREFIX_PATH}/management/letters/initiate?candidateUserId=${editCandidateId}&editId=${draftId}&orderId=${editOrderId}&statusId=${r.status_id}&subject=${r.document_template.subject_type}`,
                                );
                            } else {
                                navigate(
                                    `${APP_PREFIX_PATH}/management/letters/initiate?editUser=${editCandidateId}&editId=${draftId}&orderId=${editOrderId}&statusId=${r.status_id}&subject=${r.document_template.subject_type}`,
                                );
                            }
                        });
                    }}
                >
                    <IntlMessage id={"personal.button.continue"} />
                </Button>
            ),
        },
    ];

    return (
        <>
            <TableWithPagination
                initialPageSize={currentPageSize}
                isLoading={isLoading}
                dataSource={hrDraftDocuments}
                columns={columns}
                initialPage={currentPage}
                fetchData={fetchData}
                saveCurrentPage={saveCurrentPageSettings}
                hasMore={hasNextPage}
            />
        </>
    );
};
