import { CloseOutlined, RightCircleFilled } from "@ant-design/icons";
import { Checkbox, Row } from "antd";
import AvatarStatus from "components/shared-components/AvatarStatus";
import DataText from "components/shared-components/DataText";
import TableWithPagination from "components/shared-components/TableWithPagination";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHrDocumentSNotSigned } from "store/slices/lettersOrdersSlice/lettersOrdersSlice";
import {
    changeCurrentPage,
    notShowHideSecondCard,
    notShowHideThirdCard,
    showHideCommentModal,
    showHideSecondCardAction,
    showHideThirdCardAction,
} from "store/slices/tableControllerSlice/tableControllerSlice";
import utils from "../../../../../utils";
import CommentCard from "../cards/CommentCard";

import IntlMessage from "components/util-components/IntlMessage";
import "../tables/unsigned.css";
import moment from "moment";
import { useTranslation } from "react-i18next";
import ServicesService from "services/myInfo/ServicesService";
import UserRankById from "services/GetRankByIdService";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";

export const UnsignedTable = ({
    hrDocumentsNotSigned,
    selectedIds,
    setSelectedIds,
    filteredUsers,
    setComment,
    isNotification,
}) => {
    const dispatch = useDispatch();
    const showSecondCard = useSelector((state) => state.tableController.showHideSecondCard);
    const isLoading = useSelector((state) => state.lettersOrders.isLoading);
    const currentPage = useSelector((state) => state.tableController.currentPage);
    const currentPageSize = useSelector((state) => state.tableController.pageSize);
    const hasNextPage = useSelector((state) => state.lettersOrders.hasMore);

    const hrDocumentsSigned = useSelector((state) => state.signedLetters.hrDocumentsSigned);

    const [oldValues, setOldValues] = useState([]);
    const [oldPos, setOldPos] = useState([]);
    const { i18n } = useTranslation();

    const tableControllerSearch = useSelector((state) => state.tableController.searchValue);

    const filterResult = (filteredUsers &&
        filteredUsers.reduce(
            (accumulator, item) => {
                if (item.new_value?.count === undefined) {
                    accumulator.newFilteredUsers.push(item);
                } else {
                    accumulator.superOrder.push(item);
                }
                return accumulator;
            },
            { newFilteredUsers: [], superOrder: [] },
        )) || { newFilteredUsers: [], superOrder: [] };

    const { superOrder } = filterResult ?? {
        newFilteredUsers: null,
        superOrder: null,
    };

    useEffect(() => {
        dispatch(changeCurrentPage({ page: 1, pageSize: 5 }));
        dispatch(getHrDocumentSNotSigned({ page: 1, limit: 5 }));
    }, [tableControllerSearch]);

    useEffect(() => {
        const fetchOldValues = async () => {
            const fetchedOldValues = {};

            for (const record of hrDocumentsSigned) {
                const oldValue = await ServicesService.get_services(record.users[0].id);
                fetchedOldValues[record.id] = oldValue.ranks.map((rank) => {
                    return { name: rank.name, nameKZ: rank.nameKZ };
                });
            }

            setOldValues(fetchedOldValues);
        };

        fetchOldValues();

        const fetchOldData = async () => {
            if (hrDocumentsSigned) {
                const allPromises = hrDocumentsSigned.map((el) => {
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
    }, [hrDocumentsSigned]);

    const getOldPos = async (id) => {
        if (id !== null) {
            return await UserRankById.get_user_positionId(id);
        }

        return null;
    };

    const [selectAll, setSelectAll] = useState(false);
    const [recordCheckbox, setRecordCheckbox] = useState({});

    if (!hrDocumentsNotSigned) {
        return null;
    }
    const haveSomeCanCancel = hrDocumentsNotSigned.some((item) => item.can_cancel === true);

    let showHideSecondCardFunction = (record) => {
        dispatch(notShowHideThirdCard(false));
        dispatch(showHideSecondCardAction(record));
    };

    let showHideThirdCardFunction = (record) => {
        dispatch(notShowHideSecondCard(false));
        dispatch(showHideThirdCardAction(record));
    };

    const fetchData = async (params) => {
        return dispatch(getHrDocumentSNotSigned(params));
    };

    const saveCurrentPageSettings = (page, pageSize) => {
        dispatch(changeCurrentPage({ page: page, pageSize: pageSize }));
    };

    const handleCheckBoxChangeAddComment = (newText, recordId, checked, can_cancel, isSigned) => {
        if (isNotification) {
            setComment(newText);
        }
        const existingIdObj = selectedIds.find((idObj) => idObj.id === recordId);
        if (newText) {
            if (existingIdObj) {
                if (existingIdObj.is_signed === isSigned && !checked) {
                    setSelectedIds((prevSelectedIds) =>
                        prevSelectedIds.filter((idObj) => idObj.id !== recordId.record.id),
                    );
                } else {
                    setSelectedIds((prevSelectedIds) =>
                        prevSelectedIds.map((idObj) =>
                            idObj.id === recordId
                                ? { ...idObj, is_signed: isSigned, comment: newText }
                                : idObj,
                        ),
                    );
                }
            } else {
                setSelectedIds((prevSelectedIds) => [
                    ...prevSelectedIds,
                    { id: recordId, is_signed: isSigned, comment: newText },
                ]);
            }
        } else {
            if (can_cancel === false || isSigned === false) {
                dispatch(showHideCommentModal(true));
            } else {
                if (existingIdObj) {
                    if (existingIdObj.is_signed === isSigned && !checked) {
                        setSelectedIds((prevSelectedIds) =>
                            prevSelectedIds.filter((idObj) => idObj.id !== recordId.record.id),
                        );
                    } else {
                        setSelectedIds((prevSelectedIds) =>
                            prevSelectedIds.map((idObj) =>
                                idObj.id === recordId
                                    ? { ...idObj, is_signed: isSigned, comment: "" }
                                    : idObj,
                            ),
                        );
                    }
                } else {
                    setSelectedIds((prevSelectedIds) => [
                        ...prevSelectedIds,
                        { id: recordId, is_signed: isSigned, comment: "" },
                    ]);
                }
            }
        }
    };

    const handleSelectAllChange = (e) => {
        const checked = e.target.checked;
        setSelectAll(checked);
        if (checked) {
            setSelectedIds(
                hrDocumentsNotSigned.map((record) => ({ id: record.id, is_signed: true })),
            );
        } else {
            setSelectedIds([]);
        }
    };

    const areAllAccepted = hrDocumentsNotSigned.every((record) =>
        selectedIds.some((idObj) => idObj.id === record.id && idObj.is_signed),
    );

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
                            width="30"
                            height="30"
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
                            : infoUser.staff_unit.staff_division?.nameKZ}
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
                    {i18n.language === "ru" ? "Отзыв:" : "Қарау:"}
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
                            : info["stop_leave"]?.status_nameKZ}
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
                        {i18n.language === "ru"
                            ? info["add_penalty"].name
                            : info["add_penalty"].nameKZ}
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
                    {i18n.language === "ru" ? "Снятие:" : "Шығу:"}
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
            title: (
                <div style={{ display: "flex", alignItems: "center" }}>
                    {showSecondCard ? (
                        <Checkbox
                            className="all-blue-checkboxs"
                            checked={haveSomeCanCancel ? areAllAccepted : true}
                            onChange={haveSomeCanCancel ? handleSelectAllChange : ""}
                        />
                    ) : haveSomeCanCancel ? (
                        <>
                            <div style={{ paddingRight: "15px" }}>
                                <Checkbox
                                    className="all-blue-checkboxs"
                                    checked={areAllAccepted}
                                    onChange={handleSelectAllChange}
                                />
                            </div>
                            <IntlMessage id="letters.unsignedTable.accept" />
                        </>
                    ) : (
                        <IntlMessage id="letters.unsignedTable.accept" />
                    )}
                </div>
            ),
            dataIndex: "id",
            render: (text, record) => (
                <>
                    <div>
                        <Checkbox
                            className="single-checkboxs"
                            checked={selectedIds.some(
                                (idObj) => idObj.id === record.id && idObj.is_signed === true,
                            )}
                            onChange={(e) => {
                                const selected = selectedIds.find(
                                    (idObj) => idObj.id === record.id && idObj.is_signed === true,
                                );
                                if (selected === undefined) {
                                    handleCheckBoxChangeAddComment(
                                        "",
                                        record.id,
                                        e.target.checked,
                                        record.can_cancel,
                                        true,
                                    );
                                    setRecordCheckbox({
                                        isSigned: true,
                                        id: record.id,
                                        checked: selectedIds.some(
                                            (idObj) =>
                                                idObj.id === record.id && idObj.is_signed === true,
                                        ),
                                        can_cancel: record.can_cancel,
                                    });
                                } else {
                                    let idToDelete = record.id;
                                    if (selected.is_signed === true) {
                                        setSelectedIds((prevItems) =>
                                            prevItems.filter((item) => item.id !== idToDelete),
                                        );
                                    }
                                }
                            }}
                        />
                    </div>
                </>
            ),
            key: 1,
        },
        {
            title: showSecondCard ? (
                <Checkbox className="single-checkboxs customCheckbox" checked={true} />
            ) : (
                <IntlMessage id="letters.unsignedTable.refuse" />
            ),
            dataIndex: "id",
            render: (text, record) => (
                <>
                    <div>
                        {record.can_cancel == false ? (
                            ""
                        ) : (
                            <Checkbox
                                className="single-checkboxs customCheckbox"
                                onChange={(e) => {
                                    const selected = selectedIds.find(
                                        (idObj) =>
                                            idObj.id === record.id && idObj.is_signed === false,
                                    );
                                    if (selected === undefined) {
                                        handleCheckBoxChangeAddComment(
                                            "",
                                            record.id,
                                            e.target.checked,
                                            record.can_cancel,
                                            false,
                                        );
                                        setRecordCheckbox({
                                            isSigned: false,
                                            id: record.id,
                                            checked: selectedIds.some(
                                                (idObj) =>
                                                    idObj.id === record.id &&
                                                    idObj.is_signed === false,
                                            ),
                                            can_cancel: record.can_cancel,
                                        });
                                    } else {
                                        let idToDelete = record.id;
                                        if (selected.is_signed === false) {
                                            setSelectedIds((prevItems) =>
                                                prevItems.filter((item) => item.id !== idToDelete),
                                            );
                                        }
                                    }
                                }}
                                icon={CloseOutlined}
                                checked={selectedIds.some(
                                    (idObj) => idObj.id === record.id && idObj.is_signed === false,
                                )}
                            />
                        )}
                    </div>
                </>
            ),
            key: 2,
        },
        {
            title: <IntlMessage id="letters.unsignedTable.startDate" />,
            dataIndex: "created_at",
            render: (text, record) => (
                <>
                    <div className={"d-inline"} style={{ justifyContent: "flex-start" }}>
                        <p className={"text"}>
                            {" "}
                            {format(new Date(record.created_at), "dd.MM.yyyy")}
                        </p>
                        <p style={{ color: "#366EF6" }}>{moment(record.created_at).fromNow()}</p>
                    </div>
                </>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, "created_at"),
            key: 3,
        },
        {
            title: "Субъект",
            dataIndex: ["users", 0, "first_name"],
            render: (text, record) => (
                <>
                    <div
                        className={"d-flex"}
                        onClick={() => showHideSecondCardFunction(record)}
                        style={{ cursor: "pointer" }}
                    >
                        <AvatarStatus size={40} src={record.users[0].icon} />
                        <div className="mt-2">
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
                </>
            ),
            key: 5,
        },
        {
            title: <IntlMessage id="letters.unsignedTable.documents" />,
            dataIndex: ["document_template", "name"],
            render: (text, record) => (
                <>
                    <div>
                        <div>
                            <DataText
                                displayType={"text"}
                                name={
                                    i18n.language === "ru"
                                        ? record.document_template.name
                                        : record.document_template.nameKZ
                                }
                            />
                        </div>
                    </div>
                </>
            ),
            sorter: (a, b) => {
                if (i18n.language === "ru")
                    return a.document_template.name.localeCompare(b.document_template.name);

                return a.document_template.nameKZ.localeCompare(b.document_template.nameKZ);
            },
            sortDirections: ["ascend", "descend"],
            key: 6,
        },
        {
            title: <IntlMessage id="letters.unsignedTable.more" />,
            dataIndex: "users",
            render: (text, record, index) => {
                return drawRowInfo(record, index);
            },
            key: 7,
        },
        {
            title: <IntlMessage id="letters.unsignedTable.role" />,
            dataIndex: ["last_step", "staff_function", "role", "name"],
            key: 8,
            render: (_, record) => (
                <div>
                    {i18n.language === "ru"
                        ? record?.last_step?.staff_function?.role?.name
                        : record?.last_step?.staff_function?.role?.nameKZ}
                </div>
            ),
            sorter: (a, b) => {
                if (i18n.language === "ru")
                    return a.last_step.staff_function.role.name.localeCompare(
                        b.last_step.staff_function.role.name,
                    );

                return a.last_step.staff_function.role.nameKZ.localeCompare(
                    b.last_step.staff_function.role.nameKZ,
                );
            },
            sortDirections: ["ascend", "descend"],
        },
    ];

    const keysToDelete = [4, 8, 7];

    const showSecondCardColumns = columns.filter((column) => !keysToDelete.includes(column.key));

    return (
        <div>
            <CommentCard
                onChildData={handleCheckBoxChangeAddComment}
                recordCheckbox={recordCheckbox}
            />
            <TableWithPagination
                initialPageSize={currentPageSize}
                isLoading={isLoading}
                dataSource={filteredUsers}
                initialPage={currentPage}
                columns={showSecondCard === true ? showSecondCardColumns : columns}
                fetchData={fetchData}
                saveCurrentPage={saveCurrentPageSettings}
                hasMore={hasNextPage}
                pagination={isNotification}
            />
        </div>
    );
};

export default UnsignedTable;
