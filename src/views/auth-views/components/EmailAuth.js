import PropTypes from 'prop-types';
import React from 'react';

import { Button, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { hideAuthMessage, showAuthMessage, showLoading, signIn } from 'store/slices/authSlice';

import IntlMessage from '../../../components/util-components/IntlMessage';

export const LoginForm = (props) => {
    const { t } = useTranslation();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const { showLoading, extra, signIn, loading } = props;

    const initialCredential = {};

    const onChangeEmail = (e) => {
        const email = e.target.value;
        setEmail(email);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    const onLogin = (values) => {
        showLoading();
        signIn(values);
    };

    return (
        <Form
            layout="vertical"
            name="login-form"
            initialValues={initialCredential}
            onFinish={onLogin}
        >
            <Form.Item
                name="email"
                label={<IntlMessage id="auth.post" />}
                rules={[
                    {
                        required: true,
                        message: <IntlMessage id="auth.notification.mail.correct" />,
                    },
                    {
                        type: 'email',
                        message: <IntlMessage id="auth.notification.email" />,
                    },
                ]}
            >
                <Input
                    prefix={<MailOutlined className="text-primary" />}
                    value={email}
                    placeholder={t('auth.form.email.placeholder')}
                    onChange={onChangeEmail}
                />
            </Form.Item>
            <Form.Item
                name="password"
                label={
                    <div>
                        <span>
                            <IntlMessage id="auth.password" />
                        </span>
                    </div>
                }
                rules={[
                    {
                        required: true,
                        message: <IntlMessage id="password.required" />,
                    },
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined className="text-primary" />}
                    value={password}
                    placeholder={t('auth.form.password.placeholder')}
                    onChange={onChangePassword}
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                    <IntlMessage id="auth.login" />
                </Button>
            </Form.Item>

            {extra}
        </Form>
    );
};

LoginForm.propTypes = {
    otherSignIn: PropTypes.bool,
    extra: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

LoginForm.defaultProps = {
    otherSignIn: true,
};

const mapStateToProps = ({ auth }) => {
    const { loading, message, showMessage, token, redirect } = auth;
    return { loading, message, showMessage, token, redirect };
};

const mapDispatchToProps = {
    signIn,
    showAuthMessage,
    showLoading,
    hideAuthMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
