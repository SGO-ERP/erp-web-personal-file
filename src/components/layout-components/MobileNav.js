import { ArrowLeftOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';
import Flex from 'components/shared-components/Flex';
import { NAV_TYPE_SIDE } from 'constants/ThemeConstant';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDispatch, useSelector } from 'react-redux';
import { onMobileNavToggle } from 'store/slices/themeSlice';
import Logo from './Logo';
import MenuContent from './MenuContent';

export const MobileNav = ({ routeInfo, hideGroupTitle }) => {
    const dispatch = useDispatch();

    const sideNavTheme = useSelector((state) => state.theme.sideNavTheme);
    const mobileNav = useSelector((state) => state.theme.mobileNav);

    const menuContentprops = { sideNavTheme, routeInfo, hideGroupTitle };

    const onClose = () => {
        dispatch(onMobileNavToggle(false));
    };

    return (
        <Drawer
            placement="left"
            closable={false}
            onClose={onClose}
            open={mobileNav}
            bodyStyle={{ padding: 5 }}
        >
            <Flex flexDirection="column" className="h-100">
                <Flex justifyContent="between" alignItems="center">
                    <Logo mobileLogo={true} />
                    <div className="nav-close" onClick={() => onClose()}>
                        <ArrowLeftOutlined />
                    </div>
                </Flex>
                <div className="mobile-nav-menu">
                    <Scrollbars autoHide>
                        <MenuContent type={NAV_TYPE_SIDE} {...menuContentprops} />
                    </Scrollbars>
                </div>
            </Flex>
        </Drawer>
    );
};

export default MobileNav;
