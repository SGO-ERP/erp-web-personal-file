import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Card, Col, notification, Row, Spin, Tree, TreeProps, Typography } from 'antd';
import { EventDataNode } from 'antd/lib/tree';

import { components } from '../../../../../../../../API/types';
import { PrivateServices } from '../../../../../../../../API';

import IntlMessage from '../../../../../../../../components/util-components/IntlMessage';
import { LocalText } from '../../../../../../../../components/util-components/LocalizationText/LocalizationText';

const { Text } = Typography;

interface DataNode {
    title: string | React.ReactNode;
    key: string;
    isLeaf?: boolean;
    children?: DataNode[];
}

interface Props {
    setCheck: (value: boolean) => void;
    setInfo: (value: DataNode[]) => void;
    setNode: (value: any) => void;
    setCheckedKeys: (value: string[]) => void;
    value: string;
    checkedKeys: string[];
}

const updateTreeData = (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] =>
    list.map((node) => {
        if (node.key === key) {
            return {
                ...node,
                children,
            };
        }
        if (node.children) {
            return {
                ...node,
                children: updateTreeData(node.children, key, children),
            };
        }
        return node;
    });

const ScheduleDivision = ({
    setCheck,
    value,
    setInfo,
    setNode,
    setCheckedKeys,
    checkedKeys,
}: Props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [treeData, setTreeData] = useState<DataNode[]>();
    const [busyStaffDiv, setBusyStaffDiv] = useState<components['schemas']['ScheduleYearRead'][]>(
        [],
    );
    const [searchParams] = useSearchParams();
    const year = searchParams.get('year');

    useEffect(() => {
        setLoading(true);
        PrivateServices.get('/api/v1/staff_division', {
            params: { query: { skip: 0, limit: 100 } },
        }).then((r) => {
            if (r.data) {
                setLoading(false);
                const resultArray = combineChildren(r.data as components['schemas']['StaffDivisionRead'][]);

                if (resultArray) {
                    setTreeData(generateOptions(resultArray));
                }
            }
        });
    }, [busyStaffDiv]);

    useEffect(() => {
        if (year) {
            PrivateServices.get('/api/v1/schedule_year/year/', {
                params: { query: { year: parseInt(year, 10) } },
            }).then((r) => {
                if (r.data && r.data.objects) {
                    setBusyStaffDiv(r.data.objects);
                }
            });
        }
    }, [year]);

    function combineChildren(array: components['schemas']['StaffDivisionRead'][]) {
        if (!array || array.length === 0 || !array[0].children) {
            return [];
        }
        if (array.length > 0) {
            const childrenToCombine = array
                .slice(1)
                .map((obj) => obj.children || [])
                .flat();
            array[0].children = [...array[0].children, ...childrenToCombine];
        }
        return array;
    }

    const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    };

    const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
        setCheckedKeys(checkedKeys as string[]);
        setNode(info.node);
        setCheck(info.checked);
        setInfo(info?.checkedNodes as DataNode[]);
    };

    const generateOptions = (data: components['schemas']['StaffDivisionRead'][]): DataNode[] => {
        if (!data || data.length === 0 || !data[0].children) {
            return [];
        }

        return data[0].children.map((item) => ({
            title: LocalText.getName(item) as string,
            key: item.id || '',
            isLeaf: !item.children,
            disabled: busyStaffDiv.some(
                (innerArray) =>
                    innerArray?.staff_divisions &&
                    innerArray?.staff_divisions.some((r) => r.id === item.id),
            ),
        }));
    };

    const onLoadData = (treeNode: EventDataNode<DataNode>): Promise<void> => {
        const { key, children } = treeNode;
        return new Promise<void>((resolve, reject) => {
            if (children) {
                resolve();
                return;
            }

            setLoading(true);

            PrivateServices.get('/api/v1/staff_division/{id}/', {
                params: {
                    path: {
                        id: key,
                    },
                },
            })
                .then((res) => {
                    if (res.data) {
                        setTreeData((origin) =>
                            updateTreeData(origin || [], key, generateOptions([res.data])),
                        );
                    }
                    resolve();
                    setLoading(false);
                })
                .catch(() => {
                    notification.error({
                        message: 'Ошибка при загрузке департаментов',
                    });
                    setLoading(false);
                    reject();
                });
        });
    };

    return (
        <>
            <Spin spinning={loading}>
                <Card>
                    <Row gutter={[16, 16]}>
                        <Col xs={24}>
                            <Text strong>
                                <IntlMessage id={'csp.create.year.plan.tree.title'} />
                            </Text>
                        </Col>
                        <Col xs={24}>
                            <Tree
                                showIcon
                                checkable
                                checkedKeys={checkedKeys}
                                onSelect={onSelect}
                                onCheck={onCheck}
                                treeData={treeData}
                                loadData={onLoadData}
                                disabled={value === ''}
                            />
                        </Col>
                    </Row>
                </Card>
            </Spin>
        </>
    );
};

export default ScheduleDivision;
