import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

export const authService = {
    login: async (credentials) => {
        const response = await axios.post(`${API_URL}/login`, credentials);
        return response.data;
    },

    getCurrentUser: async () => {
        try {
            const response = await axios.get(`${API_URL}/me`);
            return response.data;
        } catch (error) {
            return null;
        }
    }
};