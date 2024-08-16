import React, { useState } from 'react';
import { Button, Modal, Radio, Table } from 'antd';
import IntlMessage from '../../../../../../../components/util-components/IntlMessage';
import LocalizationText from '../../../../../../../components/util-components/LocalizationText/LocalizationText';
import moment from 'moment';
import { FileTextTwoTone } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex';

const ModalSeeProperty = ({ modalCase, openModal, dataSource, setModalState }) => {
    const [isModalOpenProperty, setIsModalOpenProperty] = useState(false);
    const [selected, setSelected] = useState('armaments');

    const army_equipments = dataSource?.equipments?.filter(
        (item) => item.type_of_equipment === 'army_equipment',
    );
    const clothing_equipments = dataSource?.equipments?.filter(
        (item) => item.type_of_equipment === 'clothing_equipment',
    );
    const other_equipments = dataSource?.equipments?.filter(
        (item) => item.type_of_equipment === 'other_equipment',
    );

    const handleCancel = () => {
        setIsModalOpenProperty(false);
        modalCase.showModalProperty(isModalOpenProperty);
    };

    function handleChange(event) {
        setSelected(event.target.value);
    }

    const uniqueNames =
        clothing_equipments &&
        clothing_equipments.reduce((accumulator, item) => {
            if (!accumulator[item?.clothing_equipment_types_models?.model_of_equipment.name]) {
                accumulator[item?.clothing_equipment_types_models?.model_of_equipment.name] = {
                    name: item?.clothing_equipment_types_models?.model_of_equipment.name,
                    clothing_size: item.clothing_size,
                    inventory_number: item.inventory_number,
                    date_from: item.date_from,
                    document_link: item.document_link,
                };
            }
            return accumulator;
        }, {});

    const uniqueNamesArray = Object.values(uniqueNames ?? {});

    const columnsArmaments = [
        {
            title: 'Категория',
            dataIndex: 'type_of_equipment',
            render: (_, record) => (
                <>
                    <LocalizationText
                        text={record.type_of_army_equipment_model.type_of_equipment}
                    />
                </>
            ),
            key: 1,
        },
        {
            title: <IntlMessage id={'name.arrarments'} />,
            dataIndex: 'type_of_army_equipment_model',
            render: (_, record) => (
                <>
                    <LocalizationText text={record.type_of_army_equipment_model} />
                </>
            ),
            key: 2,
        },
        {
            title: <IntlMessage id={'property.number'} />,
            dataIndex: 'inventory_number',
            key: 3,
        },
        {
            title: <IntlMessage id={'personal.passport.dateOfissue'} />,
            dataIndex: 'date_from',
            render: (_, record) => <>{moment(record.date_from).format('DD.MM.YYYY')}</>,
            key: 4,
        },
        {
            title: <IntlMessage id={'order.property'} />,
            dataIndex: 'document_link',
            render: (_, record) => (
                <>
                    {record.document_link === null || record.document_link === undefined ? null : (
                        <FileTextTwoTone
                            onClick={(e) => {
                                e.stopPropagation();
                                setModalState({
                                    open: false,
                                    link: record.document_link,
                                });
                            }}
                            style={{ fontSize: '20px' }}
                        />
                    )}
                </>
            ),
            key: 5,
        },
    ];

    const columnsDuffel = [
        {
            title: 'Категория',
            dataIndex: 'name',
            key: 1,
        },
        {
            title: <IntlMessage id={'size.property'} />,
            dataIndex: 'clothing_size',
            key: 2,
        },
        {
            title: <IntlMessage id={'property.number'} />,
            dataIndex: 'inventory_number',
            key: 3,
        },
        {
            title: <IntlMessage id={'personal.passport.dateOfissue'} />,
            dataIndex: 'date_from',
            render: (_, record) => <>{moment(record.date_from).format('DD.MM.YYYY')}</>,
            key: 4,
        },
        {
            title: <IntlMessage id={'order.property'} />,
            dataIndex: 'document_link',
            render: (_, record) => (
                <>
                    {record.document_link === null || record.document_link === undefined ? null : (
                        <FileTextTwoTone
                            onClick={(e) => {
                                e.stopPropagation();
                                setModalState({
                                    open: false,
                                    link: record.document_link,
                                });
                            }}
                            style={{ fontSize: '20px' }}
                        />
                    )}
                </>
            ),
            key: 5,
        },
    ];

    const columnsOther = [
        {
            title: 'Категория',
            dataIndex: 'category',
            render: (_, record) => (
                <>
                    <LocalizationText
                        text={record.type_of_other_equipment_model.type_of_equipment}
                    />
                </>
            ),
            key: 1,
        },
        {
            title: 'Бренд',
            dataIndex: 'brand',
            render: (_, record) => (
                <>
                    <LocalizationText text={record.type_of_other_equipment_model} />
                </>
            ),
            key: 2,
        },
        {
            title: <IntlMessage id={'property.number'} />,
            dataIndex: 'inventory_number',
            key: 3,
        },
        {
            title: <IntlMessage id={'personal.passport.dateOfissue'} />,
            dataIndex: 'date_from',
            render: (_, record) => <>{moment(record.date_from).format('DD.MM.YYYY')}</>,
            key: 4,
        },
        {
            title: <IntlMessage id={'order.property'} />,
            dataIndex: 'document_link',
            render: (_, record) => (
                <>
                    {record.document_link === null || record.document_link === undefined ? null : (
                        <FileTextTwoTone
                            onClick={(e) => {
                                e.stopPropagation();
                                setModalState({
                                    open: false,
                                    link: record.document_link,
                                });
                            }}
                            style={{ fontSize: '20px' }}
                        />
                    )}
                </>
            ),
            key: 5,
        },
    ];

    return (
        <Modal
            title={<IntlMessage id="personal.services.property" />}
            onCancel={handleCancel}
            open={openModal}
            width={'50%'}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Ok
                </Button>,
            ]}
        >
            <Flex alignItems="center" justifyContent="center" mobileFlex={false}>
                <Radio.Group defaultValue="armaments">
                    <Radio.Button
                        value="armaments"
                        onChange={handleChange}
                        className={'font-style'}
                    >
                        <IntlMessage id="personal.services.weapons" />
                    </Radio.Button>
                    <Radio.Button value="duffel" onChange={handleChange} className={'font-style'}>
                        <IntlMessage id="personal.services.equipment" />
                    </Radio.Button>
                    <Radio.Button value="other" onChange={handleChange} className={'font-style'}>
                        <IntlMessage id="personal.services.other" />
                    </Radio.Button>
                </Radio.Group>
            </Flex>

            {selected === 'armaments' && (
                <Table columns={columnsArmaments} footer={null} dataSource={army_equipments} />
            )}
            {selected === 'duffel' && (
                <Table columns={columnsDuffel} footer={null} dataSource={uniqueNamesArray} />
            )}
            {selected === 'other' && (
                <Table columns={columnsOther} footer={null} dataSource={other_equipments} />
            )}
        </Modal>
    );
};

export default ModalSeeProperty;
