import { Card, Cascader, Col, notification, Row } from 'antd';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import IntlMessage from 'components/util-components/IntlMessage';
import React, { useEffect, useState } from 'react';
import HrDocumentTemplatesService from 'services/HrDocumentTemplatesService';
import HrDocumentsStepsService from 'services/HrDocumentsStepsService';
import UserService from 'services/UserService';
import Spinner from 'views/app-views/service/data/personal/common/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { getNeedSteps, getSteps, getStepsArray } from 'store/slices/newInitializationsSlices/initializationNewSlice';
import './styles/IndexStyle.css';

// Helper functions

// Convert an object to an array where each value is an array
const arrayifyData = (data) =>
    Object.fromEntries(Object.entries(data).filter(([_, value]) => Array.isArray(value)));

// Get the short user data for a given user ID
const getShortUser = async (id) => {
    try {
        return await UserService.user_short(id);
    } catch (error) {
        console.error(`Error fetching data for user ${id}:`, error);
        return [];
    }
};

// Custom hooks
const useUserSteps = (id, user) => {
    const [loading, setLoading] = useState(false);
    const [stepsArray, setStepsArray] = useState({});
    const [cascaders, setCascaders] = useState([]);

    useEffect(() => {
        // Skip the hook if the necessary data is not available
        if (!id || !user?.id || Array.isArray(user) || typeof user !== 'object') return;

        const fetchSteps = async () => {
            setLoading(true);
            // Fetch the document steps for the user
            try {
                const steps = await HrDocumentsStepsService.get_document_step_user(id, user.id);
                // Fetch the template steps for the document
                const stepsInfo = await HrDocumentTemplatesService.hr_template_steps(id);
                if (!Object.keys(steps).length) return;
                setStepsArray(steps);

                // Convert steps object to an array
                const arr = arrayifyData(steps);
                // Fetch the short user data for each step
                const cascaders = await Promise.all(
                    stepsInfo.map(async (item) => {
                        const users = await Promise.all(
                            arr[item.staff_function.priority]?.map(getShortUser) || [],
                        );
                        return {
                            name: item.staff_function.role.name,
                            nameKZ: item.staff_function.role.nameKZ,
                            users: users,
                            key: item.staff_function.priority,
                        };
                    }),
                );

                setCascaders(cascaders);
            } catch (e) {
                notification.error({
                    message: 'У выбранного субъекта нет начальника',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchSteps();
    }, [id, user]);

    return { loading, stepsArray, cascaders };
};

const ChooseSteps = () => {
    const { documentTemplate, selectUser } = useSelector((state) => state.initializationNew);

    const dispatch = useDispatch();

    const { loading, stepsArray, cascaders } = useUserSteps(documentTemplate.id, selectUser);

    // Dispatch the stepsArray to the redux store
    dispatch(getStepsArray(stepsArray));

    const saveChanges = (val, id) => {
        // Dispatch the selected step to the redux store
        dispatch(getSteps({ id, val: val[0] }));
    };

    const component = cascaders
        .filter((el) => el.users.length > 0)
        .map((el) => (
            <Row
                gutter={[0, 16]}
                key={el.key}
                style={{ marginTop: '2.5%' }}
                align="middle"
                justify="space-between"
            >
                <Col xl={4}>
                    <h5 style={{ margin: 0 }} className="text2">
                        {el.name}
                    </h5>
                </Col>
                <Col xl={16} className="auto-user">
                    <Cascader
                        options={el.users.map((user) => ({
                            value: user.id,
                            label: (
                                <AvatarStatus
                                    name={user.first_name}
                                    surname={user.last_name}
                                    subTitleThree={user.rank?.name}
                                    src={user.icon}
                                />
                            ),
                        }))}
                        style={{ width: '100%' }}
                        onChange={(val) => saveChanges(val, el.key)}
                    />
                </Col>
            </Row>
        ));

    useEffect(() => {
        if (!component) return;

        // Dispatch the needSteps value to the redux store
        dispatch(getNeedSteps(true));
    }, [component]);

    if (loading) return <Spinner />;
    if (!Object.keys(stepsArray).some((key) => Array.isArray(stepsArray[key]))) return null;

    return (
        <Card style={{ width: '100%' }}>
            <Row justify="center" gutter={[0, 16]} style={{ height: 50 }}>
                <Col
                    span={24}
                    style={{ borderBottom: '1px solid lightgrey' }}
                    className="draftTitle"
                >
                    <h4>
                        <IntlMessage id={'constructor.addParticipant'} />
                    </h4>
                </Col>
            </Row>
            {component}
        </Card>
    );
};

export default ChooseSteps;
