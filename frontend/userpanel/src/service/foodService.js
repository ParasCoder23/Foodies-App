import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_URL = `${API_BASE}/api/foods`;

export const fetchFoodList = async () => {
    try {
        const response = await axios.get(API_URL)
        return response.data;
    } catch (error) {
        console.log('Error fetching the food list', error)
        throw error;
    }
}

export const fetchFoodDetails = async (id) => {
    try{
        const response = await axios.get(API_URL+'/'+id)
        return response.data;
    }
    catch(error){
        console.log('Error fetching food details');
        throw error;
    }
}