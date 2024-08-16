import React, { useEffect } from 'react';
import FirstCard from './firstCard';
import { Col, Row, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getFamilyStatus, getUser } from 'store/slices/userDataSlice/userDataSlice';

export const DefaultDashboard = () => {
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.userMyData.loading);
    const userDepartament = useSelector((state) => state.userMyData.userDepartment);
    const currentUser = useSelector((state) => state.userMyData.user);
    const userData = useSelector((state) => state.userMyData);
    const familyStatus = useSelector((state) => state.userMyData.familyStatus);

    useEffect(() => {
        dispatch(getUser());
        dispatch(getFamilyStatus());
    }, []);

    let rankUrl = '/img/rank.png';

    if (currentUser?.is_military) {
        rankUrl = currentUser.rank?.military_url ?? '/img/rank.png';
    } else {
        rankUrl = currentUser.rank?.employee_url ?? '/img/rank.png';
    }

    if (isLoading) {
        return <Spin></Spin>;
    }

    return (
        <>
            <Row gutter={[16, 16]}>
                <Col xl={8} xs={24}>
                    <FirstCard
                        firstName={currentUser?.first_name}
                        lastName={currentUser?.last_name}
                        fatherName={currentUser?.father_name}
                        birthDate={currentUser?.date_birth}
                        callSign={currentUser?.call_sign}
                        idNumber={currentUser?.id_number}
                        phoneNumber={currentUser?.phone_number}
                        icon={currentUser?.icon}
                        rankImg={rankUrl}
                        employeeRankImg={currentUser?.rank?.employee_url}
                        position={currentUser?.staff_unit?.position}
                        actual_position={currentUser?.staff_unit?.actual_position}
                        staffDivisionName={currentUser?.staff_unit?.staff_division}
                        userDepartament={userDepartament}
                        address={currentUser?.address}
                        badges={currentUser?.badges}
                        userId={currentUser?.id}
                        familyStatus={familyStatus}
                        loading={userData}
                    />
                </Col>
            </Row>
        </>
    );
};

export default DefaultDashboard;
