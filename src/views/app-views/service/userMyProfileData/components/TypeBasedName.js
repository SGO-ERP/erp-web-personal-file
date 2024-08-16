const getTypeBasedName = (eventType, isEnd) => {
    switch (eventType) {
        case 'identification_card':
            return isEnd ? 'userData.tl.certificate' : 'userData.tl.certificate.end';
        case 'equipments':
            return isEnd ? 'userData.tl.equipment' : 'userData.tl.equipment.end';
        case 'ranks':
            return isEnd ? 'userData.tl.rank' : 'userData.tl.rank.end';
        case 'driving_license':
            return isEnd ? 'userData.tl.drive' : 'userData.tl.drive.end';
        case 'passport':
            return isEnd ? 'userData.tl.passport' : 'userData.tl.passport.end';
        case 'educations':
            return isEnd ? 'userData.tl.education' : 'userData.tl.education.end';
        case 'holidays':
            return isEnd ? 'userData.tl.holiday' : 'userData.tl.holiday.end';
        case 'contracts':
            return isEnd ? 'userData.tl.contract' : 'userData.tl.contract.end';
        case 'badges':
            return 'userData.tl.badge';
        case 'emergency_contracts':
            return 'userData.tl.emergency.contract';
        case 'academic_degrees':
            return 'userData.tl.degree';
        case 'academic_titles':
            return 'userData.tl.title';
        case 'courses':
            return 'userData.tl.course';
        default:
            return 'userData.unknown.event';
    }
};

export default getTypeBasedName;
