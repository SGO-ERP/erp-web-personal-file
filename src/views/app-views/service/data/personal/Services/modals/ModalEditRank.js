import { Button, Checkbox, Col, DatePicker, Form, Input, Modal, Row, Select } from 'antd';
import IntlMessage, { IntlMessageText } from 'components/util-components/IntlMessage';
import { LocalText } from 'components/util-components/LocalizationText/LocalizationText';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import SelectPickerMenuService from 'services/myInfo/SelectPickerMenuService';
import UsersService from 'services/myInfo/UsersService';
import { addFieldValue, replaceByPath } from 'store/slices/myInfo/myInfoSlice';
import { deleteByPath } from 'store/slices/myInfo/servicesSlice';
import { disabledDate } from 'utils/helpers/futureDateHelper';
import ServicesService from '../../../../../../../services/myInfo/ServicesService';
import '../../Education/styleModals.css';

export default function ModalEditRank({ isOpen, onClose, rank }) {
    const [scrollingLength, setScrollingLength] = useState({ skip: 0, limit: 10_000 });
    const [searchText, setSearchText] = useState({});
    const [maxCount, setMaxCount] = useState(0);

    const [formattedRanks, setFormattedRanks] = useState([]);
    const [usersOptions, setUsersOptions] = useState([]);
    const [source, setSource] = useState('');

    const [filesChanged, setFilesChanged] = useState(false);
    const [checkbox, setCheckbox] = useState(false);

    const [form] = Form.useForm();
    const dispatch = useDispatch();

    useEffect(() => {
        fetchOptions();
    }, [scrollingLength, searchText, isOpen]);

    const fetchOptionsData = async (baseUrl, type) => {
        const response = await SelectPickerMenuService.getEducation({
            ...scrollingLength,
            search: searchText[type],
            baseUrl,
        });

        setMaxCount((prevData) => ({ ...prevData, [type]: response.total }));

        if (type === 'rank_id') {
            return response.objects.map((item) => ({
                value: item.id,
                label: LocalText.getName(item),
                object: item,
            }));
        } else {
            return response.users.map((user) => ({
                value: user.id,
                label: `${user.first_name} ${user.last_name}${
                    user.father_name ? ' ' + user.father_name : ''
                }`,
            }));
        }
    };

    const fetchOptions = async () => {
        const rankOptions = await fetchOptionsData('/ranks', 'rank_id');
        setFormattedRanks(rankOptions);
    };

    const loadMoreOptions = (type) => {
        const newLimit = scrollingLength.limit + 10;
        const limitedLimit = newLimit > maxCount[type] ? maxCount[type] : newLimit;

        setScrollingLength({ skip: scrollingLength.skip, limit: limitedLimit });
    };

    const handlePopupScroll = (e, type) => {
        const { target } = e;
        if (target.scrollTop + target.clientHeight === target.scrollHeight) {
            loadMoreOptions(type);
        }
    };

    const handleSearch = (value, type) => {
        setSearchText((prevData) => ({ ...prevData, [type]: value }));
    };

    const findSelectOption = async (id, type, setOptions, options) => {
        let response;
        let withoutFather;
        let fullName;
        if (type === 'user') {
            response = UsersService.get_user_by_id(id);
            withoutFather = response.last_name + ' ' + response.first_name;
            fullName = response.father_name
                ? withoutFather + ' ' + response.father_name
                : withoutFather;
        } else {
            response = ServicesService.get_rank_id(id);
        }

        setOptions((prevData) => [
            ...new Set(prevData),
            {
                value: response.id,
                label: type === 'user' ? fullName : LocalText.getName(response),
                object: response,
            },
        ]);
    };

    // заполнение полей в форуме
    useEffect(() => {
        form.resetFields();
        findSelectOption(rank.rank_id, 'rank', setFormattedRanks, formattedRanks);
        findSelectOption(rank.rank_assigned_by, 'user', setUsersOptions, usersOptions);

        const values = {
            rank_id: rank.rank_id,
            document_number: rank.document_number,
            date_from: moment(rank.date_from),
            rank_assigned_by: rank.rank_assigned_by,
        };
        setCheckbox(rank.early_promotion);
        form.setFieldsValue(values);

        setSource(rank.source ? rank.source : 'get');
    }, [rank, form, isOpen]);

    const changeDispatchValues = (obj) => {
        if (source === 'get') {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: 'serviceData.ranks',
                    id: rank.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                addFieldValue({
                    fieldPath: 'edited.services.ranks',
                    value: obj,
                }),
            );
        }
        if (source === 'edited') {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: 'edited.services.ranks',
                    id: rank.id,
                    newObj: obj,
                }),
            );
        }
        if (source === 'added') {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: 'allTabs.services.ranks',
                    id: rank.id,
                    newObj: obj,
                }),
            );
        }
    };

    const handleClick = (e) => {
        if (e.target.checked === true) {
            setCheckbox(true);
        } else if (e.target.checked === false) {
            setCheckbox(false);
        }
    };

    const onOk = async () => {
        try {
            const values = await form.validateFields();
            // const link = filesChanged ? await handleFileUpload(values.dragger) : rank.document_link;

            const newObject = {
                id: rank.id,
                rank_id: values.rank_id,
                document_number: values.document_number,
                date_from: values.date_from.toDate(),
                document_link: /*link*/ null,
                rank_assigned_by: values.rank_assigned_by,
                // view only
                name: formattedRanks.find((rank) => rank.value === values.rank_id).label,
                early_promotion: checkbox,
                source: rank.source ? rank.source : 'edited',
            };
            changeDispatchValues(newObject);

            closeAndClear();
        } catch (error) {
            console.log('Form validation error', error);
        }
    };

    const onDelete = () => {
        changeDispatchValues({ id: rank.id, delete: true });

        closeAndClear();
    };

    const closeAndClear = () => {
        form.resetFields();
        setFilesChanged(false);
        setSource('');
        onClose();
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                // title={Редактировать звание}
                title={
                    <Col>
                        <IntlMessage id={'rank.add'} />
                    </Col>
                }
                onClick={(e) => e.stopPropagation()}
                onCancel={closeAndClear}
                open={isOpen}
                footer={
                    <Row justify="end">
                        <Button danger onClick={onDelete}>
                            <IntlMessage id={'initiate.deleteAll'} />
                        </Button>
                        <Button onClick={closeAndClear}>
                            <IntlMessage id={'service.data.modalAddPsycho.cancel'} />
                        </Button>
                        <Button type="primary" onClick={onOk}>
                            <IntlMessage id={'service.data.modalAddPsycho.save'} />
                        </Button>
                    </Row>
                }
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col xs={24}>
                            <Form.Item
                                label={
                                    <span style={{ fontSize: '14px' }}>
                                        <IntlMessage id="rank.give" />
                                    </span>
                                }
                                name="rank_id"
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id="rank.give.enter" />,
                                    },
                                ]}
                                requireds
                            >
                                <Select
                                    options={formattedRanks}
                                    showSearch
                                    onSearch={(e) => handleSearch(e, 'rank_id')}
                                    onPopupScroll={(e) => handlePopupScroll(e, 'rank_id')}
                                    filterOption={(inputValue, option) =>
                                        option.label
                                            .toLowerCase()
                                            .indexOf(inputValue.toLowerCase()) >= 0
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="checkbox">
                        <Checkbox onChange={handleClick} defaultChecked={checkbox}>
                            <IntlMessage id={'early'} />
                        </Checkbox>
                    </Form.Item>
                    <Form.Item
                        label={
                            <span style={{ fontSize: '14px' }}>
                                <IntlMessage id="service.data.modalAddPsycho.docInfo" />
                            </span>
                        }
                        required
                        style={{ marginBottom: 0 }}
                    >
                        <Row gutter={16}>
                            <Col xs={24}>
                                <Form.Item
                                    name="rank_assigned_by"
                                    rules={[
                                        {
                                            required: true,
                                            message: <IntlMessage id="rank.order.from.enter" />,
                                        },
                                    ]}
                                    required
                                >
                                    <Input
                                        placeholder={IntlMessageText.getText({
                                            id: 'rank.order.from.placeholder',
                                        })}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={12}>
                                <Form.Item
                                    name="document_number"
                                    rules={[
                                        {
                                            required: true,
                                            message: (
                                                <IntlMessage id="service.data.modalAddPsycho.chooseDoc" />
                                            ),
                                        },
                                    ]}
                                    required
                                    style={{ marginBottom: 0 }}
                                >
                                    <Input
                                        placeholder={IntlMessageText.getText({
                                            id: 'service.data.modalAddPsycho.chooseDoc',
                                        })}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={12}>
                                <Form.Item
                                    name="date_from"
                                    rules={[
                                        {
                                            required: true,
                                            message: (
                                                <IntlMessage id="Concract.date.registration.enter" />
                                            ),
                                        },
                                    ]}
                                    required
                                    style={{ marginBottom: 0 }}
                                >
                                    <DatePicker
                                        disabledDate={disabledDate}
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
