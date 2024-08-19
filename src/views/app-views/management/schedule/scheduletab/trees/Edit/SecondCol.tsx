import { EditTwoTone, DeleteTwoTone, PlusCircleTwoTone } from '@ant-design/icons';
import { PrivateServices } from 'API';
import {Row, Col, Typography, Tooltip, notification} from 'antd';
import IntlMessage from 'components/util-components/IntlMessage';
import LocalizationText, {
    LocalText,
} from 'components/util-components/LocalizationText/LocalizationText';
import {useAppDispatch, useAppSelector} from 'hooks/useStore';
import { useState, useEffect } from 'react';
import { getArchiveServiceStaffFunction } from 'store/slices/schedule/functionArchieveScheduleSlice';
import { concatBySpace } from 'utils/format/format';
import uuidv4 from 'utils/helpers/uuid';
import {calcStaffFunctionsAvg, embedStaffUnitNode} from 'utils/schedule/utils';
import ModalAddPositionFunction from '../../modals/ModalAddPositionFunction';
import ModalConfirmRemoveSubstitute from '../../modals/ModalConfirmRemoveSubstitute';
import ModalEditInfoEmployeePosition from '../../modals/ModalEditInfoEmployeePosition';
import React from 'react';
import { components } from 'API/types';
import ModalEditPositionFunction from "../../modals/ModalEditPositionFunction";
import {
    removeLocalStaffFunction,
    removeRemoteStaffFunction
} from "../../../../../../../store/slices/schedule/Edit/staffFunctions";
import {change} from "../../../../../../../store/slices/schedule/archiveStaffDivision";
const { Text } = Typography;

interface Props {
    staffUnit: components['schemas']['ArchiveStaffUnitRead'];
    staffDivision: components['schemas']['ArchiveStaffDivisionRead'];
}
export const SecondCol = ({ staffUnit, staffDivision }: Props) => {
    const dispatch = useAppDispatch();

    const [isModalEmployeePosition, setShowModalEmployeePosition] = useState(false);
    const [isModalAddPositionFunc, setShowModalAddPositionFunc] = useState(false);
    const [warningDelSubstitute, setWarningDelSubstitute] = useState(false);
    const [editFunc,setEditFunc] = useState(false);
    const [func, setFunc] = useState<components['schemas']['ArchiveStaffFunctionRead']>();
    const [type, setType] = useState('');
    const [typeSubstitute, setTypeSubstitute] = useState('add' || 'edit');
    const [divisionParents, setDivisionParents] = useState<
        components['schemas']['ArchiveStaffDivisionRead'][]
    >([]);
    const archiveStaffDivision = useAppSelector((state) => state.archiveStaffDivision.data);

    const showModalEmployeePosition = (bool: boolean) => {
        setShowModalEmployeePosition(bool);
    };
    const showModalAddPositionFunc = (bool: boolean) => {
        setShowModalAddPositionFunc(bool);
    };

    const showModalWarningDelSub = (bool: boolean) => {
        setWarningDelSubstitute(bool);
    };

    function getDivisionParents(
        division: components['schemas']['ArchiveStaffDivisionRead'],
        // TODO: Remove any
        data: any[],
    ) {
        const updatedParents = [
            ...data,
            {
                id: division.id,
                name: division.name,
                nameKZ: division.nameKZ,
            },
        ];
        if (Array.isArray(division.children) && division.children.length > 0) {
            getDivisionParents(division.children[0] as components['schemas']['ArchiveStaffDivisionRead'], updatedParents);
        } else {
            setDivisionParents(updatedParents);
        }
    }

    useEffect(() => {
        if (!Object.prototype.hasOwnProperty.call(staffUnit, 'isLocal') && staffUnit.id) {
            dispatch(
                getArchiveServiceStaffFunction({
                    path: {
                        id: staffUnit?.id,
                    },
                }),
            );

            const seeLastChildren = async () => {
                if (staffUnit?.user_replacing !== null && staffUnit?.staff_division_id) {
                    await PrivateServices.get(
                        '/api/v1/archive_staff_division/division_parents/{id}/',
                        {
                            params: {
                                path: {
                                    id: staffUnit?.staff_division_id,
                                },
                            },
                        },
                    ).then((response) => {
                        response.data && getDivisionParents(response.data, []);
                    });
                }
            };

            seeLastChildren();
        }
    }, []);

    const divisions = () => {
        return (
            <Row justify="end">
                {divisionParents?.map((division) => (
                    <Col
                        key={division.id}
                        xs={24}
                        style={{ color: '#366EF6', display: 'flex', justifyContent: 'flex-end' }}
                    >
                        <LocalizationText text={division} />
                    </Col>
                ))}
            </Row>
        );
    };

    const deleteFunc = (item: components['schemas']['ArchiveStaffFunctionRead']) => {
        if (!staffUnit?.id || !item.id || !staffUnit.staff_division_id) {
            notification.error({
                message: <IntlMessage id="schedule.vacancy.error.message" />,
            });
            return;
        }
        const isLocal = Object.prototype.hasOwnProperty.call(item, 'isLocal');
        if (isLocal) {
            dispatch(
                removeLocalStaffFunction({
                    id: item.id,
                }),
            );
        } else {
            dispatch(
                removeRemoteStaffFunction({
                    id: item.id,
                    staff_unit_id: staffUnit?.id,
                }),
            );
        }

        const { staff_functions, ...rest } = staffUnit;
        const filteredStaffFunctions = staff_functions?.filter((_item) => {
            if (_item?.id !== item?.id) {
                return true;
            }
            return false;
        });
        const updatedStaffUnit = { ...rest, staff_functions: filteredStaffFunctions };
        dispatch(
            change(
                embedStaffUnitNode(
                    updatedStaffUnit,
                    staffUnit.staff_division_id,
                    archiveStaffDivision,
                ),
            ),
        );
    }

    console.log('staffUnit: ', staffUnit)

    return (
        <>
            <ModalEditInfoEmployeePosition
                key={uuidv4()}
                openModal={isModalEmployeePosition}
                modalCase={{ showModalEmployeePosition }}
                staffUnit={staffUnit}
                whoIs={'user_replacing_id'}
                type={typeSubstitute}
            />
            <ModalAddPositionFunction
                openModal={isModalAddPositionFunc}
                modalCase={{ showModalAddPositionFunc }}
                staffUnit={staffUnit}
                type={type}
            />
            <ModalConfirmRemoveSubstitute
                openModal={warningDelSubstitute}
                modalCase={{ showModalWarningDelSub }}
                staffUnit={staffUnit}
            />
            <ModalEditPositionFunction
                isOpen={editFunc}
                onClose={() => setEditFunc(false)}
                staffUnit={staffUnit}
                _function={func}
            />

            <div
                style={{
                    background: '#F9F9FA',
                    border: '1px solid #E6EBF1',
                    borderRadius: '10px',
                    alignItems: 'center',
                    padding: '12px',
                    marginBottom: '12px',
                }}
            >
                <Row gutter={16}>
                    <Col
                        xs={
                            staffUnit.user_replacing_id !== null &&
                            staffUnit?.user_replacing !== null
                                ? 14
                                : 24
                        }
                    >
                        <Row>
                            <IntlMessage id={'scheduel.substitute'} />:
                        </Row>
                        {staffUnit.user_replacing_id &&
                        staffUnit?.user_replacing ? (
                            <Row style={{ fontWeight: '500', color: '#1A335' }}>
                                <Text>{LocalText.getName(staffUnit?.user_replacing?.rank)}</Text>
                                <Text type="secondary">
                                    &nbsp; (
                                    {concatBySpace([
                                        staffUnit?.user_replacing?.last_name,
                                        staffUnit?.user_replacing?.first_name?.charAt(0),
                                    ])}
                                    .
                                    {
                                        staffUnit?.user_replacing?.father_name!==null
                                        &&
                                        staffUnit?.user_replacing?.father_name?.charAt(0)
                                        +
                                        '.'
                                    })
                                </Text>
                            </Row>
                        ) : (
                            <>
                                <Row>
                                    <Col xs={18}>
                                        <Text strong>
                                            <IntlMessage id={'scheduel.absent'} />
                                        </Text>
                                    </Col>
                                    <Col xs={6}>
                                        <div style={{ display: 'flex', justifyContent: 'end' }}>
                                            <Tooltip
                                                title={
                                                    <IntlMessage id="schedule.add.or.edit.absent" />
                                                }
                                            >
                                                <PlusCircleTwoTone
                                                    onClick={() => {
                                                        setTypeSubstitute('add');
                                                        showModalEmployeePosition(true);
                                                    }}
                                                />
                                            </Tooltip>
                                        </div>
                                    </Col>
                                </Row>
                            </>
                        )}
                    </Col>
                    {staffUnit.user_replacing_id !== null && staffUnit?.user_replacing !== null && (
                        <>
                            <Col xs={7}>{<>{divisions()}</>}</Col>
                            <Col xs={2}>
                                <Row style={{ display: 'flex', justifyContent: 'end' }}>
                                    <Col xs={24}>
                                        <EditTwoTone
                                            onClick={() => {
                                                setTypeSubstitute('edit');
                                                showModalEmployeePosition(true);
                                            }}
                                        />
                                    </Col>
                                    <Col xs={24}>
                                        <DeleteTwoTone
                                            twoToneColor="#FF4D4F"
                                            onClick={() => {
                                                showModalWarningDelSub(true);
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </>
                    )}
                </Row>
            </div>
            <Row>
                <Col xs={2}>
                    <Tooltip title={<IntlMessage id="schedule.add.or.edit.position.function" />}>
                        <PlusCircleTwoTone
                            onClick={() => {
                                setType('add');
                                showModalAddPositionFunc(true);
                            }}
                        />
                    </Tooltip>
                </Col>
                <Col xs={18}>
                    <IntlMessage id={'scheduel.functional'} />
                </Col>
                <Col xs={2} style={{ color: '#29CC6A' }}>
                    {Array.isArray(staffUnit.staff_functions) &&
                        staffUnit.staff_functions.length > 0 &&
                        calcStaffFunctionsAvg(staffUnit.staff_functions)}
                </Col>
            </Row>
            {Array.isArray(staffUnit.staff_functions) && staffUnit.staff_functions.length > 0 && (
                <div
                    className="scrollbar"
                    style={{
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        height: '210px',
                        width: '100%',
                        marginTop: '10px',
                    }}
                >
                    {staffUnit?.staff_functions?.map((item) => {
                        return (
                            <Row
                                key={item.id}
                                style={{
                                    background: '#F9F9FA',
                                    border: '1px solid #E6EBF1',
                                    borderRadius: '10px',
                                    alignItems: 'center',
                                    padding: '10px',
                                    marginBottom: '10px',
                                }}
                            >
                                <Col xs={2}>{item.hours_per_week}</Col>
                                <Col xs={18}>{<LocalizationText text={item} />}</Col>
                                {
                                    item?.discriminator === 'service_staff_function'
                                    &&
                                    <>
                                        <Col xs={2}>
                                            <EditTwoTone
                                                onClick={() => {
                                                    setFunc(item);
                                                    setEditFunc(true);
                                                }}
                                            />
                                        </Col>
                                        <Col xs={2}>
                                            <DeleteTwoTone
                                                twoToneColor="#FF4D4F"
                                                onClick={() => {
                                                    deleteFunc(item);
                                                }}
                                            />
                                        </Col>
                                    </>
                                }
                            </Row>
                        );
                    })}
                </div>
            )}
        </>
    );
};
