import { PrivateServices } from 'API';
import { Col, Modal, Row } from 'antd';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useAppSelector } from 'hooks/useStore';
import { useDispatch } from 'react-redux';
import { embedStaffUnitNodeActual } from 'utils/schedule/utils';
import { change } from '../../../../../../../store/slices/schedule/staffDivisionSlice';
import { StaffUnitDivisionItem } from '../StaffUnitDivisionItem';
import { StaffUnitDivisionEditIcon } from '../StaffUnitScheduleEditIcons';
import { modalInfo } from './data';

export const StaffUnitDivisionEdit = ({
    divisionParents,
    staff_unit,
    canEditSchedule,
    setType,
    setIsOpenUserRepl,
}) => {
    const dispatch = useDispatch();

    const actualStructure = useAppSelector((state) => state.staffScheduleSlice.data);

    const { value: currentLocale } = useLocalStorage('lan', 'ru');

    const del = (staffUnit) => {
        const onOk = async () => {
            const response = await PrivateServices.put('/api/v1/staff_unit/{id}/', {
                params: {
                    path: {
                        id: staff_unit?.id,
                    },
                },
                body: {
                    position_id: staff_unit.position_id,
                    user_replacing_id: null,
                },
            });
            if (!staffUnit?.id) {
                return;
            }
            const staffUnitWithIdResponse = await PrivateServices.get('/api/v1/staff_unit/{id}/', {
                params: {
                    path: {
                        id: staffUnit?.id,
                    },
                },
            });
            if (!staffUnitWithIdResponse.data) {
                return;
            }
            dispatch(
                change(
                    embedStaffUnitNodeActual(
                        { ...staffUnitWithIdResponse?.data },
                        staffUnit.staff_division_id,
                        actualStructure,
                    ),
                ),
            );
        };

        const Icon = modalInfo[currentLocale].icon;
        Modal.confirm({
            ...modalInfo[currentLocale],
            icon: <Icon style={{ fontSize: '1.4rem', color: '#FAAD14' }} />,
            onOk,
        });
    };

    const handleEditTwoToneClick = () => {
        setType('edit');
        setIsOpenUserRepl(true);
    };

    const handleDeleteTwoToneClick = () => {
        del(staff_unit);
    };

    if (staff_unit.user_replacing_id == null || staff_unit?.user_replacing == null) {
        return null;
    }
    return (
        <>
            <Col xs={7}>
                <Row justify="end">
                    {divisionParents.map((division) => (
                        <StaffUnitDivisionItem key={division.id} division={division} />
                    ))}
                </Row>
            </Col>
            <StaffUnitDivisionEditIcon
                canEditSchedule={canEditSchedule}
                handleEditTwoToneClick={handleEditTwoToneClick}
                handleDeleteTwoToneClick={handleDeleteTwoToneClick}
            />
        </>
    );
};
