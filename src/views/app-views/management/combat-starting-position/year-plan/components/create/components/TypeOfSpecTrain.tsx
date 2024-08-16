import React, { useEffect, useState } from 'react';

import { Card, Cascader, Col, Row, Spin, Typography } from 'antd';
import { components } from '../../../../../../../../API/types';
import { PrivateServices } from '../../../../../../../../API';

import IntlMessage from '../../../../../../../../components/util-components/IntlMessage';
import LocalizationText from '../../../../../../../../components/util-components/LocalizationText/LocalizationText';

const { Text } = Typography;

interface Props {
    setValue: (value: string) => void;
    value: string;
}

const TypeOfSpecTrain = ({ setValue, value }: Props) => {
    const [type, setType] = useState<components['schemas']['ActivityRead'][]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const onChange: (value: any) => void = (value: string[]) => {
        setValue(value[value.length - 1]);
    };

    useEffect(() => {
        setLoading(true);
        PrivateServices.get('/api/v1/activity', {
            params: { query: { skip: 0, limit: 100 } },
        }).then((r) => {
            if (r.data !== undefined) {
                setType(r.data);
                setLoading(false);
            }
        });
    }, []);

    const generateOptions = (data: components['schemas']['ActivityRead'][]) => {
        return data.map((item) => {
            const { id, children } = item;
            const options: any = {
                value: id,
                label: <LocalizationText text={item} />,
            };

            if (children && children.length > 0) {
                options.children = generateOptions(children);
            }

            return options;
        });
    };

    const options = generateOptions(type);

    return (
        <Spin spinning={loading}>
            <Card>
                <Row gutter={[16, 16]}>
                    <Col xs={24}>
                        <Text strong>
                            <IntlMessage id={'csp.create.year.plan.cascader.title'} />
                        </Text>
                    </Col>
                    <Col xs={24}>
                        <Cascader options={options} style={{ width: '100%' }} onChange={onChange} />
                    </Col>
                </Row>
            </Card>
        </Spin>
    );
};

export default TypeOfSpecTrain;
