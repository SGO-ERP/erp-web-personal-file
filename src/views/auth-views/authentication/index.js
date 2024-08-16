import React from 'react';

import { Card, Col, Row } from 'antd';

// import Logo from '../../../assets/images/logo.png';
import NavLanguage from '../../../components/layout-components/NavLanguage';
import LoginForm from '../components/LoginForm';

const Login = () => {
    return (
        <div
            className="h-100"
            style={{
                background: 'url(/img/others/img-17.jpg)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
            }}
        >
            <div className="container d-flex flex-column justify-content-center h-100">
                <Row justify="center">
                    <Col xs={20} sm={20} md={20} lg={7}>
                        <Card>
                            {' '}
                            <div style={{ float: 'right', cursor: 'pointer' }}>
                                <NavLanguage />
                            </div>
                            <div className="my-4">
                                <div className="text-center">
                                    <img
                                        className="img-fluid"
                                        // src={Logo}
                                        alt="main-logo"
                                        style={{ width: '150px', height: '150px' }}
                                    />
                                </div>
                                <Row justify="center">
                                    <Col xs={24} sm={24} md={20} lg={20}>
                                        <LoginForm />
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Login;
