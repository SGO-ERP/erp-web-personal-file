import { Avatar } from 'antd';
import { AvatarSize } from 'antd/lib/avatar/SizeContext';
import PropTypes from 'prop-types';
import React from 'react';
import AvatarFallback from '../AvatarFallback';

interface Props {
    name?: string;
    suffix?: string;
    subTitle?: string;
    id?: string;
    type?: string;
    src?: string;
    icon?: string;
    size?: AvatarSize;
    shape?: 'circle' | 'square';
    gap?: number;
    text?: string;
    onNameClick?: ({ name, subTitle, src, id }: Props) => void;
    subTitleTwo?: string;
    subTitleThree?: string;
    surname?: string;
    fatherName?: string;
}

const renderAvatar = (props: Props) => {
    return (
        <Avatar
            {...props}
            style={{ color: 'black' }}
            className={`ant-avatar-${props.type}`}
            icon={<AvatarFallback />}
        >
            {props.text}
        </Avatar>
    );
};

export const AvatarStatus = ({
    name,
    suffix,
    subTitle,
    id,
    type,
    src,
    icon,
    size,
    shape,
    gap,
    text,
    onNameClick,
    subTitleTwo,
    subTitleThree,
    surname,
    fatherName,
}: Props) => {
    return (
        <div className="avatar-status d-flex align-items-center">
            {renderAvatar({ icon, src, type, size, shape, gap, text })}
            <div className="ml-2">
                {/*<div className="text-muted avatar-status-subtitle">{subTitle}</div>*/}

                <div className="avatar-status-subtitle">{subTitle}</div>

                <div>
                    {onNameClick ? (
                        <div
                            onClick={() => onNameClick({ name, subTitle, src, id })}
                            className="avatar-status-name clickable"
                        >
                            {name}
                        </div>
                    ) : (
                        <div className="avatar-status-name">
                            {name} {surname} {fatherName}
                            <span className="text-muted avatar-status-subtitle">
                                {subTitleThree}
                            </span>
                        </div>
                    )}
                    <span>{suffix}</span>
                </div>
                <div className="text-muted avatar-status-subtitle">{subTitleTwo}</div>
            </div>
        </div>
    );
};

AvatarStatus.propTypes = {
    name: PropTypes.string,
    src: PropTypes.string,
    type: PropTypes.string,
    onNameClick: PropTypes.func,
};

export default AvatarStatus;
