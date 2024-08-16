import {
    CaretDownOutlined,
    CaretRightOutlined,
    ProfileTwoTone,
    SettingTwoTone,
} from "@ant-design/icons";
import { components } from "API/types";
import { Card, Col, Collapse, Row, Spin, Tooltip, Tree, Typography } from "antd";
import { CustomNode } from "components/layout-components/schedule/CustomNode";
import IntlMessage from "components/util-components/IntlMessage";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import { APP_PREFIX_PATH } from "configs/AppConfig";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { concatBy, concatBySpace } from "utils/format/format";
import "./tree.css";
import { objectToQueryString } from "utils/helpers/common";
import {
    change,
    getStaffDivision,
    getStaffDivisionByDiv,
} from "store/slices/schedule/staffDivisionSlice";
import { PrivateServices } from "../../../../../../API";
import ModalChangeLevelAccess from "../modals/ModalChangeLevelAccess";
import { PERMISSION } from "constants/permission";

const { TreeNode } = Tree;
const { Text } = Typography;
const { Panel } = Collapse;

const VerticalTree = () => {
    const [searchParams] = useSearchParams();
    const mode = searchParams.get("mode");
    const type = searchParams.get("type");
    const staffListId = searchParams.get("staffListId");
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const actualStructure = useAppSelector((state) => state.staffScheduleSlice.data);

    const [structure, setStructure] = useState<components["schemas"]["StaffDivisionRead"][]>([]);
    const [loading, setLoading] = useState(false);

    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const profile = useAppSelector((state) => state.profile.data);

    const canSeeSchedule = myPermissions?.includes(PERMISSION.VIEW_STAFF_LIST);
    const canEditSchedule = myPermissions?.includes(PERMISSION.STAFF_LIST_EDITOR);
    // const canSeeScheduleOwnDep = myPermissions?.includes('Просмотр своего отдела в штатном расписании');

    useEffect(() => {
        setStructure(actualStructure);
    }, [mode, actualStructure, staffListId]);

    useEffect(() => {
        if (structure.length !== 0) {
            dispatch(change(structure));
        }
    }, [structure]);

    const staffDivisionID = searchParams.get("staffDivision");
    const staffUnitID = searchParams.get("staffUnit");

    const [isViewSigned, setIsViewSigned] = useState(mode === "signed");

    useEffect(() => {
        mode === "signed" && setIsViewSigned(true);
    }, [mode]);

    useEffect(() => {
        if (canSeeSchedule) {
            dispatch(
                getStaffDivision({
                    query: {},
                }),
            );
        } else {
            if (profile && profile.staff_unit && profile.staff_unit.staff_division_id) {
                dispatch(
                    getStaffDivisionByDiv({
                        path: { id: profile.staff_unit.staff_division_id },
                    }),
                );
            }
        }
    }, [profile, canSeeSchedule]);

    const renderStaffUnitNode = (
        item: components["schemas"]["schemas__staff_division__StaffUnitRead"],
        i: number,
        parentIndex: number | string,
        staff_unit_id?: string,
    ) => {
        const position = item.actual_position ? item.actual_position : item.position;

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
                                    <Col xs={24} style={{ width: "100%" }}>
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
                                        {item?.actual_position !== null && item?.position !== null ? (
                                            <div className="title-mute">
                                                {LocalText.getName(item?.position?.max_rank)}
                                            </div>
                                        ) : item?.actual_position === null && item?.position !== null ? (
                                            <div className="title-mute">
                                                {LocalText.getName(item?.position?.max_rank)}
                                            </div>
                                        ) : item?.actual_position !== null && item?.position === null && (
                                            <div className="title-mute">
                                                {LocalText.getName(item?.actual_position?.max_rank)}
                                            </div>
                                        )}
                                    </Col>
                                </Row>
                            }
                        >
                            {Array(item.users) && item.users?.length ? (
                                <Row
                                    style={{
                                        justifyContent: "space-between",
                                        flexWrap: "nowrap",
                                        alignItems: "center",
                                    }}
                                >
                                    <Col xs={18}>
                                        <div
                                            style={{
                                                display: "flex",
                                                columnGap: "6px",
                                                flexWrap: "wrap",
                                            }}
                                            onClick={() => {
                                                const queryParams = {
                                                    "mode": mode,
                                                    "type": "staffUnit",
                                                    "staffUnit": item.id,
                                                    "staffListId": staffListId,
                                                };
                                                navigate(
                                                    `${APP_PREFIX_PATH}/management/schedule/history/?${objectToQueryString(
                                                        queryParams,
                                                    )}`,
                                                );
                                            }}
                                        >
                                            <Col>
                                                <img
                                                    src={item?.users[0]?.icon || ""}
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
                                                    {item.users[0].father_name === null
                                                        ? concatBySpace([
                                                              item.users[0].last_name,
                                                              item.users[0].first_name,
                                                          ])
                                                        : concatBySpace([
                                                              item.users[0].last_name,
                                                              item.users[0].first_name,
                                                              item.users[0].father_name,
                                                          ])}
                                                </Row>
                                                <Row
                                                    className="title-mute"
                                                    style={{ whiteSpace: "nowrap" }}
                                                >
                                                    {position?.category_code}
                                                </Row>
                                            </Col>
                                        </div>
                                    </Col>
                                    <Col xs={2}>
                                        <Tooltip
                                            title={
                                                <IntlMessage id="schedule.direct.personal.page" />
                                            }
                                        >
                                            <Link
                                                to={`${APP_PREFIX_PATH}/duty/data/${item.users[0].id}`}
                                            >
                                                <ProfileTwoTone
                                                    style={{
                                                        minHeight: "30px",
                                                        minWidth: "17.88px",
                                                    }}
                                                    className="vertical-icon"
                                                />
                                            </Link>
                                        </Tooltip>
                                    </Col>
                                    {canEditSchedule && (
                                        <Col xs={2}>
                                            <Tooltip title={<IntlMessage id="schedule.setting" />}>
                                                <SettingTwoTone
                                                    style={{
                                                        minHeight: "30px",
                                                        minWidth: "17.88px",
                                                    }}
                                                    className="vertical-icon"
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        setChosenItemStaffUnit(item);
                                                        setchangeLevelAccess(true);
                                                    }}
                                                />
                                            </Tooltip>
                                        </Col>
                                    )}
                                </Row>
                            ) : (
                                <Row
                                    onClick={() => {
                                        const queryParams = {
                                            "mode": mode,
                                            "type": "staffUnit",
                                            "staffUnit": item.id,
                                            "staffListId": staffListId,
                                        };
                                        navigate(
                                            `${APP_PREFIX_PATH}/management/schedule/${
                                                isViewSigned ? "edit/" : "history/"
                                            }?${objectToQueryString(queryParams)}`,
                                        );
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
                key={item.id}
                dataRef={item}
            />
        );
    };

    function collectPreviousIds(
        str:
            | components["schemas"]["StaffDivisionRead"][]
            | components["schemas"]["StaffDivisionChildRead"][]
            | components["schemas"]["StaffDivisionChildRead"]["children"],
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
                            | components["schemas"]["StaffDivisionChildRead"][]
                            | components["schemas"]["StaffDivisionChildRead"]["children"];
                    }
                ).children
            ) {
                if ((obj as { id: string }).id === undefined) return;
                collectedIds.push((obj as { id: string }).id);
                collectPreviousIds(
                    (
                        obj as {
                            children:
                                | components["schemas"]["StaffDivisionChildRead"][]
                                | components["schemas"]["StaffDivisionChildRead"]["children"];
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
        item: components["schemas"]["StaffDivisionRead"],
        i: number,
        parentIndex: number | string | null,
    ) => {
        const updateChildrenRecursively = (
            items:
                | components["schemas"]["StaffDivisionRead"][]
                | components["schemas"]["StaffDivisionChildRead"][],
            id: string,
            newData: components["schemas"]["StaffDivisionRead"],
        ):
            | components["schemas"]["StaffDivisionRead"][]
            | components["schemas"]["StaffDivisionChildRead"][] => {
            return (items as components["schemas"]["StaffDivisionRead"][]).map((item) => {
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
            setLoading(true);
            PrivateServices.get("/api/v1/staff_division/schedule/{id}/", {
                params: { path: { id: id } },
            }).then((response) => {
                setLoading(false);
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

        const handleIcon = (item: components["schemas"]["StaffDivisionRead"]) => {
            if (item?.children === null && item?.staff_units?.length === 0) {
                return (
                    <CaretRightOutlined
                        style={{ fontSize: "10px" }}
                        onClick={() => item.id !== undefined && handleClick(item?.id)}
                    />
                );
            }
            if (item?.children?.length === 0 && item?.staff_units === null) {
                return (
                    <CaretRightOutlined
                        style={{ fontSize: "10px" }}
                        onClick={() => item.id !== undefined && handleClick(item?.id)}
                    />
                );
            }
            if (item?.children?.length === 0 && item?.staff_units?.length === 0) {
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
                    selected={type === "staffDivision" && staffDivisionID === item.id}
                    title={
                        <Row
                            style={{
                                padding: "0 13px",
                                alignItems: "center",
                            }}
                            gutter={5}
                        >
                            <Col span={parentIndex !== null ? 18 : 22}>
                                <CustomNode item={item} />
                            </Col>
                        </Row>
                    }
                    key={item.id}
                    id={item?.id}
                    switcherIcon={handleIcon(item)}
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
    const [changeLevelAccess, setchangeLevelAccess] = useState<boolean>(false);
    const [chosenItemStaffUnit, setChosenItemStaffUnit] =
        useState<components["schemas"]["schemas__staff_division__StaffUnitRead"]>();

    const handleExpand = (expandedKeys: React.Key[]) => {
        const keys = expandedKeys.map((key) => key.toString()); // Преобразуем значения в строку
        setExpandedKeys(keys);
    };

    return (
        <Card className="staffing-table-css">
            <Spin spinning={loading}>
                {chosenItemStaffUnit && (
                    <ModalChangeLevelAccess
                        isOpen={changeLevelAccess}
                        onClose={() => setchangeLevelAccess(false)}
                        chosenItemStaffUnit={chosenItemStaffUnit}
                    />
                )}
                <Tree
                    // defaultExpandedKeys={['0-0-0-0']}
                    // onDrop={isEdit && onDrop}
                    expandedKeys={expandedKeys}
                    onExpand={handleExpand}
                    switcherIcon={<CaretDownOutlined />}
                    blockNode
                >
                    {canSeeSchedule
                        ? // <TreeNode
                          //     title={
                          //         <Row
                          //             style={{ padding: '0 13px', alignItems: 'flex-end' }}
                          //             gutter={5}
                          //         >
                          //             <Col span={22}>
                          //                 <CustomNode
                          //                     item={{
                          //                         description: {
                          //                             name: '',
                          //                             nameKZ: '',
                          //                         },
                          //                         id: undefined,
                          //                         is_combat_unit: true,
                          //                         name: 'Управление службой',
                          //                         nameKZ: 'Қызметті басқару',
                          //                         staff_units: [],
                          //                         staff_list_id: staffListId ?? '',
                          //                     }}
                          //                 />
                          //             </Col>
                          //         </Row>
                          //     }
                          //     key={'parent'}
                          //     // @ts-expect-error type в его props не существует
                          //     type="main"
                          // >
                          structure?.map((item, index) => renderTreeNodes(item, index, 0))
                        : // </TreeNode>
                          structure?.map((item, index) => renderTreeNodes(item, index, 0))}
                </Tree>
            </Spin>
        </Card>
    );
};
export default VerticalTree;
