import { CopyTwoTone, DeleteTwoTone, PlusCircleTwoTone } from '@ant-design/icons';
import { Col } from 'antd';
import React from 'react';

export const EditButtons = () => {
    return (
        <>
            <Col span={2}>
                <PlusCircleTwoTone />
            </Col>
            <Col span={2}>
                <CopyTwoTone />
            </Col>
            <Col span={2}>
                <DeleteTwoTone twoToneColor="#FF4D4F" />
            </Col>
        </>
    );
};
