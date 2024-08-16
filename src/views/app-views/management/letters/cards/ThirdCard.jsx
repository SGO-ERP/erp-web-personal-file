import { FileSearchOutlined } from '@ant-design/icons';
import { Card, Collapse, Spin } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import HrStepHistory from '../components/steps/Steps';
import { fetchSteps } from 'store/slices/hrDocumentStepSlice';
import { useEffect } from 'react';

import './style.css';
import { AVATAR_PLACEHOLDER } from 'components/shared-components/AvatarFallback';

export const ThirdCard = () => {
    const userData = useSelector((state) => state.tableController.userCard);
    const steps = useSelector((state) => state.steps.steps);
    const isLoading = useSelector((state) => state.steps.isLoading);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchSteps(userData.id));
    }, []);
    const data = userData && userData.users !== undefined && (
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {userData.users.map((item) => (
                <>
                    <div
                        key={item.id}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                            }}
                        >
                            <img
                                src={item?.icon}
                                style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                                alt=""
                                onError={`this.onerror=null;this.src='${AVATAR_PLACEHOLDER}';`}
                            />
                        </div>
                        <div style={{ color: '#1a3353' }}>
                            {item?.first_name} {item?.father_name}
                        </div>
                    </div>
                    <div
                        style={{
                            width: '100%',
                            height: '1px',
                            backgroundColor: '#E6EBF1',
                            margin: '10px 0',
                        }}
                    ></div>
                </>
            ))}
        </div>
    );
    const items = [
        {
            header: `Военнослужащие (${userData?.users?.length || 0} участника)`,
            content: <p>{data}</p>,
        },
    ];
    return (
        <Card
            style={{ width: '600px' }}
            title={
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <div>Приказ о выводе в распоряжение</div>
                    <div>
                        <FileSearchOutlined style={{ fontSize: '20px' }} />
                    </div>
                </div>
            }
        >
            <Collapse className="dropdown__thirdPysma">
                {items.map((item) => (
                    <Collapse.Panel key={item.key} header={item.header}>
                        {item.content}
                    </Collapse.Panel>
                ))}
            </Collapse>
            {isLoading ? (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Spin size="large"></Spin>
                </div>
            ) : (
                <HrStepHistory steps={steps} />
            )}
        </Card>
    );
};
