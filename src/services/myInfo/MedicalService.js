import ApiService from '../../auth/FetchInterceptor';

const MedicalService = {
    getMedicalInfo: async (userId) => {
        const response = await ApiService.get(`/medical/medical_profile/profile/${userId}`);

        return response.data;
    },
    updateGeneralUserInformation: async (userId, body) => {
        const response = await ApiService.put(`/medical/general_user_information/${userId}`, body);
        return response.data;
    },
    updateAnthropometricData: async (userId, body) => {
        const response = await ApiService.put(`/medical/anthropometric_data/${userId}`, body);
        return response.data;
    },
    updateHospitalData: async (userId, body) => {
        const response = await ApiService.put(`/medical/hospital_data/${userId}`, body);
        return response.data;
    },
    updateUserLiberations: async (userId, body) => {
        const response = await ApiService.put(`/medical/user_liberations/${userId}`, body);
        return response.data;
    },
    updateDispensaryRegistration: async (userId, body) => {
        const response = await ApiService.put(`/medical/dispensary_registration/${userId}`, body);
        return response.data;
    },
    createHospitalData: async (body) => {
        const response = await ApiService.post('/medical/hospital_data', body);
        return response.data;
    },
    createUserLiberations: async (body) => {
        const response = await ApiService.post('/medical/user_liberations', body);
        return response.data;
    },
    createLibearations: async (body) => {
        try {
            const response = await ApiService.post('/medical/liberations', body);
            return response.data;
        } catch (error) {
            console.log(error)
        }
    },
    createDispensaryRegistration: async (body) => {
        const response = await ApiService.post('/medical/dispensary_registration', body);
        return response.data;
    },
    getLiberations: async () => {
        const response = await ApiService.get('/medical/liberations');
        return response.data;
    },
    deleteHospitalData: async (id) => {
        const response = await ApiService.delete(`/medical/hospital_data/${id}`);
        return response.data;
    },
    deleteUserLiberations: async (id) => {
        const response = await ApiService.delete(`/medical/user_liberations/${id}`);
        return response.data;
    },
    deleteDispensaryRegistration: async (id) => {
        const response = await ApiService.delete(`/medical/dispensary_registration/${id}`);
        return response.data;
    },
};

export default MedicalService;
