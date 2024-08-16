import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    QuestionCircleOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import { Badge, Button, Layout, Popover } from 'antd';
import { NAV_TYPE_TOP, SIDE_NAV_COLLAPSED_WIDTH, SIDE_NAV_WIDTH } from 'constants/ThemeConstant';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onMobileNavToggle, toggleCollapsedNav } from 'store/slices/themeSlice';
import utils from 'utils';
import Logo from './Logo';
import NavLanguage from './NavLanguage';
import NavProfile from './NavProfile';
import NavSearch from './NavSearch';
import NavNotification from './NavNotification';
import IntlMessage from 'components/util-components/IntlMessage';

const { Header } = Layout;

const SearchIcon = () => {
    return (
        <Popover
            placement="bottomRight"
            title={null}
            trigger="click"
            overlayClassName="nav-notification"
        >
            <div className="nav-item">
                <Badge>
                    <SearchOutlined className="nav-icon mx-auto" type="bell" />
                </Badge>
            </div>
        </Popover>
    );
};

const QuestionCircleIcon = () => {
    return (
        <Popover
            placement="bottomRight"
            title={null}
            trigger="click"
            overlayClassName="nav-notification"
        >
            <div className="nav-item">
                <Badge>
                    <QuestionCircleOutlined className="nav-icon mx-auto" type="bell" />
                </Badge>
            </div>
        </Popover>
    );
};

export const HeaderNav = (props) => {
    const { isMobile } = props;

    const [searchActive, setSearchActive] = useState(false);

    const dispatch = useDispatch();

    const navCollapsed = useSelector((state) => state.theme.navCollapsed);
    const mobileNav = useSelector((state) => state.theme.mobileNav);
    const navType = useSelector((state) => state.theme.navType);
    const headerNavColor = useSelector((state) => state.theme.headerNavColor);
    const currentTheme = useSelector((state) => state.theme.currentTheme);
    const direction = useSelector((state) => state.theme.direction);

    const onSearchActive = () => {
        setSearchActive(true);
    };

    const onSearchClose = () => {
        setSearchActive(false);
    };

    const onToggle = () => {
        if (!isMobile) {
            dispatch(toggleCollapsedNav(!navCollapsed));
        } else {
            dispatch(onMobileNavToggle(!mobileNav));
        }
    };

    const isNavTop = navType === NAV_TYPE_TOP ? true : false;

    const mode = () => {
        if (!headerNavColor) {
            return utils.getColorContrast(currentTheme === 'dark' ? '#00000' : '#ffffff');
        }
        return utils.getColorContrast(headerNavColor);
    };

    const navMode = mode();

    const getNavWidth = () => {
        if (isNavTop || isMobile) {
            return '0px';
        }
        if (navCollapsed) {
            return `${SIDE_NAV_COLLAPSED_WIDTH}px`;
        } else {
            return `${SIDE_NAV_WIDTH}px`;
        }
    };

    useEffect(() => {
        if (!isMobile) {
            onSearchClose();
        }
    });

    const linkOldVersion = () => {
        console.log('changed link');
    };

    return (
        <Header
            data-lp
            className={`app-header ${navMode}`}
            style={{ backgroundColor: headerNavColor }}
        >
            <div className={`app-header-wrapper ${isNavTop ? 'layout-top-nav' : ''}`}>
                <Logo logoType={navMode} />
                <div className="nav" style={{ width: `calc(100% - ${getNavWidth()})` }}>
                    <div className="nav-left">
                        <div className="nav-item" onClick={onToggle}>
                            <div className="d-flex align-items-center">
                                {navCollapsed || isMobile ? (
                                    <MenuUnfoldOutlined className="nav-icon" />
                                ) : (
                                    <MenuFoldOutlined className="nav-icon" />
                                )}
                            </div>
                        </div>
                    </div>

                    <DevIndicatorRibbon />
                    <div className="nav-right">
                        <a
                            href="http://taldau:8091/sop"
                            target="_blank"
                            rel="noreferrer"
                            style={{ height: '100%', display: 'flex', alignItems: 'center' }}
                        >
                            <Button onClick={linkOldVersion}>
                                <IntlMessage id="header.nav.old" />
                            </Button>
                        </a>
                        <SearchIcon />
                        <QuestionCircleIcon />
                        <NavNotification />
                        <NavProfile />
                        <NavLanguage />
                    </div>
                    <NavSearch active={searchActive} close={onSearchClose} />
                </div>
            </div>
        </Header>
    );
};

export default HeaderNav;

const DevIndicatorBox = () => {
    return (
        <div
            className="dev-indicator-box"
            style={{
                backgroundColor: 'rgba(255, 0, 0, 0.5)',
                color: 'white',
                borderRadius: '5px',
                padding: '2px 5px',
                fontSize: '12px',
                fontWeight: 'bold',
                letterSpacing: '0.5px',
            }}
        >
            DEVELOPMENT
        </div>
    );
};

const DevIndicatorRibbon = () => {
    return (
        <div
            className="dev-indicator-ribbon"
            style={{
                backgroundColor: 'rgba(255, 0, 0, 0.8)',
                color: 'white',
                padding: '10px 60px',
                fontSize: '12px',
                fontWeight: 'bold',
                letterSpacing: '0.3px',
                position: 'fixed',
                top: 15,
                left: '-58px', // Update the left position to fully display the text
                zIndex: 1000,
                transform: 'rotate(-35deg)',
                boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',
                textAlign: 'center', // Add this line to center the text
                lineHeight: '14px', // Add this line to adjust the line spacing
            }}
        >
            Бета-версия
        </div>
    );
};
