import { Card, Col, Row } from 'antd';
import React from 'react';
import { Typography } from 'antd';
import { LocalText } from '../../../../../../components/util-components/LocalizationText/LocalizationText';
import { components } from '../../../../../../API/types';

const { Paragraph } = Typography;

interface Props {
    selectedItem: components['schemas']['StaffDivisionRead'];
}

export default function TextAreaCard({ selectedItem }: Props) {
    return (
        <>
            <Card>
                <Typography.Title level={4} style={{ margin: 0 }}>
                    <Row>
                        <Col>{LocalText.getName(selectedItem)}</Col>
                    </Row>
                </Typography.Title>
                <br />
                <Paragraph ellipsis={false}>
                    {LocalText.getName(selectedItem.description)}
                </Paragraph>
            </Card>
        </>
    );
}
