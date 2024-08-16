import { Button, Col, Input, Modal, Radio, Row, Select, Table } from 'antd';
import moment from 'moment/moment';
import React, { useEffect, useState } from 'react';
import IntlMessage from '../../../../../../../components/util-components/IntlMessage';
import { LocalText } from '../../../../../../../components/util-components/LocalizationText/LocalizationText';
import { DeleteTwoTone, PlusCircleOutlined, SwapRightOutlined } from '@ant-design/icons';
import NoData from '../../NoData';
import ShowOnlyForRedactor from '../../common/ShowOnlyForRedactor';
import ModalController from '../../common/ModalController';
import ModalAddFamilyViolation from './ModalAddFamilyViolation';
import { useAppDispatch, useAppSelector } from '../../../../../../../hooks/useStore';
import ModalAddFamilyAbroadTravel from './ModalAddFamilyAbroadTravel';
import { useSelector } from 'react-redux';
import OffenceListFamily from './OffenceListFamily';
import {
    addFieldValue,
    deleteByPathMyInfo,
    replaceByPath,
    setFieldValue,
} from '../../../../../../../store/slices/myInfo/myInfoSlice';
import { deleteByPath } from '../../../../../../../store/slices/myInfo/medicalInfoSlice';
import LanguageSwitcher from '../../../../../../../components/shared-components/LanguageSwitcher';
import { PrivateServices } from '../../../../../../../API';
import { useCountryOptions } from 'hooks/useCountryOptions/useCountryOptions';
import { SelectPickerMenu } from '../../PersonalData/BiographicInfo/SelectPickerMenu';
import { PERMISSION } from 'constants/permission';

const ModalOffenceAbroadLocal = ({ isOpen, onClose, data }) => {
    const [toggleType, setToggleType] = useState('offenses');
    const [object, setObject] = useState([]);
    const [objectAbroadTravel, setObjectAbroadTravel] = useState([]);

    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);

    const family_member_violations = useSelector(
        (state) => state.myInfo.allTabs.family.family_violations.remote,
    );
    const local_family_member_violations = useSelector(
        (state) => state.myInfo.allTabs.family.family_violations.local,
    );
    const filter_family_member_violations = family_member_violations?.filter(
        (item) => item?.family_id === data?.id,
    );
    const local_filter_family_member_violations = local_family_member_violations?.filter(
        (item) => item?.local_id === data?.id,
    );

    const family_member_abroad_travel = useSelector(
        (state) => state.myInfo.allTabs.family.family_abroad_travels.remote,
    );
    const local_family_member_abroad_travel = useSelector(
        (state) => state.myInfo.allTabs.family.family_abroad_travels.local,
    );
    const filter_family_member_abroad_travel = family_member_abroad_travel?.filter(
        (item) => item?.family_id === data?.id,
    );
    const local_filter_family_member_abroad_travel = local_family_member_abroad_travel?.filter(
        (item) => item?.local_id === data?.id,
    );

    const edited_family_member_violations_remote = useSelector(
        (state) => state.myInfo.edited.family.family_violations.remote,
    );
    const edited_family_member_violations_local = useSelector(
        (state) => state.myInfo.edited.family.family_violations.local,
    );
    const filter_edited_family_member_violations_remote =
        edited_family_member_violations_remote?.filter((item) => item?.family_id === data?.id);
    const filter_edited_family_member_violations_local =
        edited_family_member_violations_local?.filter((item) => item?.local_id === data?.id);

    const edited_family_member_abroad_travel_remote = useSelector(
        (state) => state.myInfo.edited.family.family_abroad_travels.remote,
    );
    const edited_family_member_abroad_travel_local = useSelector(
        (state) => state.myInfo.edited.family.family_abroad_travels.local,
    );
    const filter_edited_family_member_abroad_travel_remote =
        edited_family_member_abroad_travel_remote
            ?.filter((item) => item?.family_id === data?.id)
            .filter((item) => !Object.hasOwnProperty.call(item, 'delete'));
    const filter_edited_family_member_abroad_travel_local =
        edited_family_member_abroad_travel_local?.filter((item) => item?.local_id === data?.id);

    const combine = data?.abroad_travel.concat(
        filter_family_member_abroad_travel,
        local_filter_family_member_abroad_travel,
        filter_edited_family_member_abroad_travel_remote,
        filter_edited_family_member_abroad_travel_local,
    );
    const currentLocale = localStorage.getItem('lan');
    const [currentLanguage, setCurrentLanguage] = useState('rus');
    const dispatch = useAppDispatch();

    const { countryOptions, countryOptionsLoading, createNew, getCountryOptions } =
        useCountryOptions(currentLanguage === 'rus' ? 'ru' : 'kz');

    const changeInput = (id, type, value) => {
        const obj = modeRedactor
            ? combine.find((item) => item.id === id)
            : data?.abroad_travel.find((item) => item.id === id);

        const find_object =
            objectAbroadTravel.length > 0 && objectAbroadTravel.find((item) => item.id === id);

        if (!find_object) {
            const newObj = {
                ...obj,
                [type]: value,
            };

            const newArray = [...objectAbroadTravel, newObj];

            setObjectAbroadTravel(newArray);
        } else if (find_object) {
            const newObj = {
                ...find_object,
                [type]: value,
            };

            const filter_obj = objectAbroadTravel.filter((item) => item.id !== id);
            const newArray = [...filter_obj, newObj];
            setObjectAbroadTravel(newArray);
        }
    };

    const handleCountryChange = (value, option, id, type) => {
        changeInput(id, type, value);
    };

    const handleAddNewCountry = ({ ru, kz }) => {
        createNew({ name: ru, nameKZ: kz }).then(() => {
            getCountryOptions();
        });
    };

    const columns = [
        {
            title: <IntlMessage id="personal.additional.overseasTravel.departureCountry" />,
            dataIndex: 'name',
            render: (_, record) => (
                <>
                    {isHR && modeRedactor ? (
                        <SelectPickerMenu
                            showSearch
                            filterOption={(inputValue, option) =>
                                option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                            }
                            defaultValue={record.destination_country_id}
                            options={countryOptions}
                            optionsLoading={countryOptionsLoading}
                            onChange={(value, option) =>
                                handleCountryChange(
                                    value,
                                    option,
                                    record.id,
                                    'destination_country_id',
                                )
                            }
                            handleAddNewOption={handleAddNewCountry}
                        />
                    ) : (
                        LocalText.getName(record?.destination_country)
                    )}
                </>
            ),
            key: 'name',
        },
        {
            title: <IntlMessage id="personal.additional.overseasTravel.departurePeriod" />,
            dataIndex: 'period',
            render: (_, record) => (
                <>
                    {moment(record.date_from).format('DD.MM.YYYY')}{' '}
                    <SwapRightOutlined style={{ color: '#72849A66' }} />
                    {moment(record.to).format('DD.MM.YYYY')}
                </>
            ),
            key: 'period',
        },
        {
            title: <IntlMessage id="personal.additional.overseasTravel.departurePurpose" />,
            dataIndex: 'reason',
            render: (_, record) => (
                <>
                    {isHR && modeRedactor ? (
                        <Input
                            defaultValue={
                                currentLanguage === 'kaz' ? record.reasonKZ : record.reason
                            }
                            onChange={(e) =>
                                changeInput(
                                    record.id,
                                    currentLanguage === 'kaz' ? 'reasonKZ' : 'reason',
                                    e.target.value,
                                )
                            }
                        />
                    ) : currentLocale === 'kk' ? (
                        record.reasonKZ
                    ) : (
                        record.reason
                    )}
                </>
            ),
            key: 'reason',
        },
        isHR &&
            modeRedactor && {
                title: <IntlMessage id="letters.historytable.actions" />,
                dataIndex: 'detail',
                render: (_, record) => (
                    <DeleteTwoTone
                        onClick={(event) => {
                            event.stopPropagation();
                            deleteAbroadTravel(record);
                        }}
                        twoToneColor="red"
                    />
                ),
                key: 'detail',
            },
    ];

    const onOk = () => {
        if (object.length > 0) {
            object.map((obj) => {
                const find = local_family_member_violations.find((item) => item.id === obj.id);
                const find_remote = family_member_violations.find((item) => item.id === obj.id);

                if (!find && !find_remote) {
                    dispatch(
                        setFieldValue({
                            fieldPath: 'edited.family.family_violations.remote',
                            value: [...family_member_violations, obj],
                        }),
                    );
                    // dispatch(
                    //     deleteByPath({
                    //         path: 'familyProfile.violations',
                    //         id: obj.id,
                    //     }),
                    // );
                } else if (Object.hasOwnProperty.call(obj, 'local_id') && find) {
                    dispatch(
                        replaceByPath({
                            path: 'allTabs.family.family_violations.local',
                            id: obj.id,
                            newObj: obj,
                        }),
                    );
                } else if (Object.hasOwnProperty.call(obj, 'family_id') && find_remote) {
                    dispatch(
                        replaceByPath({
                            path: 'allTabs.family.family_violations.remote',
                            id: obj.id,
                            newObj: obj,
                        }),
                    );
                }
            });
        } else if (objectAbroadTravel.length > 0) {
            objectAbroadTravel.map((item) => {
                const find = local_family_member_abroad_travel.find(
                    (abroad_travel) => abroad_travel.id === item.id,
                );
                const find_remote = family_member_abroad_travel.find(
                    (abroad_travel) => abroad_travel.id === item.id,
                );

                if (!find && !find_remote) {
                    dispatch(
                        setFieldValue({
                            fieldPath: 'edited.family.family_abroad_travels.remote',
                            value: [...family_member_abroad_travel, item],
                        }),
                    );
                    // dispatch(
                    //     deleteByPath({
                    //         path: 'familyProfile.violations',
                    //         id: obj.id,
                    //     }),
                    // );
                } else if (Object.hasOwnProperty.call(item, 'local_id') && find) {
                    dispatch(
                        replaceByPath({
                            path: 'allTabs.family.family_abroad_travels.local',
                            id: item.id,
                            newObj: item,
                        }),
                    );
                } else if (Object.hasOwnProperty.call(item, 'family_id') && find_remote) {
                    dispatch(
                        replaceByPath({
                            path: 'allTabs.family.family_abroad_travels.remote',
                            id: item.id,
                            newObj: item,
                        }),
                    );
                }
            });
        }

        handleCancel();
    };

    const handleCancel = () => {
        setObject([]);
        setObjectAbroadTravel([]);
        onClose();
    };

    const deleteAbroadTravel = (abroad_travel) => {
        const find = local_family_member_abroad_travel.find((item) => item.id === abroad_travel.id);
        const find_remote = family_member_abroad_travel.find(
            (item) => item.id === abroad_travel.id,
        );

        if (!find && !find_remote) {
            dispatch(
                addFieldValue({
                    fieldPath: 'edited.family.family_abroad_travel.remote',
                    value: { id: abroad_travel.id, delete: true },
                }),
            );
        } else if (Object.hasOwnProperty.call(abroad_travel, 'local_id') && find) {
            dispatch(
                deleteByPathMyInfo({
                    path: 'allTabs.family.family_abroad_travel.local',
                    id: abroad_travel.id,
                }),
            );
        } else if (Object.hasOwnProperty.call(abroad_travel, 'family_id') && find_remote) {
            dispatch(
                deleteByPathMyInfo({
                    path: 'allTabs.family.family_abroad_travel.remote',
                    id: abroad_travel.id,
                }),
            );
        }
    };

    if (data == null) {
        return null;
    }
    return (
        <div>
            <Modal
                title={
                    <Row gutter={6}>
                        <Col xs={8}>
                            <IntlMessage id="personal.additional.additionalInformation" />
                        </Col>
                        <Col xs={12}>
                            {isHR && (
                                <ShowOnlyForRedactor
                                    forRedactor={
                                        <Col>
                                            <ModalController>
                                                {toggleType === 'offenses' ? (
                                                    <ModalAddFamilyViolation data={data} />
                                                ) : (
                                                    <ModalAddFamilyAbroadTravel data={data} />
                                                )}
                                                <PlusCircleOutlined
                                                    style={{
                                                        fontSize: '13px',
                                                        color: '#366EF6',
                                                    }}
                                                />
                                            </ModalController>
                                        </Col>
                                    }
                                />
                            )}
                        </Col>
                        <Col xs={4}>
                            <LanguageSwitcher
                                size="small"
                                fontSize="12px"
                                height="1.4rem"
                                current={currentLanguage}
                                setLanguage={setCurrentLanguage}
                            />
                        </Col>
                    </Row>
                }
                open={isOpen}
                onCancel={onClose}
                footer={null}
                width={800}
            >
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Radio.Group value={toggleType}>
                        <Radio.Button
                            value="offenses"
                            onClick={(e) => setToggleType(e.target.value)}
                        >
                            <IntlMessage id="personal.additional.offenses" />
                        </Radio.Button>
                        <Radio.Button value="abroad" onClick={(e) => setToggleType(e.target.value)}>
                            <IntlMessage id="personal.additional.overseasTravel" />
                        </Radio.Button>
                    </Radio.Group>
                </div>
                {toggleType === 'offenses' ? (
                    data?.violation?.length +
                        filter_family_member_violations.length +
                        local_filter_family_member_violations.length >
                    0 ? (
                        <div style={{ marginTop: '15px' }}>
                            <OffenceListFamily
                                offences={data?.violation}
                                setObject={setObject}
                                object={object}
                                currentLanguage={currentLanguage}
                            />
                            {isHR &&
                                modeRedactor &&
                                local_filter_family_member_violations.length +
                                    filter_family_member_violations.length >
                                    0 && (
                                    <>
                                        <OffenceListFamily
                                            offences={filter_family_member_violations}
                                            setObject={setObject}
                                            object={object}
                                            currentLanguage={currentLanguage}
                                        />
                                        <OffenceListFamily
                                            offences={local_filter_family_member_violations}
                                            setObject={setObject}
                                            object={object}
                                            currentLanguage={currentLanguage}
                                        />
                                        <OffenceListFamily
                                            offences={filter_edited_family_member_violations_local}
                                            setObject={setObject}
                                            object={object}
                                            currentLanguage={currentLanguage}
                                        />
                                        <OffenceListFamily
                                            offences={filter_edited_family_member_violations_remote.filter(
                                                (item) =>
                                                    !Object.hasOwnProperty.call(item, 'delete'),
                                            )}
                                            setObject={setObject}
                                            object={object}
                                            currentLanguage={currentLanguage}
                                        />
                                    </>
                                )}
                        </div>
                    ) : (
                        <NoData />
                    )
                ) : data?.abroad_travel.length +
                      filter_family_member_abroad_travel.length +
                      local_filter_family_member_abroad_travel.length >
                  0 ? (
                    <Table
                        columns={columns}
                        dataSource={modeRedactor ? combine : data?.abroad_travel}
                        pagination={false}
                        style={{ marginTop: '15px' }}
                        rowKey="id"
                    />
                ) : (
                    <NoData />
                )}

                {isHR && modeRedactor ? (
                    <Row
                        style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}
                        gutter={16}
                    >
                        <Col>
                            <Button onClick={() => handleCancel()}>
                                <IntlMessage id={'service.data.modalAddPsycho.cancel'} />
                            </Button>
                        </Col>
                        <Col>
                            <Button type={'primary'} onClick={() => onOk()}>
                                <IntlMessage id={'service.data.modalAddPsycho.save'} />
                            </Button>
                        </Col>
                    </Row>
                ) : (
                    <Row style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <Col>
                            <Button type={'primary'} onClick={onClose}>
                                Ок
                            </Button>
                        </Col>
                    </Row>
                )}
            </Modal>
        </div>
    );
};

export default ModalOffenceAbroadLocal;
