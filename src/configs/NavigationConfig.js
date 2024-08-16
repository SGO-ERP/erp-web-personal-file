import { UnorderedListOutlined } from '@ant-design/icons';
import { APP_PREFIX_PATH } from 'configs/AppConfig';

const dutyNavTree = [
    {
        key: 'duty',
        path: `${APP_PREFIX_PATH}/duty`,
        title: 'sidenav.myDuty',
        breadcrumb: false,
        isGroupTitle: true,
        submenu: [
            {
                key: 'service.userMyProfileData',
                path: `${APP_PREFIX_PATH}/duty/data/me`,
                title: 'sidenav.myDuty.myData',
                icon: UnorderedListOutlined,
                breadcrumb: false,
                submenu: [],
            },
        ],
    },
];

const navigationConfig = dutyNavTree;

export default navigationConfig;
