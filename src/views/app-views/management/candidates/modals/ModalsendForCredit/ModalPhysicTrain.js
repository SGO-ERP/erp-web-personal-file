import React, { useEffect, useState } from 'react';
import { Modal, Form, Cascader } from 'antd';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { sendStageInfo } from '../../../../../../store/slices/candidates/candidateStageInfoSlice';
import { selectedCandidateInfo } from '../../../../../../store/slices/candidates/selectedCandidateSlice';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';
import { PrivateServices } from '../../../../../../API';

const ModalPhysicTrain = ({ modalCase, openModal, isPhysical, stageInfoId }) => {
    const [openPhysicTrain, setOpenPhysicTrain] = useState(false);
    const { id } = useParams();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [position, setPosition] = useState([]);
    const [user, setUser] = useState([]);
    const [staffUnitUser, setStaffUnitUser] = useState();

    function handleCancel() {
        setOpenPhysicTrain(false);
        modalCase.showModalPhysicTrain(openPhysicTrain);
    }

    // useEffect(() => {
    //     if (openModal) {
    //         PrivateServices.get('/api/v1/positions', {
    //             params: {
    //                 query: {
    //                     skip: 0,
    //                     limit: 100
    //                 }
    //             }
    //         }).then((response) => {
    //             if (response?.data) {
    //                 setPosition(response.data.filter((position) => position.name.toLowerCase() === 'инструктор'));
    //             }
    //         })
    //     }
    // }, [])

    // useEffect(() => {
    //     if (position.length > 0) {
    //         PrivateServices.get('/api/v1/users/position/{id}', {
    //             params: {
    //                 path: {
    //                     id: position[0]?.id
    //                 }
    //             }
    //         }).then((response) => {
    //             if (response?.data) {
    //                 setUser(response.data);
    //             }
    //         })
    //     }
    // }, [position])

    const onOk = async () => {
        try {
            // dispatch();
            const data = {
                'staff_unit_coordinate_id': null,
            };
            const dataStatus = {
                'status': 'В прогрессе',
            };
            await dispatch(
                sendStageInfo({ stageInfoId: stageInfoId, data: data, dataStatus: dataStatus }),
            );
            await dispatch(selectedCandidateInfo(id));

            handleCancel();
            modalCase.showModalPhysicTrain(openPhysicTrain);
        } catch (error) {
            throw new Error(error);
        }
    };
    // function handleCascaderChange(e) {
    //     setStaffUnitUser(e[0]);
    // }

    return (
        <Modal
            title={<IntlMessage id={'candidates.title.physicalTraining'} />}
            open={openModal}
            onCancel={handleCancel}
            onOk={onOk}
            okText={
                isPhysical.attempt_number === 1 ? (
                    <IntlMessage id={'candidates.title.offsetAgain'} />
                ) : (
                    <IntlMessage id={'candidates.title.offset'} />
                )
            }
            cancelText={<IntlMessage id={'candidates.warning.cancel'} />}
            style={{ height: '100%', width: '100%' }}
        >
            <div
                style={{
                    backgroundColor: '#FFF1F0',
                    border: '2px solid #CF1322',
                    borderRadius: '10px',
                }}
            >
                <div style={{ margin: '10px' }}>
                    <IntlMessage id={'candidates.title.warning'} />{' '}
                </div>
            </div>
            {/*<Form form={form} layout={'vertical'} style={{marginTop:'15px'}}>*/}
            {/*    <Form.Item label={<IntlMessage id={'candidate.choose.instructor'}/>}*/}
            {/*               name={'user'}*/}
            {/*               rules={[*/}
            {/*                   {*/}
            {/*                       required: true,*/}
            {/*                       message: <IntlMessage id={'candidates.title.must'}/>,*/}
            {/*                   },*/}
            {/*               ]}>*/}
            {/*        <Cascader options={ user &&*/}
            {/*            user.map((item) => ({*/}
            {/*                value: item.staff_unit.id,*/}
            {/*                label: item.first_name + ' ' + item.last_name,*/}
            {/*            }))} onChange={handleCascaderChange}/>*/}
            {/*    </Form.Item>*/}
            {/*</Form>*/}
        </Modal>
    );
};

export default ModalPhysicTrain;
