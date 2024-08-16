import React from 'react';
import { Radio } from 'antd';

const LanguageSwitcher = ({ size, height, fontSize, setLanguage, current }) => {
    return (
        <Radio.Group defaultValue="rus" size={size} style={{ display: 'flex' }} value={current}>
            <Radio.Button
                value="rus"
                style={{ height: height, display: 'flex', alignItems: 'center' }}
                onClick={(e) => setLanguage(e.target.value)}
            >
                <span style={{ fontSize: fontSize }}>Рус</span>
            </Radio.Button>
            <Radio.Button
                value="kaz"
                style={{ height: height, display: 'flex', alignItems: 'center' }}
                onClick={(e) => setLanguage(e.target.value)}
            >
                <span style={{ fontSize: fontSize }}>Қаз</span>
            </Radio.Button>
        </Radio.Group>
    );
};

export default LanguageSwitcher;
