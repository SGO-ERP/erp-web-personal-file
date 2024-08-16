import {
    BankOutlined,
    BookOutlined,
    ClockCircleOutlined,
    CrownOutlined,
    DoubleRightOutlined,
    EditOutlined,
    FileAddOutlined,
    FileDoneOutlined,
    FileOutlined,
    FileSearchOutlined,
    FileTextOutlined,
    FireOutlined,
    IdcardOutlined,
    InteractionTwoTone,
    SafetyCertificateOutlined,
    TagOutlined,
    TeamOutlined,
    ThunderboltOutlined,
    UserOutlined,
    UserSwitchOutlined,
} from '@ant-design/icons';

import graduation from '../images/graduation-cap.svg';
import up from '../images/up.svg';
import medal from '../images/medal.svg';

const getTypeBasedIcon = (eventType) => {
    switch (eventType) {
        case 'staff_unit_history':
            return <UserOutlined />;
        case 'rank_history':
            return <CrownOutlined />;
        case 'penalty_history':
            return <FileOutlined />;
        case 'emergency_service_history':
            return <ThunderboltOutlined />;
        case 'work_experience_history':
            return <ClockCircleOutlined />;
        case 'secondment_history':
            return <FileSearchOutlined />;
        case 'name_change_history':
            return <EditOutlined />;
        case 'attestation':
            return <SafetyCertificateOutlined />;
        case 'service_characteristic_history':
            return <TeamOutlined />;
        case 'status_history':
            return <FireOutlined />;
        case 'coolness_history':
            return <TagOutlined />;
        case 'contract_history':
            return <FileOutlined />;
        case 'badge_history':
            return <TagOutlined />;
        // new one

        case 'ranks':
            return (
                <DoubleRightOutlined
                    style={{
                        transform: 'rotate(-90deg)',
                    }}
                />
            );
        case 'equipments':
            return <UserSwitchOutlined />;
        case 'academic_degrees':
            return <img src={graduation} style={{ width: 24 }} />;
        case 'academic_titles':
            return <img src={graduation} style={{ width: 24 }} />;
        case 'educations':
            return <BankOutlined />;
        case 'courses':
            return <BookOutlined />;
        case 'identification_card':
            return <FileAddOutlined />;
        case 'driving_license':
            return <IdcardOutlined />;
        case 'passport':
            return <img src={up} style={{ width: 24 }} />;
        case 'emergency_history':
            return <InteractionTwoTone />;
        case 'contracts':
            return <FileDoneOutlined />;
        case 'emergency_contracts':
            return <FileTextOutlined />;
        case 'badges':
            return <img src={medal} style={{ width: 24 }} />;
    }
};

export default getTypeBasedIcon;
