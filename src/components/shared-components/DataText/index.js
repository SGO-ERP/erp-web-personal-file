import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'antd';

const renderTypography = (props) => {
    return <Typography {...props}>{props.text}</Typography>;
};

export const TypographyStatus = (props) => {
    const { name, subTitle, id, type, icon, size, shape, gap, text, onNameClick } = props;
    return (
        <div className="align-items-center">
            {renderTypography({ icon, type, size, shape, gap, text, name })}
            <div className="ml-2">
                <div>
                    {onNameClick ? (
                        <div
                            onClick={() => onNameClick({ name, subTitle, id })}
                            className="avatar-status-name"
                        >
                            {name}
                        </div>
                    ) : (
                        <div className="avatar-status-name">{name}</div>
                    )}
                </div>
                <div className="avatar-status-subtitle">{subTitle}</div>
            </div>
        </div>
    );
};

TypographyStatus.propTypes = {
    name: PropTypes.string,
    type: PropTypes.string,
    onNameClick: PropTypes.func,
};

export default TypographyStatus;
