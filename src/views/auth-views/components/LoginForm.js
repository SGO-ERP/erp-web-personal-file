import PropTypes from 'prop-types';
import React from 'react';

import { Alert, Tabs } from 'antd';
import { motion } from 'framer-motion';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { AUTH_PREFIX_PATH, UNAUTHENTICATED_ENTRY } from 'configs/AppConfig';
import { hideAuthMessage, showAuthMessage, showLoading, signIn } from 'store/slices/authSlice';

import IntlMessage from '../../../components/util-components/IntlMessage';

import { AUTH_TOKEN } from '../../../constants/AuthConstant';
import EmailAuth from './EmailAuth';
import EcpAuth from './EcpAuth';

export const LoginForm = (props) => {
    const { hideAuthMessage, showMessage, message } = props;

    React.useEffect(() => {
        if (AUTH_TOKEN !== null) {
            <Navigate to={`${AUTH_PREFIX_PATH}${UNAUTHENTICATED_ENTRY}`} replace />;
        }

        if (showMessage) {
            const timer = setTimeout(() => hideAuthMessage(), 3000);
            return () => {
                clearTimeout(timer);
            };
        }
    });

    return (
        <React.Fragment>
            <motion.div
                initial={{ opacity: 0, marginBottom: 0 }}
                animate={{
                    opacity: showMessage ? 1 : 0,
                    marginBottom: showMessage ? 20 : 0,
                }}
            >
                <Alert type="error" showIcon message={message}></Alert>
            </motion.div>

            <Tabs
                defaultActiveKey="1"
                centered
                items={[
                    {
                        label: <IntlMessage id="auth.type.login" />,
                        key: '1',
                        children: <EmailAuth {...props} />,
                    },
                    {
                        label: <IntlMessage id="auth.type.ecp" />,
                        key: '2',
                        children: <EcpAuth />,
                    },
                ]}
            />
        </React.Fragment>
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
