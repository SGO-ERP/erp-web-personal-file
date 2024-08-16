import React from 'react';
import { Button, Form, Input, Modal, Space } from 'antd';
import ScriptLoader from '../ScriptLoader';
import { ReloadOutlined } from '@ant-design/icons';
import IntlMessage from '../../util-components/IntlMessage';

const SignEcp = (props) => {
    const { callback, open, onClose } = props;

    const handleScriptsLoaded = () => {
        console.log('ready');
    };

    const handleSubmit = () => {
        // window.checkCertificateAndSign(window.CryptoApi.onCompleteScript)
        callback();
        onClose();
    };

    return (
        <Modal title="Подписать документ" open={open} footer={null} onCancel={onClose} width={400}>
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
                    onClick={handleSubmit}
                    id="signConfirm"
                >
                    <IntlMessage id="letters.sign" />
                </Button>
            </Form>
        </Modal>
    );
};

export default SignEcp;
