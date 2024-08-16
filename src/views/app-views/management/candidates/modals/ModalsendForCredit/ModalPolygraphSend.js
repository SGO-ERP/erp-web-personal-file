import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Cascader, Form, Modal } from 'antd';
import { sendStageInfo } from '../../../../../../store/slices/candidates/candidateStageInfoSlice';
import { selectedCandidateInfo } from '../../../../../../store/slices/candidates/selectedCandidateSlice';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';
import { PrivateServices } from '../../../../../../API';

const ModalPolygraphSend = ({ modalCase, openModal, stageInfoId }) => {
    const [openPolygraphSend, setOpenPolygraphSend] = useState(false);
    const { id } = useParams();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [position, setPosition] = useState([]);
    const [user, setUser] = useState([]);
    const [staffUnitUser, setStaffUnitUser] = useState();

    function handleCancel() {
        setOpenPolygraphSend(false);
        modalCase.showModalPolygraphSend(openPolygraphSend);
    }

    // useEffect(()=>{
    //     if(openModal){
    //         PrivateServices.get('/api/v1/positions',{
    //             params:{
    //                 query:{
    //                     skip:0,
    //                     limit:100
    //                 }
    //             }
    //         }).then((response)=>{
    //             if(response?.data){
    //                 setPosition(response.data.filter((position)=>position.name.toLowerCase()==='полиграфолог'));
    //             }
    //         })
    //     }
    // },[])

    // useEffect(()=>{
    //     if(position.length > 0){
    //         PrivateServices.get('/api/v1/users/position/{id}',{
    //             params:{
    //                 path:{
    //                     id:position[0]?.id
    //                 }
    //             }
    //         }).then((response)=>{
    //             if(response?.data){
    //                 setUser(response.data);
    //             }
    //         })
    //     }
    // },[position])

    const onOk = async () => {
        try {
            const data = {
                'staff_unit_coordinate_id': null,
            };
            const dataStatus = {
                'status': 'В прогрессе',
            };
            await dispatch(
                sendStageInfo({
                    stageInfoId: stageInfoId,
                    data: data,
                    dataStatus: dataStatus,
                }),
            );
            await dispatch(selectedCandidateInfo(id));
            handleCancel();
            modalCase.showModalPolygraphSend(openPolygraphSend);
        } catch (error) {
            throw new Error(error);
        }
    };
    // function handleCascaderChange(e) {
    //     setStaffUnitUser(e[0]);
    // }
    return (
        <Modal
            open={openModal}
            onCancel={handleCancel}
            onOk={onOk}
            okText={<IntlMessage id={'candidates.title.polygraph'} />}
            cancelText={<IntlMessage id={'candidates.warning.cancel'} />}
            style={{ height: '100%', width: '100%' }}
        >
            <div>
                <IntlMessage id={'candidates.title.polygraphTitle'} />
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

export default ModalPolygraphSend;
