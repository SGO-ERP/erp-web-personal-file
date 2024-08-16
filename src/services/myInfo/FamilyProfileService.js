import ApiService from '../../auth/FetchInterceptor';

const FamilyProfileService = {
    get_family_profile: async (userId) => {
        try {
            const response = await ApiService.get(`/family/family_profiles/profile/${userId}`);
            return response.data;
        } catch (error) {
            // Handle errors or log them as needed
            console.error('Failed to fetch family profile:', error);
            throw error;
        }
    },

    getRelations: async () => {
        try {
            const response = await ApiService.get('/family/family_relations');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch family relations:', error);
            throw error;
        }
    },

    updateFamilyMember: async (userId, body) => {
        try {
            const response = await ApiService.put(`/family/families/${userId}`, body);
            return response.data;
        } catch (error) {
            console.error('Failed to update family member:', error);
            throw error;
        }
    },

    createFamilyMember: async (body) => {
        try {
            const response = await ApiService.post('/family/families', body);
            return response.data;
        } catch (error) {
            console.error('Failed to create family member:', error);
            throw error;
        }
    },

    deleteFamilyMember: async (id) => {
        try {
            const response = await ApiService.delete(`/family/families/${id}`);
            return response.data;
        } catch (error) {
            console.error('Failed to delete family member:', error);
            throw error;
        }
    },

    createFamilyMemberViolation: async (family_id,body) => {
        try {
            const response = await ApiService.post(`/family/families/violation/${family_id}/`, body);
            return response.data;
        } catch (error) {
            console.error('Failed to create family member:', error);
            throw error;
        }
    },

    updateFamilyMemberViolation: async (id, body) => {
        try {
            const response = await ApiService.put(`/additional/violation/${id}`, body);
            return response.data;
        } catch (error) {
            console.error('Failed to update family member:', error);
            throw error;
        }
    },

    deleteFamilyMemberViolation: async (id, body) => {
        try {
            const response = await ApiService.delete(`/additional/violation/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Failed to update family member:', error);
            throw error;
        }
    },

    createFamilyMemberAbroadTravel: async (family_id,body) => {
        try {
            const response = await ApiService.post(`/family/families/abroad_travel/${family_id}/`, body);
            return response.data;
        } catch (error) {
            console.error('Failed to create family member:', error);
            throw error;
        }
    },

    updateFamilyMemberAbroadTravel: async (id, body) => {
        try {
            const response = await ApiService.put(`/additional/abroad-travel/${id}`, body);
            return response.data;
        } catch (error) {
            console.error('Failed to update family member:', error);
            throw error;
        }
    },

    deleteFamilyMemberAbroadTravel: async (id, body) => {
        try {
            const response = await ApiService.delete(`/additional/abroad-travel/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Failed to update family member:', error);
            throw error;
        }
    },
};

export default FamilyProfileService;
