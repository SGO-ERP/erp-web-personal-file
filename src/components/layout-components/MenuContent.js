import { Grid, Menu } from 'antd';
import navigationConfig from 'configs/NavigationConfig';
import { NAV_TYPE_SIDE, SIDE_NAV_LIGHT } from 'constants/ThemeConstant';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { onMobileNavToggle } from 'store/slices/themeSlice';
import utils from 'utils';
import Icon from '../util-components/Icon';
import IntlMessage from '../util-components/IntlMessage';
import { useAppSelector } from '../../hooks/useStore';

const { useBreakpoint } = Grid;

const setLocale = (localeKey, isLocaleOn = true) =>
    isLocaleOn ? <IntlMessage id={localeKey} /> : localeKey.toString();

const setDefaultOpen = (key) => {
    let keyList = [];
    let keyString = '';
    if (key) {
        const arr = key.split('-');
        for (let index = 0; index < arr.length; index++) {
            const elm = arr[index];
            index === 0 ? (keyString = elm) : (keyString = `${keyString}-${elm}`);
            keyList.push(keyString);
        }
    }
    return keyList;
};

const MenuItem = ({ title, icon, path }) => {
    const dispatch = useDispatch();

    const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg');

    const closeMobileNav = () => {
        if (isMobile) {
            dispatch(onMobileNavToggle(false));
        }
    };

    return (
        <>
            {icon && <Icon type={icon} />}
            <span>{setLocale(title)}</span>
            {path && <Link onClick={closeMobileNav} to={path} />}
        </>
    );
};

const getTopNavMenuItem = (navItem) =>
    navItem.map((nav) => {
        return {
            key: nav.key,
            label: (
                <MenuItem
                    title={nav.title}
                    icon={nav.icon}
                    {...(nav.isGroupTitle ? {} : { path: nav.path })}
                />
            ),
            ...(nav.submenu.length > 0 ? { children: getTopNavMenuItem(nav.submenu) } : {}),
        };
    });

const SideNavContent = (props) => {
    const { routeInfo, hideGroupTitle } = props;
    const myPermissions = useAppSelector((state) => state.profile.permissions);

    const sideNavTheme = useSelector((state) => state.theme.sideNavTheme);

    const getSideNavMenuItem = (navItem) =>
        navItem
            .filter((nav) => {
                // If there's no permissions field or it contains 'all', show the item
                if (!nav.permissions || nav.permissions.includes('all')) return true;

                // Check if any of the item's permissions match the user's permissions
                if (nav.permissions.some((permission) => myPermissions.includes(permission)))
                    return true;

                // If the nav has submenu items, filter them first, then decide if the main menu should be shown
                if (nav.submenu && nav.submenu.length > 0) {
                    const filteredSubmenu = getSideNavMenuItem(nav.submenu);
                    return filteredSubmenu.length > 0;
                }

                return false;
            })
            .map((nav) => ({
                key: nav.key,
                label: (
                    <MenuItem
                        title={nav.title}
                        {...(nav.isGroupTitle ? {} : { path: nav.path, icon: nav.icon })}
                    />
                ),
                ...(nav.isGroupTitle ? { type: 'group' } : {}),
                ...(nav.submenu && nav.submenu.length > 0
                    ? { children: getSideNavMenuItem(nav.submenu) }
                    : {}),
            }));

    const menuItems = useMemo(
        () => getSideNavMenuItem(navigationConfig),
        [routeInfo, myPermissions],
    );

    return (
        <Menu
            mode="inline"
            theme={sideNavTheme === SIDE_NAV_LIGHT ? 'light' : 'dark'}
            style={{ height: '100%', borderRight: 0 }}
            defaultSelectedKeys={[routeInfo?.key]}
            defaultOpenKeys={setDefaultOpen(routeInfo?.key)}
            className={hideGroupTitle ? 'hide-group-title' : ''}
            items={menuItems}
        />
    );
};

const TopNavContent = () => {
    const topNavColor = useSelector((state) => state.theme.topNavColor);

    const menuItems = useMemo(() => getTopNavMenuItem(navigationConfig), []);

    return <Menu mode="horizontal" style={{ backgroundColor: topNavColor }} items={menuItems} />;
};

const MenuContent = (props) => {
    return props.type === NAV_TYPE_SIDE ? (
        <>
            <SideNavContent {...props} />
        </>
    ) : (
        <TopNavContent {...props} />
    );
};

export default MenuContent;
