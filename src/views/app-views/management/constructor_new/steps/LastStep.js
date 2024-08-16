import { MenuOutlined } from "@ant-design/icons";
import { DndContext } from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Col, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import DocumentStaffFunctionTypeService from "services/DocumentStaffFunctionTypeService";
import ServiceStaffFunctionService from "services/ServiceStaffFunctionService";
import ServiceStaffUnits from "services/ServiceStaffUnits";
import {
    addUserInfo,
    changeUserKey,
    deleteUserInfo,
    getStepsDocumentById,
    showAddUser,
    spentEditUser,
} from "store/slices/newConstructorSlices/constructorNewSlice";
import AddUserModal from "../modals/AddUserModal";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import Spinner from "views/app-views/service/data/personal/common/Spinner";

const LastStep = () => {
    const { id } = useParams();
    const isDraft = window.location.href.includes("draft");

    const [tableData, setTableData] = useState([]);
    const [editUser, setEditUser] = useState([]);
    const [dropdownRoles, setDropdownRoles] = useState([]);
    const { usersArray, stepsArr, isLoading } = useSelector((state) => state.constructorNew);

    useEffect(() => {
        DocumentStaffFunctionTypeService.get_document_staff_type().then((r) => setDropdownRoles(r));
        fromId();
    }, [stepsArr]);

    useEffect(() => {
        if (!id) return;
        dispatch(getStepsDocumentById(id));
    }, [id]);

    const findAutoValue = async (step, positions) => {
        const nameMap = {
            1: "Куратор",
            2: "ПГС",
            3: "Начальники",
        };

        const positionMap = {
            true: { name: "Непосредственный начальник", id: true },
            false: { name: "Прямой начальник", id: false },
        };

        const isCategory =
            step?.category !== null &&
            positions?.every((position) => position?.id !== step?.category);
        const isSupervisor =
            positions.every((position) => position?.id !== step?.is_direct_supervisor) || false;

        if (isCategory) {
            return { name: nameMap[step.category], id: step.category };
        }

        if (isSupervisor) {
            return positionMap[step.is_direct_supervisor];
        }
    };

    const findSelectValue = async (stepsArr, positions) => {
        const id = await ServiceStaffFunctionService.get_staff_unit_id(stepsArr.staff_function_id);

        const currentStaffUnit = await ServiceStaffUnits.staff_units_id(id);
        const currentPosition = currentStaffUnit.actual_position
            ? currentStaffUnit.actual_position
            : currentStaffUnit.position;

        if (positions.length !== 0) {
            for (let item of positions) {
                if (item.id !== stepsArr) {
                    return { name: currentPosition.name, id: currentPosition.id, unitId: id };
                }
            }
        } else {
            return { name: currentPosition.name, id: currentPosition.id, unitId: id };
        }
    };

    const fromId = async () => {
        if (id && id.length > 0 && stepsArr) {
            let positions = [];
            let tableArray = [];

            for (let i = 0; i < stepsArr.length; i++) {
                if (stepsArr[i].category == null && stepsArr[i].is_direct_supervisor == null) {
                    const item = await findSelectValue(stepsArr[i], positions);
                    positions.push(item);
                } else {
                    const item = await findAutoValue(stepsArr[i], positions);
                    positions.push(item);
                }
            }

            for (let i = 0; i < stepsArr.length; i++) {
                if (positions[i]) {
                    if (positions[i].position !== undefined) {
                        tableArray.push({
                            key: stepsArr[i].staff_function.priority,
                            position: positions[i].name,
                            positionId: positions[i].id,
                            role: stepsArr[i].staff_function.role.name,
                            roleId: stepsArr[i].staff_function.role.id,
                            unitId: positions[i].unitId,
                        });
                    } else {
                        tableArray.push({
                            key: stepsArr[i].staff_function.priority,
                            position: positions[i].name,
                            positionId: positions[i].id,
                            role: stepsArr[i].staff_function.role.name,
                            roleId: stepsArr[i].staff_function.role.id,
                        });
                    }
                }
            }

            setTableData(tableArray);

            for (let item of tableArray) {
                dispatch(addUserInfo(item));
            }
        }
    };

    useEffect(() => {
        if (id === undefined) {
            setTableData(usersArray);
        }
    }, [usersArray]);

    const dispatch = useDispatch();

    const columns = [
        {
            key: "index",
        },
        {
            title: IntlMessageText.getText({ id: "post" }),
            dataIndex: "position",
            key: "position",
            render: (_, record) =>
                record.beforeRows === undefined ? (
                    record.position
                ) : (
                    <p style={{ color: "#72849A", margin: "auto 20%", width: "100%" }}>
                        <IntlMessage id={"constructor.edit.table"} />,
                    </p>
                ),
        },
        {
            title: IntlMessageText.getText({ id: "letters.unsignedTable.role" }),
            dataIndex: "role",
            key: "role",
            filters:
                dropdownRoles.length > 0
                    ? dropdownRoles.map((el) => {
                          return { text: el.name, value: el.name };
                      })
                    : null,
            onFilter: (value, record) => record.role.indexOf(value) === 0,
            render: (_, record) => (
                <div>{record?.beforeRows === undefined ? record?.role : ""}</div>
            ),
        },
        {
            title: IntlMessageText.getText({ id: "letters.historytable.actions" }),
            dataIndex: "",
            key: "x",
            render: (_, val) =>
                val?.beforeRows === undefined ? (
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <button
                            style={{
                                color: "#366EF6",
                                marginRight: "2%",
                                background: "none",
                                border: "none",
                                cursor: `${id !== undefined ? "not-allowed" : "pointer"}`,
                            }}
                            onClick={() => changeRow(val)}
                            disabled={id !== undefined}
                        >
                            <IntlMessage id={"constructor.edit"} />
                        </button>
                        <div
                            style={{
                                width: 1,
                                height: 15,
                                border: "1px solid #E6EBF1",
                                marginTop: "1%",
                            }}
                        ></div>
                        <button
                            style={{
                                color: "red",
                                marginLeft: "2%",
                                background: "none",
                                border: "none",
                                cursor: `${id !== undefined ? "not-allowed" : "pointer"}`,
                            }}
                            onClick={() => deleteRow(val)}
                            disabled={id !== undefined}
                        >
                            <IntlMessage id={"constructor.delete"} />
                        </button>
                    </div>
                ) : (
                    ""
                ),
        },
    ];

    const Row = ({ children, ...props }) => {
        const {
            attributes,
            listeners,
            setNodeRef,
            setActivatorNodeRef,
            transform,
            transition,
            isDragging,
        } = useSortable({
            id: props["data-row-key"],
        });

        const style = {
            ...props.style,
            transform: CSS.Transform.toString(
                transform && {
                    ...transform,
                    scaleY: 1,
                },
            )?.replace(/translate3d\(([^,]+),/, "translate3d(0,"),
            transition,
            ...(isDragging
                ? {
                      position: "relative",
                      zIndex: 10,
                  }
                : {}),
        };

        return (
            <tr {...props} ref={setNodeRef} style={style} {...attributes}>
                {React.Children.map(children, (child) => {
                    if (child.key === "sort") {
                        return React.cloneElement(child, {
                            children: (
                                <MenuOutlined
                                    ref={setActivatorNodeRef}
                                    style={{
                                        touchAction: "none",
                                        cursor: "move",
                                    }}
                                    {...listeners}
                                />
                            ),
                        });
                    }
                    return child;
                })}
            </tr>
        );
    };

    const addNewUser = () => {
        dispatch(showAddUser(true));
    };

    const deleteRow = (val) => {
        dispatch(deleteUserInfo(val));
    };

    const changeRow = (e) => {
        // dispatch(deleteUserInfo(e));
        dispatch(showAddUser(true));

        dispatch(spentEditUser(e));
    };

    const onDragEnd = ({ active, over }) => {
        if (active.id !== 1 && active.id !== 100 && active.id !== -1) {
            if (over.id !== 1 && over.id !== 100 && over.id !== -1) {
                if (active.id !== over?.id) {
                    dispatch(changeUserKey({ from: active.id, to: over?.id }));
                    setTableData((previous) => {
                        const activeIndex = previous.findIndex((i) => i.key === active.id);
                        const overIndex = previous.findIndex((i) => i.key === over?.id);
                        return arrayMove(previous, activeIndex, overIndex);
                    });
                }
            }
        }
    };

    if (isLoading) return <Spinner />;

    return (
        <div>
            <AddUserModal edit={editUser} />
            <Col style={{ display: "flex", justifyContent: "end", marginBottom: "1%" }}>
                <Button type="primary" onClick={addNewUser} disabled={id && !isDraft}>
                    <IntlMessage id={"constructor.addParticipant"} />
                </Button>
            </Col>
            {tableData && tableData.length > 0 ? (
                <DndContext onDragEnd={onDragEnd}>
                    <SortableContext
                        items={tableData.map((i, index) => index)}
                        strategy={verticalListSortingStrategy}
                    >
                        <Table
                            components={{
                                body: {
                                    row: Row,
                                },
                            }}
                            rowKey="index"
                            pagination={{
                                showSizeChanger: true,
                                pageSizeOptions: ["5", "10", "20", "30"],
                            }}
                            columns={columns}
                            dataSource={
                                id !== undefined
                                    ? [
                                          {
                                              beforeRows: "newColumn",
                                          },
                                          ...tableData,
                                      ]
                                    : tableData
                            }
                        />
                    </SortableContext>
                </DndContext>
            ) : (
                <Table />
            )}
        </div>
    );
};

export default LastStep;
