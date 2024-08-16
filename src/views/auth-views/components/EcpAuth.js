import React from 'react';
import IntlMessage from '../../../components/util-components/IntlMessage';
import { Button, Form, Input, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import ScriptLoader from '../../../components/shared-components/ScriptLoader';
import { getCertificate } from 'utils/helpers/certificate';

const EcpAuth = () => {
    const handleScriptsLoaded = () => {
        console.log('ready');
        window.loadProfiles();
    };

    const handleSignClick = () => {
        if (getCertificate().length > 0) {
            window.checkCertificateAndSign(window.CryptoApi.onCompleteScript);
        }
    };

    return (
        <>
            <ScriptLoader
                scripts={[
                    '/js/jquery-2.1.4.js',
                    '/js/jquery.blockUI.js',
                    '/js/sign/CryptoApi.js',
                    '/js/sign/CryptoApiTumar.js',
                    '/js/sign/CryptoApiNew.js',
                    '/js/sign/tumsocket.js',
                    '/js/sign/app.js',
                ]}
                onScriptsLoaded={handleScriptsLoaded}
            />
            <Form layout="vertical" name="login-form" autoComplete="off">
                <Form.Item name="token" label="Токен">
                    <Space.Compact size={10} block>
                        <select
                            className="ecp-select"
                            placeholder="Токен"
                            id="profiles"
                            style={{ padding: '10px', width: '100%', display: 'block' }}
                        />
                        <Button
                            icon={<ReloadOutlined />}
                            type="primary"
                            onClick={() => window.loadProfiles()}
                        />
                    </Space.Compact>
                </Form.Item>
                <Form.Item name="keys" label="Ключ">
                    <Space.Compact size={10} block>
                        <select
                            className="ecp-select"
                            placeholder="Токен"
                            id="certificates"
                            style={{ padding: '10px', width: '100%', display: 'block' }}
                        />
                        <Button
                            icon={<ReloadOutlined />}
                            type="primary"
                            onClick={() => window.loadKeysFromProfile()}
                        />
                    </Space.Compact>
                </Form.Item>
                <Form.Item name="pwd" label="Пароль">
                    <Space.Compact size={10} block>
                        <Input placeholder="Пароль" type="password" id="password" />
                        <Button icon={<ReloadOutlined />} type="primary" />
                    </Space.Compact>
                </Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    block
                    onClick={handleSignClick}
                    id="signConfirm"
                >
                    <IntlMessage id="auth.login" />
                </Button>
            </Form>
        </>
    );
};

export default EcpAuth;
