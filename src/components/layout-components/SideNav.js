import { Layout } from 'antd';
import { NAV_TYPE_SIDE, SIDE_NAV_DARK, SIDE_NAV_WIDTH } from 'constants/ThemeConstant';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import MenuContent from './MenuContent';
import './sidebar.css';
const { Sider } = Layout;

export const SideNav = ({ navCollapsed, sideNavTheme, routeInfo, hideGroupTitle }) => {
    const props = { sideNavTheme, routeInfo, hideGroupTitle };

    return (
        <Sider
            className={`side-nav ${sideNavTheme === SIDE_NAV_DARK ? 'side-nav-dark' : ''}`}
            width={SIDE_NAV_WIDTH}
            collapsed={navCollapsed}
        >
            <Scrollbars autoHide>
                <MenuContent type={NAV_TYPE_SIDE} {...props} />
            </Scrollbars>
        </Sider>
    );
};

const mapStateToProps = ({ theme }) => {
    const { navCollapsed, sideNavTheme } = theme;
    return { navCollapsed, sideNavTheme };
};

export default connect(mapStateToProps)(SideNav);
