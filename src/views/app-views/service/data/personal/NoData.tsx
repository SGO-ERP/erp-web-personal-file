import React from 'react';
import '../style.css';
import { Empty } from 'antd';

function NoData() {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                flexDirection: 'column',
            }}
        >
            <h1
                style={{
                    lineHeight: '32px',
                    fontSize: '16px',
                    fontWeight: '400',
                    marginBottom: 0,
                }}
            >
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </h1>
        </div>
    );
}

export default NoData;
