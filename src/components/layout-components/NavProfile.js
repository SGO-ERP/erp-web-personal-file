import { LogoutOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu, Skeleton } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'store/slices/authSlice';
import IntlMessage from '../util-components/IntlMessage';
import { getPermissions, getProfile, resetProfileSlice } from 'store/slices/ProfileSlice';
import { getUserID } from 'utils/helpers/common';
import AvatarFallback from 'components/shared-components/AvatarFallback';

const MenuItemSignOut = (props) => (
    <span className="d-flex align-items-center">
        <LogoutOutlined className="font-size-md" />
        <span className="font-weight-normal mx-2">{props.label}</span>
    </span>
);

export const NavProfile = () => {
    const { data: myProfile, loading, permissions } = useSelector((state) => state.profile);
    const dispatch = useDispatch();

    useEffect(() => {
        const getUser = async () => {
            dispatch(getProfile({ id: await getUserID() }));
        };
        getUser();
        dispatch(getPermissions());
    }, []);

    const handleClick = ({ key }) => {
        if (key === 'Sign Out') {
            handleSignOut();
        }
    };

    const handleSignOut = () => {
        dispatch(resetProfileSlice());
        dispatch(signOut());
        window.location.reload();
    };

    const menu = (
        <Menu
            onClick={handleClick}
            items={[
                {
                    key: 'Sign Out',
                    label: <MenuItemSignOut label={<IntlMessage id={'account.exit'} />} />,
                },
            ]}
        />
    );

    return (
        <Dropdown placement="bottomRight" overlay={menu} trigger={['click']}>
            <div className="nav-item">
                <div className="d-flex align-items-center" style={{ gap: '0.5rem' }}>
                    {myProfile ? (
                        <>
                            <Avatar
                                src={myProfile?.icon}
                                style={{ width: '30px', height: '30px' }}
                                icon={<AvatarFallback />}
                            />
                            <div className="d-none d-sm-block profile-text">
                                <div className="font-size-base font-weight-bold">
                                    {myProfile?.first_name + ' ' + myProfile?.last_name}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <Skeleton.Avatar
                                style={{ width: 30, height: 30 }}
                                active={loading}
                                size={'small'}
                            />
                            <Skeleton.Input
                                style={{ width: 100, height: 20 }}
                                active={loading}
                                size={'small'}
                            />
                        </>
                    )}
                </div>
            </div>
        </Dropdown>
    );
};

export default NavProfile;
