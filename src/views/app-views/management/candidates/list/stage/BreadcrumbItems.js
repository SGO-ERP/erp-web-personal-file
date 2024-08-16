import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import '../../style.css';

const Breadcrumbs = ({ main, userName, path }) => {
    return (
        <Breadcrumb className="breadcrumbs" separator="">
            <Breadcrumb.Item style={{ fontWeight: '500', fontSize: '20px', marginRight: '15px' }}>
                {main}
            </Breadcrumb.Item>
            <Breadcrumb.Item style={{ marginBottom: '30px' }}>
                <Link to={path} style={{ color: 'grey' }}>
                    {userName}
                </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>{main}</Breadcrumb.Item>
        </Breadcrumb>
    );
};

export default Breadcrumbs;
