import { Grid } from 'antd';
import { APP_NAME } from 'configs/AppConfig';
import { NAV_TYPE_TOP, SIDE_NAV_COLLAPSED_WIDTH, SIDE_NAV_WIDTH } from 'constants/ThemeConstant';
import { useSelector } from 'react-redux';
import utils from 'utils';
// import image from './image/img.png';
import IntlMessage from 'components/util-components/IntlMessage';

const { useBreakpoint } = Grid;

export const Logo = ({ mobileLogo, logoType }) => {
    const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg');

    const navCollapsed = useSelector((state) => state.theme.navCollapsed);
    const navType = useSelector((state) => state.theme.navType);

    const getLogoWidthGutter = () => {
        const isNavTop = navType === NAV_TYPE_TOP ? true : false;
        if (isMobile && !mobileLogo) {
            return 0;
        }
        if (isNavTop) {
            return 'auto';
        }
        if (navCollapsed) {
            document.getElementById('text').hidden = true;
            return `${SIDE_NAV_COLLAPSED_WIDTH}px`;
        } else {
            document.getElementById('text').hidden = false;
            return `${SIDE_NAV_WIDTH}px`;
        }
    };

    // const getLogo = () => {
    //     if (logoType === 'light') {
    //         if (navCollapsed) {
    //             return image;
    //         }
    //         return image;
    //     }

    //     if (navCollapsed) {
    //         return image;
    //     }
    //     return image;
    // };

    const getLogoDisplay = () => {
        if (isMobile && !mobileLogo) {
            return 'd-none';
        } else {
            return 'logo';
        }
    };

    return (
        <div className={getLogoDisplay()} style={{ width: `${getLogoWidthGutter()}` }}>
            <img
                // src={getLogo()}
                alt={`${APP_NAME} logo`}
                style={{ width: 32, height: 32, margin: '24px 12px' }}
            />
            <h4
                className={'align-items-center'}
                id={'text'}
                style={{ color: '#366EF6', marginTop: '6px' }}
            >
                <IntlMessage id="title.log" />
            </h4>
        </div>
    );
};

export default Logo;
