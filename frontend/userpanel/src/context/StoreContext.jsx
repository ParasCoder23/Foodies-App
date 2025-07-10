import { createContext, useEffect, useState } from "react";
import axios from 'axios'

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {

    const [foodList, setFoodList] = useState([]);

    const fetchFood = async() =>{
        const response = await axios.get('http://localhost:8080/api/foods')
        setFoodList(response.data);
        console.log(response.data);
    }

    const contextValue = {
        foodList
    };

    useEffect(() => {
        async function loadData(){
            await fetchFood();
        }
        loadData();
    }, []);

    return (
        <StoreContext.Provider value = {props}>
        {
            props.children
        }
        </StoreContext.Provider>
    )
}