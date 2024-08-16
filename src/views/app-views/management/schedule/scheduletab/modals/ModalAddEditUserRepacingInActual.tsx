import {QuestionCircleFilled} from '@ant-design/icons/lib/icons';
import {Form, Modal, notification, Select} from 'antd';
import {components} from 'API/types';
import React, {useEffect, useState} from 'react';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';
import {PrivateServices} from 'API';
import SelectPickerMenuService from "../../../../../../services/myInfo/SelectPickerMenuService";
import {getStaffDivisions} from "../../../../../../store/slices/myInfo/servicesSlice";
import {useAppDispatch, useAppSelector} from "../../../../../../hooks/useStore";
import {change} from "../../../../../../store/slices/schedule/staffDivisionSlice";
import {embedStaffUnitNode, embedStaffUnitNodeActual} from "../../../../../../utils/schedule/utils";

interface Props {
    staffUnit: components['schemas']['schemas__staff_unit__StaffUnitRead'];
    type: string;
    isOpen: boolean;
    onClose: () => void;
}


const ModalAddEditUserRepacingInActual = ({isOpen, onClose, staffUnit, type}: Props) => {
    const [form] = Form.useForm();
    const [choosedU, setChoosedU] = useState<string>();
    const [positionList, setPositionList] = useState([]);
    const [scrollingLength, setScrollingLength] = useState({skip: 0, limit: 10});
    const [searchText, setSearchText] = useState({});
    const [maxCount, setMaxCount] = useState(0);
    const dispatch = useAppDispatch();
    const actualStructure = useAppSelector((state) => state.staffScheduleSlice.data);
    const handleCancel = () => {
        form.resetFields();
        onClose()
    };

    useEffect(() => {
        if (type === 'edit' && staffUnit.user_replacing_id !== null) {
            const user_replacing = staffUnit.user_replacing?.father_name !== null ? {
                    value: staffUnit.user_replacing_id,
                    label: `${staffUnit.user_replacing?.last_name} ${staffUnit.user_replacing?.first_name} ${staffUnit.user_replacing?.father_name}`
                }
                :
                {
                    value: staffUnit.user_replacing_id,
                    label: `${staffUnit.user_replacing?.last_name} ${staffUnit.user_replacing?.first_name}`
                };
            setChoosedU(staffUnit.user_replacing_id);
            form.setFieldsValue({
                user_replacing
            })
        }
    }, [type, isOpen])


    const handleOk = async () => {
        await form.validateFields();
        if (choosedU === undefined) return;
        if (
            !staffUnit?.position ||
            !staffUnit.id ||
            !staffUnit.position_id ||
            !staffUnit.staff_division_id
        ) {
            notification.warn({message: 'Невозможно отредактировать'});
            return;
        }
        await PrivateServices.put('/api/v1/staff_unit/{id}/', {
            params: {
                path: {
                    id: staffUnit?.id,
                },
            },
            body: {
                position_id: staffUnit.position_id,
                user_replacing_id: choosedU
            }
        }).then(async () => {
            if(staffUnit?.id) {
                await PrivateServices.get('/api/v1/staff_unit/{id}/', {
                    params: {
                        path: {
                            id: staffUnit?.id,
                        },
                    }
                }).then((responce) => {
                    if (responce.data) {
                        dispatch(change(
                            embedStaffUnitNodeActual(
                                {...responce?.data},
                                staffUnit.staff_division_id,
                                actualStructure,
                            ),
                        ));
                        handleCancel();
                    }
                })
            }
        });
    };

    useEffect(() => {
        fetchOptions();
    }, [scrollingLength, searchText, isOpen]);

    const fetchOptions = async () => {
        const position_list = await fetchOptionsData(`/staff_unit/staff_division/${staffUnit?.staff_division_id}`, "position");
        if(staffUnit?.users && staffUnit?.users?.length > 0) {
            const filter_position_list = position_list.filter((item: {value: string, label: string}) => item.value !== staffUnit?.users?.[0]?.id);
            setPositionList(filter_position_list);
        } else {
            setPositionList(position_list);
        }
    };

    const handleSearch = (value: string, type: string) => {
        setSearchText((prevData) => ({...prevData, [type]: value}));
    };
    const handlePopupScroll = (e: any, type: string) => {
        const {target} = e;
        if (target.scrollTop + target.clientHeight === target.scrollHeight) {
            loadMoreOptions(type);
        }
    };
    const loadMoreOptions = (type: string) => {
        const newLimit = scrollingLength.limit + 10;
        const limitedLimit = newLimit > maxCount[type] ? maxCount[type] : newLimit;

        setScrollingLength({skip: scrollingLength.skip, limit: limitedLimit});
    };


    const fetchOptionsData = async (baseUrl: string, type: string) => {
        const response = await SelectPickerMenuService.getPosition({
            ...scrollingLength,
            search: searchText[type],
            baseUrl,
        });


        setMaxCount((prevData) => ({...prevData, [type]: response.total}));

        return response.objects.map((item) => ({
            value: item.users[0]?.id,
            label: <>{item.users[0]?.last_name} {item.users[0]?.first_name} {item.users[0]?.father_name}</>,
            objects: item.users[0]
        }));
    };


    const handlePosition = (e: any) => {
        setChoosedU(e);
    };


    return (
        <div>
            <Modal
                title={<IntlMessage id={'staffSchedule.modal.editInfoEmployeePosition'}/>}
                open={isOpen}
                okText={<IntlMessage id={'staffSchedule.save'}/>}
                cancelText={<IntlMessage id={'candidates.warning.cancel'}/>}
                onCancel={handleCancel}
                onOk={handleOk}
            >
                <Form
                    layout={'vertical'}
                    form={form}
                >
                    <Form.Item
                        label={
                            <>
                                <IntlMessage id={'staffSchedule.modal.employeeHoldingPosition'}/>
                                <QuestionCircleFilled
                                    style={{
                                        color: ' rgba(114, 132, 154, 0.4)',
                                        marginLeft: '5px',
                                    }}
                                />
                            </>
                        }
                        name="user_replacing"
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={'candidates.title.must'}/>,
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            style={{width: '100%'}}
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

export default ModalAddEditUserRepacingInActual;
