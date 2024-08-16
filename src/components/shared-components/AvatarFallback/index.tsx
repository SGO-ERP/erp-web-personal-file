import React from 'react';

export const AVATAR_PLACEHOLDER = '/s3/static/placeholder.jpg';

const AvatarFallback = () => {
    return <img src={AVATAR_PLACEHOLDER} alt="" className="avatar-fallback" />;
};

export default AvatarFallback;
