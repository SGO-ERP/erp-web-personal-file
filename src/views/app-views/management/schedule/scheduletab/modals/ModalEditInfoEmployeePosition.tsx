import { QuestionCircleFilled } from "@ant-design/icons/lib/icons";
import { Form, message, Modal, notification, Select } from "antd";
import { components } from "API/types";
import React, { useEffect, useState } from "react";
import { change } from "store/slices/schedule/archiveStaffDivision";
import { embedStaffUnitNode, findSubDivisionNode } from "utils/schedule/utils";
import IntlMessage from "../../../../../../components/util-components/IntlMessage";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/useStore";
import ListUsers from "../ListUsers";
import { PrivateServices } from "API";
import {
    addRemoteStaffUnit,
    editLocalStaffUnit,
    editRemoteStaffUnit,
} from "store/slices/schedule/Edit/staffUnit";
import SelectPickerMenuService from "../../../../../../services/myInfo/SelectPickerMenuService";

interface Props {
    modalCase: any;
    staffUnit: components["schemas"]["ArchiveStaffUnitRead"];
    openModal: any;
    whoIs: string;
    type: string;
    // staffDivision: components['schemas']['ArchiveStaffDivisionRead'];
}

const ModalEditInfoEmployeePosition = ({ modalCase, openModal, staffUnit, whoIs, type }: Props) => {
    const [form] = Form.useForm();
    const archiveStaffDivision = useAppSelector((state) => state.archiveStaffDivision.data);
    const [choosedU, setChoosedU] = useState<string>();
    const REMOTE_archiveStaffUnit = useAppSelector((state) => state.editArchiveStaffUnit.remote);
    const dispatch = useAppDispatch();
    const [positionList, setPositionList] = useState([]);
    const [scrollingLength, setScrollingLength] = useState({ skip: 0, limit: 10 });
    const [searchText, setSearchText] = useState({});
    const [maxCount, setMaxCount] = useState(0);

    const handleCancel = () => {
        form.resetFields();
        modalCase.showModalEmployeePosition(false);
    };

    useEffect(() => {
        if (type === "edit" && staffUnit.user_replacing_id !== null) {
            const user_replacing =
                staffUnit.user_replacing?.father_name !== null
                    ? {
                          value: staffUnit.user_replacing_id,
                          label: `${staffUnit.user_replacing?.last_name} ${staffUnit.user_replacing?.first_name} ${staffUnit.user_replacing?.father_name}`,
                      }
                    : {
                          value: staffUnit.user_replacing_id,
                          label: `${staffUnit.user_replacing?.last_name} ${staffUnit.user_replacing?.first_name}`,
                      };
            setChoosedU(staffUnit.user_replacing_id);
            form.setFieldsValue({
                user_replacing,
            });
        }
    }, [type, modalCase]);

    const handleOk = async () => {
        await form.validateFields();
        const foundStaffDivision = findSubDivisionNode(
            archiveStaffDivision,
            staffUnit.staff_division_id,
        );
        if (choosedU === undefined) return;
        const position = staffUnit?.actual_position
            ? staffUnit?.actual_position
            : staffUnit?.position;
        PrivateServices.get("/api/v1/users/{id}/", {
            params: {
                path: {
                    id: choosedU,
                },
            },
        })
            .then((response) => {
                if (!response.data) return;
                const user = response.data;
                const replacing = {
                    ...(whoIs === "user_id"
                        ? {
                              user_id: user?.id,
                              user: user,
                          }
                        : {
                              user_replacing_id: user?.id,
                              user_replacing: user,
                          }),
                };
                if (
                    !position ||
                    !staffUnit.id ||
                    !staffUnit.position_id ||
                    !staffUnit.staff_division_id
                ) {
                    notification.warn({ message: "Невозможно отредактировать" });
                    return;
                }
                if (position?.id) {
                    if (Object.prototype.hasOwnProperty.call(staffUnit, "isLocal")) {
                        dispatch(
                            editLocalStaffUnit({
                                ...staffUnit,
                                ...replacing,
                                staff_functions: staffUnit.staff_functions,
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
                                            ...replacing,
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
                                    ...replacing,
                                    id: staffUnit.id,
                                    position_id: staffUnit.position_id,
                                    position: position,
                                    staff_division_id: staffUnit.staff_division_id,
                                }),
                            );
                        } else {
                            dispatch(
                                addRemoteStaffUnit({
                                    ...staffUnit,
                                    ...replacing,
                                    id: staffUnit.id,
                                    position_id: staffUnit.position_id,
                                    position: position,
                                    staff_division_id: staffUnit.staff_division_id,
                                }),
                            );
                        }

                        if (foundStaffDivision)
                            dispatch(
                                change(
                                    embedStaffUnitNode(
                                        {
                                            ...staffUnit,
                                            ...replacing,
                                        },
                                        foundStaffDivision,
                                        archiveStaffDivision,
                                    ),
                                ),
                            );
                    }
                }
            })
            .finally(() => {
                form.resetFields();
                modalCase.showModalEmployeePosition(false);
            });
    };

    useEffect(() => {
        fetchOptions();
    }, [scrollingLength, searchText, modalCase]);

    const fetchOptions = async () => {
        const position_list = await fetchOptionsData(
            `/archive_staff_unit/staff_division/${staffUnit?.staff_division_id}`,
            "position",
        );
        if (staffUnit?.user) {
            const filter_position_list = position_list.filter(
                (item: { value: string; label: string }) => item.value !== staffUnit?.user?.id,
            );
            setPositionList(filter_position_list);
        } else {
            setPositionList(position_list);
        }
    };

    const handleSearch = (value: string, type: string) => {
        setSearchText((prevData) => ({ ...prevData, [type]: value }));
    };
    const handlePopupScroll = (e: any, type: string) => {
        const { target } = e;
        if (target.scrollTop + target.clientHeight === target.scrollHeight) {
            loadMoreOptions(type);
        }
    };
    const loadMoreOptions = (type: string) => {
        const newLimit = scrollingLength.limit + 10;
        const limitedLimit = newLimit > maxCount[type] ? maxCount[type] : newLimit;

        setScrollingLength({ skip: scrollingLength.skip, limit: limitedLimit });
    };

    const fetchOptionsData = async (baseUrl: string, type: string) => {
        const response = await SelectPickerMenuService.getPosition({
            ...scrollingLength,
            search: searchText[type],
            baseUrl,
        });

        setMaxCount((prevData) => ({ ...prevData, [type]: response.total }));

        return response.objects
            .filter((res) => res.user !== null)
            .map((item) => ({
                value: item.user?.id,
                label: (
                    <>
                        {item.user?.last_name} {item.user?.first_name} {item.user?.father_name}
                    </>
                ),
            }));
    };

    const handlePosition = (e: any) => {
        setChoosedU(e);
    };

    if (!openModal) return <></>;

    return (
        <div>
            <Modal
                title={<IntlMessage id={"staffSchedule.modal.editInfoEmployeePosition"} />}
                open={openModal}
                okText={<IntlMessage id={"staffSchedule.save"} />}
                cancelText={<IntlMessage id={"candidates.warning.cancel"} />}
                onCancel={handleCancel}
                onOk={handleOk}
            >
                <Form layout={"vertical"} form={form}>
                    <Form.Item
                        label={
                            <>
                                <IntlMessage id={"staffSchedule.modal.employeeHoldingPosition"} />
                                <QuestionCircleFilled
                                    style={{
                                        color: " rgba(114, 132, 154, 0.4)",
                                        marginLeft: "5px",
                                    }}
                                />
                            </>
                        }
                        name="user_replacing"
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={"candidates.title.must"} />,
                            },
                        ]}
                    >
                        {/*<ListUsers*/}
                        {/*    filtered={[staffUnit.user_id]}*/}
                        {/*    ids={choosedU}*/}
                        {/*    setIds={setChoosedU}*/}
                        {/*/>*/}
                        <Select
                            showSearch
                            style={{ width: "100%" }}
                            onChange={handlePosition}
                            options={positionList}
                            filterOption={(inputValue, option) =>
                                option?.label?.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                            }
                            onSearch={(e) => handleSearch(e, "position")}
                            onPopupScroll={(e) => handlePopupScroll(e, "position")}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ModalEditInfoEmployeePosition;
