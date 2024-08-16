import { NodeDragEventParams } from "rc-tree/lib/contextTypes";
import { DataNode, EventDataNode } from "antd/lib/tree";
import {
    CaretDownOutlined,
    CaretRightOutlined,
    CopyTwoTone,
    DeleteTwoTone,
    ExclamationCircleOutlined,
    PlusCircleTwoTone,
    ProfileTwoTone,
} from "@ant-design/icons";
import { components } from "API/types";
import { Card, Col, Collapse, Modal, Row, Tooltip, Tree, Typography } from "antd";
import { CustomNode } from "components/layout-components/schedule/CustomNode";
import { DraggableIcon } from "components/layout-components/schedule/DraggableIcon";
import IntlMessage from "components/util-components/IntlMessage";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import { APP_PREFIX_PATH } from "configs/AppConfig";
import { useEdit } from "hooks/schedule/useEdit";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { concatBy, concatBySpace } from "utils/format/format";
import { objectToQueryString } from "utils/helpers/common";
import uuidv4 from "utils/helpers/uuid";
import { findSubDivisionNode, isStaffUnitInLastSubDivision } from "utils/schedule/utils";
import ModalAddStaffDiv from "../../modals/ModalAddStaffDiv";
import ModalConfirmDeleteCandidatePosition from "../../modals/ModalConfirmDeleteCandidatePosition";
import ModalConfirmDeletePosition from "../../modals/ModalConfirmDeletePosition";
import ModalDeleteStaffDivision from "../../modals/ModalDeleteStaffDivision";
import ModalDuplicateDivision from "../../modals/ModalDuplicateDivision";
import "./../tree.css";
import "./style.css";
import { ConfirmDrag } from "../../modals/ConfirmDrag";
import { TreeContext } from "../../../edit";
import { TreeContextTypes } from "../../../../../../../utils/format/interfaces";
import { PrivateServices } from "../../../../../../../API";
import { change } from "../../../../../../../store/slices/schedule/archiveStaffDivision";

const { TreeNode } = Tree;
const { Text } = Typography;
const { Panel } = Collapse;

const VerticalTree = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { duplicateStaffUnit } = useEdit();
    const dispatch = useAppDispatch();

    const staffListId = searchParams.get("staffListId");
    const mode = searchParams.get("mode");
    const type = searchParams.get("type");
    const staffDivisionID = searchParams.get("staffDivision");
    const staffUnitID = searchParams.get("staffUnit");

    const archiveStaffDivision = useAppSelector((state) => state.archiveStaffDivision.data);
    const loading = useAppSelector((state) => state.archiveStaffDivision.loading);
    const { setIsLoading } = useContext(TreeContext) as TreeContextTypes;

    const [isModalPosition, setShowModalPosition] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isModalWarningDeletePosition, setIsModalWarningDeletePosition] = useState(false);
    const [warningDelPosWithoutUser, setWarningDelPosWithoutUser] = useState(false);
    const [warningDelStaffDiv, setWarningDelStaffDiv] = useState(false);
    const [structure, setStructure] = useState<components["schemas"]["ArchiveStaffDivisionRead"][]>(
        [],
    );

    const [duplicatingStaffDivision, setDuplicatingStaffDivision] =
        useState<components["schemas"]["ArchiveStaffDivisionRead"]>();
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [chosenItem, setChosenItem] =
        useState<components["schemas"]["ArchiveStaffDivisionRead"]>();
    const [chosenItemStaffUnit, setChosenItemStaffUnit] =
        useState<components["schemas"]["ArchiveStaffUnitRead"]>();
    const [dragOptions, setDragOptions] = useState<
        NodeDragEventParams<DataNode> & {
            dragNode: EventDataNode<DataNode> & {
                type: string;
                id: string;
                staff_division_id: string;
            };
            dragNodesKeys: string[];
            dropPosition: number;
            dropToGap: boolean;
            node: EventDataNode<DataNode> & {
                id: string;
                type: string;
                staff_division_id: string;
            };
        }
    >();

    useEffect(() => {
        setStructure(archiveStaffDivision);
    }, [mode, archiveStaffDivision, staffListId]);

    useEffect(() => {
        if (structure.length !== 0) {
            dispatch(change(structure));
        }
    }, [structure]);

    const [isDragged, setIsDragged] = useState(false);

    const showModalPosition = (_type: "division" | "position") => {
        setShowModalPosition(true);
    };

    const removeStaffDivision = (item: components["schemas"]["ArchiveStaffDivisionRead"]) => {
        setChosenItem(item);
        setWarningDelStaffDiv(true);
    };

    const showModalWarningDeletePosition = (bool: boolean) => {
        setIsModalWarningDeletePosition(bool);
    };

    const showModalWarningDelPosWithoutUser = (bool: boolean) => {
        setWarningDelPosWithoutUser(bool);
    };

    const showModalWarningDelStaffDiv = (bool: boolean) => {
        setWarningDelStaffDiv(bool);
    };

    useEffect(() => {
        if (mode === "edit") {
            setIsEdit(true);
        }
    }, [mode, searchParams]);

    useEffect(() => {
        setIsLoading && setIsLoading(loading);
    }, [loading]);

    const removeStaffUnit = (item: components["schemas"]["ArchiveStaffUnitRead"]) => {
        setChosenItemStaffUnit(item);
        if (item.user) {
            showModalWarningDeletePosition(true);
        } else {
            showModalWarningDelPosWithoutUser(true);
        }
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

    const renderStaffUnitNode = (
        item: components["schemas"]["ArchiveStaffUnitRead"],
        i: number,
        parentIndex: number | string,
        staff_unit_id?: string,
    ) => {
        const isLast = isStaffUnitInLastSubDivision(item, archiveStaffDivision);
        const position = item?.position !== null
            ?
            item.position
            :
            item?.position===null && item?.actual_position!==null
            &&
            item.actual_position;

        return (
            <TreeNode
                selected={type === "staffUnit" && staffUnitID === item.id}
                title={
                    <Collapse style={{ backgroundColor: "white" }}>
                        <Panel
                            key={concatBy([0, parentIndex, i], "-")}
                            header={
                                <Row
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                    gutter={5}
                                >
                                    <Col xs={24} lg={18} style={{ width: "100%" }}>
                                        <div className="title-normal">
                                            {item?.actual_position !== null && item?.position !== null ? (
                                                <>
                                                    {LocalText.getName(item?.actual_position)}
                                                    &nbsp; (<IntlMessage id={"according.bill"} />
                                                    &nbsp;
                                                    {LocalText.getName(item.position)})
                                                </>
                                            ) : item?.actual_position === null && item?.position !== null ? (
                                                <>{LocalText.getName(item.position)}</>
                                            ) : item?.actual_position !== null && item?.position === null && (
                                                <>{LocalText.getName(item.actual_position)}</>
                                            )}
                                        </div>
                                        {
                                            <div className="title-mute">
                                                {LocalText.getName(position?.max_rank)}
                                            </div>
                                        }
                                    </Col>
                                    {!isLast && (
                                        <>
                                            <Col lg={2}>
                                                {findSubDivisionNode(
                                                    archiveStaffDivision,
                                                    item.staff_division_id,
                                                )?.parent_group_id !== null && (
                                                    <Tooltip
                                                        title={
                                                            <IntlMessage id="schedule.duplicate.position" />
                                                        }
                                                    >
                                                        <CopyTwoTone
                                                            style={{
                                                                minHeight: "30px",
                                                                minWidth: "17.88px",
                                                            }}
                                                            className="vertical-icon"
                                                            onClick={(event) => {
                                                                event.preventDefault();
                                                                duplicateStaffUnit(item);
                                                            }}
                                                        />
                                                    </Tooltip>
                                                )}
                                            </Col>
                                            <Col lg={2}>
                                                {item.id !==
                                                    findSubDivisionNode(
                                                        archiveStaffDivision,
                                                        item.staff_division_id,
                                                    )?.leader_id && (
                                                    <Tooltip
                                                        title={
                                                            <IntlMessage id="schedule.delete.position" />
                                                        }
                                                    >
                                                        <DeleteTwoTone
                                                            style={{
                                                                minHeight: "30px",
                                                                minWidth: "17.88px",
                                                            }}
                                                            className="vertical-icon"
                                                            twoToneColor="#FF4D4F"
                                                            onClick={(event) => {
                                                                event.preventDefault();
                                                                removeStaffUnit(item);
                                                            }}
                                                        />
                                                    </Tooltip>
                                                )}
                                            </Col>
                                        </>
                                    )}
                                </Row>
                            }
                        >
                            {item.user ? (
                                <Row
                                    style={{
                                        justifyContent: "space-between",
                                        flexWrap: "nowrap",
                                        alignItems: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            columnGap: "6px",
                                            flexWrap: "wrap",
                                        }}
                                        onClick={() => {
                                            if (isEdit) {
                                                const queryParams = {
                                                    "mode": "edit",
                                                    "type": "staffUnit",
                                                    "staffUnit": item.id,
                                                    "staffListId": staffListId,
                                                };
                                                navigate(
                                                    `${APP_PREFIX_PATH}/management/schedule/edit/?${objectToQueryString(
                                                        queryParams,
                                                    )}`,
                                                );
                                            }
                                        }}
                                    >
                                        <Col>
                                            <img
                                                src={item.user.icon}
                                                alt=""
                                                style={{
                                                    width: 30,
                                                    height: 30,
                                                    borderRadius: "50%",
                                                    objectFit: "cover",
                                                    objectPosition: "top",
                                                }}
                                            />
                                        </Col>
                                        <Col>
                                            <Row
                                                className="title-normal"
                                                style={{ whiteSpace: "nowrap" }}
                                            >
                                                {item.user.father_name === null
                                                    ? concatBySpace([
                                                          item.user.last_name,
                                                          item.user.first_name,
                                                      ])
                                                    : concatBySpace([
                                                          item.user.last_name,
                                                          item.user.first_name,
                                                          item.user.father_name,
                                                      ])}
                                            </Row>
                                            <Row
                                                className="title-mute"
                                                style={{ whiteSpace: "nowrap" }}
                                            >
                                                {item?.position?.category_code}
                                            </Row>
                                        </Col>
                                    </div>
                                    <Col lg={2}>
                                        <Tooltip
                                            title={
                                                <IntlMessage id="schedule.direct.personal.page" />
                                            }
                                        >
                                            <ProfileTwoTone
                                                onClick={() => {
                                                    if (item?.user?.id) {
                                                        showConfirmToNavigatePersonalData(
                                                            item?.user?.id,
                                                        );
                                                    }
                                                }}
                                            />
                                        </Tooltip>
                                    </Col>
                                </Row>
                            ) : (
                                <Row
                                    onClick={() => {
                                        if (isEdit) {
                                            const queryParams = {
                                                "mode": "edit",
                                                "type": "staffUnit",
                                                "staffUnit": item.id,
                                                "staffListId": staffListId,
                                            };
                                            navigate(
                                                `${APP_PREFIX_PATH}/management/schedule/edit/?${objectToQueryString(
                                                    queryParams,
                                                )}`,
                                            );
                                        }
                                    }}
                                >
                                    <Col lg={24}>
                                        <Row className="title-normal">
                                            <Text strong>
                                                <IntlMessage id={"staffSchedule.vacant"} />
                                            </Text>
                                        </Row>
                                    </Col>
                                </Row>
                            )}
                        </Panel>
                    </Collapse>
                }
                id={item.id}
                // @ts-expect-error Тип не передали, но принимает props
                staff_division_id={item.staff_division_id}
                type={"user"}
                staff_unit_id={staff_unit_id}
                key={`${item.id}-${item.staff_division_id}`}
                dataRef={item}
            />
        );
    };

    function collectPreviousIds(
        str:
            | components["schemas"]["ArchiveStaffDivisionRead"][]
            | components["schemas"]["ArchiveStaffDivisionChildRead"][]
            | components["schemas"]["ArchiveStaffDivisionChildRead"]["children"],
        id: string,
        collectedIds: string[],
    ): void {
        if (!str) return;
        for (const obj of str) {
            if (!obj) return;
            if ((obj as { id: string }).id === id) {
                collectedIds.push((obj as { id: string }).id);
                return;
            }
            if (
                (
                    obj as {
                        children:
                            | components["schemas"]["ArchiveStaffDivisionChildRead"][]
                            | components["schemas"]["ArchiveStaffDivisionChildRead"]["children"];
                    }
                ).children
            ) {
                if ((obj as { id: string }).id === undefined) return;
                collectedIds.push((obj as { id: string }).id);
                collectPreviousIds(
                    (
                        obj as {
                            children:
                                | components["schemas"]["ArchiveStaffDivisionChildRead"][]
                                | components["schemas"]["ArchiveStaffDivisionChildRead"]["children"];
                        }
                    ).children,
                    id,
                    collectedIds,
                );
                if (collectedIds.includes(id)) {
                    return;
                }
                collectedIds.pop();
            }
        }
    }

    const renderTreeNodes = (
        item: components["schemas"]["ArchiveStaffDivisionRead"],
        i: number,
        parentIndex: number | string | null,
    ) => {
        const updateChildrenRecursively = (
            items:
                | components["schemas"]["ArchiveStaffDivisionRead"][]
                | components["schemas"]["ArchiveStaffDivisionChildRead"][],
            id: string,
            newData: components["schemas"]["ArchiveStaffDivisionRead"],
        ):
            | components["schemas"]["ArchiveStaffDivisionRead"][]
            | components["schemas"]["ArchiveStaffDivisionChildRead"][] => {
            return (items as components["schemas"]["ArchiveStaffDivisionRead"][]).map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        children: newData.children,
                        staff_units: newData.staff_units,
                    };
                } else if (item.children) {
                    return {
                        ...item,
                        children: updateChildrenRecursively(item.children, id, newData),
                    };
                }
                return item;
            });
        };

        const handleClick = (id: string) => {
            if (setIsLoading !== undefined) {
                setIsLoading(true);
            }
            PrivateServices.get("/api/v1/archive_staff_division/{id}/", {
                params: { path: { id: id } },
            }).then((response) => {
                if (setIsLoading !== undefined) {
                    setIsLoading(false);
                }
                setStructure((prevStructure) => {
                    return prevStructure.map((child) => {
                        if (response.data !== undefined && child.children) {
                            const updatedStructure = updateChildrenRecursively(
                                child.children,
                                id,
                                response?.data,
                            );
                            return { ...child, children: updatedStructure };
                        }
                        return child;
                    });
                    return prevStructure;
                });
            });
            const collectedIds: string[] = [];
            collectPreviousIds(structure, id, collectedIds);
            setExpandedKeys(["parent", ...collectedIds]);
        };

        const handleIcon = (item: components["schemas"]["ArchiveStaffDivisionRead"]) => {
            if (
                item?.children === null &&
                item?.staff_units?.length === 0 &&
                item.parent_group_id !== null &&
                !Object.prototype.hasOwnProperty.call(item, "isLocal")
            ) {
                return (
                    <CaretRightOutlined
                        style={{ fontSize: "10px" }}
                        onClick={() => item.id !== undefined && handleClick(item?.id)}
                    />
                );
            }
            if (
                item?.children?.length === 0 &&
                item?.staff_units === null &&
                item.parent_group_id !== null &&
                !Object.prototype.hasOwnProperty.call(item, "isLocal")
            ) {
                return (
                    <CaretRightOutlined
                        style={{ fontSize: "10px" }}
                        onClick={() => item.id !== undefined && handleClick(item?.id)}
                    />
                );
            }
            if (
                item?.children?.length === 0 &&
                item?.staff_units?.length === 0 &&
                item.parent_group_id !== null &&
                !Object.prototype.hasOwnProperty.call(item, "isLocal")
            ) {
                return (
                    <CaretRightOutlined
                        style={{ fontSize: "10px" }}
                        onClick={() => item.id !== undefined && handleClick(item?.id)}
                    />
                );
            }
        };

        // const staff_units_head = item.staff_units?.filter(
        //     (staff_unit) => item.leader_id === staff_unit.id,
        // );
        // const staff_units = item.staff_units?.filter(
        //     (staff_unit) => item.leader_id !== staff_unit.id,
        // );
        // let combinedArray;
        // if (staff_units_head !== undefined && staff_units !== undefined) {
        //     combinedArray = staff_units_head.concat(staff_units);
        // }

        const sorted = () => {
            if (item.children) {
                const sortedChildren = item.children.slice();

                // Применяем копию метода sort() к скопированному массиву
                sortedChildren.sort(function (a, b) {
                    const divisionA = a.staff_division_number;
                    const divisionB = b.staff_division_number;

                    if (divisionA === null && divisionB === null) {
                        return 0;
                    }
                    if (divisionA === null || divisionA === 0) {
                        return 1; // Move objects with null or 0 staff_division_number to the bottom
                    }
                    if (divisionB === null || divisionB === 0) {
                        return -1;
                    }

                    // Handle undefined divisionB
                    if (divisionB === undefined || divisionA === undefined) {
                        return 1; // Move objects with undefined staff_division_number to the bottom
                    }

                    return divisionA - divisionB;
                });

                return sortedChildren;
            }
        };

        const sortedStaffUnit = () => {
            if (item.staff_units) {
                const sortedChildren = item.staff_units.slice();

                // Применяем копию метода sort() к скопированному массиву
                sortedChildren.sort(function (a, b) {
                    const divisionA =
                        a?.actual_position !== null && a?.position===null
                            ? a?.actual_position?.position_order
                            : a?.position?.position_order;
                    const divisionB =
                        b?.actual_position !== null && a?.position===null
                            ? b?.actual_position?.position_order
                            : b?.position?.position_order;

                    if (divisionA === null && divisionB === null) {
                        return 0;
                    }
                    if (divisionA === null || divisionA === 0) {
                        return 1; // Move objects with null or 0 staff_division_number to the bottom
                    }
                    if (divisionB === null || divisionB === 0) {
                        return -1;
                    }

                    // Handle undefined divisionB
                    if (divisionB === undefined || divisionA === undefined) {
                        return 1; // Move objects with undefined staff_division_number to the bottom
                    }

                    return divisionA - divisionB;
                });

                return sortedChildren.reverse();
            }
        };

        return (
            <>
                <TreeNode
                    // selected={type === 'staffDivision' && staffDivisionID === item.id}
                    title={
                        <Row
                            style={{
                                padding: "0 13px",
                                alignItems: "center",
                            }}
                            gutter={5}
                        >
                            <Col span={parentIndex !== null ? 16 : 20}>
                                <CustomNode item={item} />
                            </Col>
                            {item.parent_group_id === null && item?.children?.length ? (
                                <Col
                                    span={2}
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: "30px",
                                        height: "30px",
                                    }}
                                >
                                    <Tooltip
                                        title={
                                            <IntlMessage id="staffSchedule.modal.addDivisionOrPosition" />
                                        }
                                    >
                                        <PlusCircleTwoTone
                                            className="vertical-icon"
                                            onClick={(event) => {
                                                event.preventDefault();
                                                setChosenItem(item);
                                                showModalPosition("division");
                                            }}
                                        />
                                    </Tooltip>
                                </Col>
                            ) : null}
                            {item.parent_group_id !== null && (
                                <Col
                                    span={2}
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: "30px",
                                        height: "30px",
                                    }}
                                >
                                    <Tooltip
                                        title={
                                            <IntlMessage id="staffSchedule.modal.addDivisionOrPosition" />
                                        }
                                    >
                                        <PlusCircleTwoTone
                                            className="vertical-icon"
                                            onClick={(event) => {
                                                event.preventDefault();
                                                setChosenItem(item);
                                                showModalPosition("division");
                                            }}
                                        />
                                    </Tooltip>
                                </Col>
                            )}
                            {item.parent_group_id !== null && (
                                <>
                                    <Col
                                        span={2}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "30px",
                                            height: "30px",
                                        }}
                                    >
                                        <Tooltip title={<IntlMessage id="schedule.duplicate" />}>
                                            <CopyTwoTone
                                                className="vertical-icon"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    setDuplicatingStaffDivision(item);
                                                    setIsDuplicate(true);
                                                }}
                                            />
                                        </Tooltip>
                                    </Col>
                                    <Col
                                        span={2}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "30px",
                                            height: "30px",
                                        }}
                                    >
                                        <Tooltip title={<IntlMessage id="initiate.deleteAll" />}>
                                            <DeleteTwoTone
                                                className="vertical-icon"
                                                twoToneColor="#FF4D4F"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    removeStaffDivision(item);
                                                }}
                                            />
                                        </Tooltip>
                                    </Col>
                                </>
                            )}
                        </Row>
                    }
                    switcherIcon={handleIcon(item)}
                    key={item.id}
                    id={item?.id}
                    // @ts-expect-error type в его props не существует
                    type={"department"}
                    style={{
                        display: "flex",
                        flexDirection: "row",
                    }}
                >
                    {Array.isArray(item.staff_units) && item?.staff_units?.length
                        ? sortedStaffUnit()?.map((staff_unit, index) => {
                              return renderStaffUnitNode(
                                  staff_unit,
                                  index,
                                  concatBy([parentIndex, i], "-"),
                                  staff_unit.id,
                              );
                          })
                        : null}

                    {Array.isArray(item.children) && item.children.length
                        ? sorted()?.map((child, index) => {
                              return renderTreeNodes(
                                  child,
                                  index + (item?.staff_units?.length ?? 0),
                                  concatBy([parentIndex, i], "-"),
                              );
                          })
                        : null}
                </TreeNode>
            </>
        );
    };
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

    const handleExpand = (expandedKeys: React.Key[]) => {
        const keys = expandedKeys.map((key) => key.toString()); // Преобразуем значения в строку
        setExpandedKeys(keys);
    };

    return (
        <>
            <>
                <ConfirmDrag
                    options={dragOptions}
                    isOpen={isDragged}
                    onClose={() => {
                        setDragOptions(undefined);
                        setIsDragged(false);
                    }}
                />
                <ModalAddStaffDiv
                    key={uuidv4()}
                    isOpen={isModalPosition}
                    onClose={() => setShowModalPosition(false)}
                    staffDivision={chosenItem}
                />
                <ModalConfirmDeleteCandidatePosition
                    staffDivision={chosenItem}
                    openModal={isModalWarningDeletePosition}
                    modalCase={{ showModalWarningDeletePosition }}
                    staffUnit={chosenItemStaffUnit}
                />
                <ModalConfirmDeletePosition
                    key={chosenItemStaffUnit?.id}
                    openModal={warningDelPosWithoutUser}
                    modalCase={{ showModalWarningDelPosWithoutUser }}
                    staffUnit={chosenItemStaffUnit}
                    staffDivision={chosenItem}
                />
                <ModalDeleteStaffDivision
                    isOpen={warningDelStaffDiv}
                    onClose={() => showModalWarningDelStaffDiv(false)}
                    item={chosenItem}
                />
                <ModalDuplicateDivision
                    isOpen={isDuplicate}
                    onClose={() => setIsDuplicate(false)}
                    staffDivision={duplicatingStaffDivision}
                />
            </>
            <Card className="staffing-table-css">
                <Tree
                    defaultExpandedKeys={[
                        type === "staffDivision" ? staffDivisionID ?? "" : staffUnitID ?? "",
                    ]}
                    expandedKeys={expandedKeys}
                    onExpand={handleExpand}
                    onDrop={(options) => {
                        // @ts-expect-error Ошибка из-за того, что я переписал его типы когда создавал функцию onDrop
                        setDragOptions(options);
                        setIsDragged(true);
                    }}
                    switcherIcon={<CaretDownOutlined />}
                    draggable={{
                        icon: (
                            <span
                                style={{
                                    cursor: "grab",
                                }}
                            >
                                <DraggableIcon />
                            </span>
                        ),
                    }}
                    blockNode
                >
                    {/*<TreeNode*/}
                    {/*    title={*/}
                    {/*        <Row style={{ padding: '0 13px', alignItems: 'flex-end' }} gutter={5}>*/}
                    {/*            <Col span={22}>*/}
                    {/*                <CustomNode*/}
                    {/*                    item={{*/}
                    {/*                        description: {*/}
                    {/*                            name: '',*/}
                    {/*                            nameKZ: '',*/}
                    {/*                        },*/}
                    {/*                        id: undefined,*/}
                    {/*                        is_combat_unit: true,*/}
                    {/*                        name: 'Управление службой',*/}
                    {/*                        nameKZ: 'Қызметті басқару',*/}
                    {/*                        staff_units: [],*/}
                    {/*                        staff_list_id: staffListId ?? '',*/}
                    {/*                    }}*/}
                    {/*                />*/}
                    {/*            </Col>*/}
                    {/*        </Row>*/}
                    {/*    }*/}
                    {/*    key={'parent'}*/}
                    {/*    // @ts-expect-error type в его props не существует*/}
                    {/*    type="main"*/}
                    {/*>*/}
                    {archiveStaffDivision?.map((item, index) => renderTreeNodes(item, index, 0))}
                    {/*</TreeNode>*/}
                </Tree>
            </Card>
        </>
    );
};

export default VerticalTree;
