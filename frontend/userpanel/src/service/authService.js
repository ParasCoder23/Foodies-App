import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_URL = `${API_BASE}/api`;

export const registerUser = async (data) => {
    try {
        const response = await axios.post(
        API_URL+ "/register",
        data
        );
        return response;
    } catch (error) {
        throw error;
    }
}

export const login = async (data) => {
    try {
        const response = await axios.post(API_URL + "/login", data);
        return response;
    }
    catch (error) {
        throw error;
    }
}