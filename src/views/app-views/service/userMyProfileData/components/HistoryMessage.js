const getHistoryMessage = (eventType) => {
    switch (eventType) {
        case 'staff_unit_history':
            return 'userData.staff.unit.history';
        case 'rank_history':
            return 'userData.rank.history';
        case 'penalty_history':
            return 'userData.penalty.history';
        case 'emergency_service_history':
            return 'userData.emergency.service.history';
        case 'work_experience_history':
            return 'userData.work.experience.history';
        case 'secondment_history':
            return 'userData.secondment.history';
        case 'name_change_history':
            return 'userData.name.change.history';
        case 'attestation':
            return 'userData.attestation';
        case 'service_characteristic_history':
            return 'userData.service.characteristic.history';
        case 'status_history':
            return 'userData.status.history';
        case 'coolness_history':
            return 'userData.coolness.history';
        case 'contract_history':
            return 'userData.contract.history';
        case 'badge_history':
            return 'userData.badge.history';
        case 'emergency_history':
            return 'userData.emergency.history';
        default:
            return 'userData.unknown.event';
    }
};

export default getHistoryMessage;
