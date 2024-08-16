import { Card, Cascader, Col, notification, Row } from "antd";
import AvatarStatus from "components/shared-components/AvatarStatus";
import IntlMessage from "components/util-components/IntlMessage";
import React, { useEffect, useState } from "react";
import HrDocumentTemplatesService from "services/HrDocumentTemplatesService";
import HrDocumentsStepsService from "services/HrDocumentsStepsService";
import UserService from "services/UserService";
import Spinner from "views/app-views/service/data/personal/common/Spinner";
import { useDispatch, useSelector } from "react-redux";
import {
    setNeedSteps,
    setSteps,
    setStepsArray,
} from "store/slices/initialization/initializationDocInfoSlice";

// Helper functions

// Convert an object to an array where each value is an array
const arrayIfyData = (data) =>
    Object.fromEntries(Object.entries(data).filter(([_, value]) => Array.isArray(value)));

// Get the short user data for a given user ID
const getShortUser = async (id) => {
    try {
        return await UserService.user_short(id);
    } catch (error) {
        console.error(`Error fetching data for user ${id}:`, error);
        return { id: null };
    }
};

// Custom hooks
const useUserSteps = (id, user) => {
    const [loading, setLoading] = useState(false);
    const [stepsArray, setStepsArray] = useState({});
    const [cascaders, setCascaders] = useState([]);

    useEffect(() => {
        if (!id || !user?.id || Array.isArray(user) || typeof user !== "object") return;

        const values = {};

        const fetchData = async () => {
            setLoading(true);
            try {
                const [steps, stepsInfo] = await Promise.all([
                    HrDocumentsStepsService.get_document_step_user(id, user.id),
                    HrDocumentTemplatesService.hr_template_steps(id),
                ]);

                values.steps = steps;
                values.stepsInfo = stepsInfo;
            } catch (error) {
                notification.error({ message: "Проблемы с проходкой (данные не загрузились)" });
            }

            if (values.stepsInfo && values.stepsInfo.length > 0) {
                setStepsArray(values.steps);
                const documentSteps = arrayIfyData(values.steps);
                await generateUsersInfo(values.stepsInfo, documentSteps);
            }
            setLoading(false);
        };

        fetchData();
    }, [id, user]);

    const generateUsersInfo = async (data, documentSteps) => {
        const fullCascader = await Promise.all(
            data
                .map(async (item) => {
                    const { priority } = item.staff_function;
                    if (priority === 1) return;
                    if (!documentSteps[priority]) return;
                    const users = await Promise.all(documentSteps[priority].map(getShortUser));
                    return {
                        name: item.staff_function.role.name,
                        nameKZ: item.staff_function.role.nameKZ,
                        users: users.filter((user) => user && user.id),
                        key: priority,
                    };
                })
                .filter(() => Boolean),
        );

        const filteredCascader = fullCascader.filter((item) => item && item.key);

        setCascaders(filteredCascader);
    };

    return { loading, stepsArray, cascaders };
};

const ChooseSteps = () => {
    const { selectedDocument } = useSelector((state) => state.initializationDocuments);
    const { selectedUser } = useSelector((state) => state.initializationUsers);

    const dispatch = useDispatch();

    const { loading, stepsArray, cascaders } = useUserSteps(selectedDocument.id, selectedUser);

    // Dispatch the stepsArray to the redux store
    dispatch(setStepsArray(stepsArray));

    const saveChanges = (val, id) => {
        // Dispatch the selected step to the redux store
        dispatch(setSteps({ id, val: val[0] }));
    };

    const component = cascaders
        .filter((el) => el.users.length > 0)
        .map((el) => (
            <Row
                gutter={[0, 16]}
                key={el.key}
                style={{ marginTop: "2.5%" }}
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
                        style={{ width: "100%" }}
                        onChange={(val) => saveChanges(val, el.key)}
                    />
                </Col>
            </Row>
        ));

    useEffect(() => {
        if (!component) return;

        // Dispatch the needSteps value to the redux store
        dispatch(setNeedSteps(true));
    }, [component]);

    if (loading) return <Spinner />;
    if (!Object.keys(stepsArray).some((key) => Array.isArray(stepsArray[key]))) return null;

    return (
        <Card style={{ width: "100%" }}>
            <Row justify="center" gutter={[0, 16]} style={{ height: 50 }}>
                <Col
                    span={24}
                    style={{ borderBottom: "1px solid lightgrey" }}
                    className="draftTitle"
                >
                    <h4>
                        <IntlMessage id={"constructor.addParticipant"} />
                    </h4>
                </Col>
            </Row>
            {component}
        </Card>
    );
};

export default ChooseSteps;
