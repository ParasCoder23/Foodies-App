import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { fetchFoodList } from "../service/foodService";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {

    const [foodList, setFoodList] = useState([]);

    const [quantites, setQuantites] = useState({})

    const increaseQty = (foodId) => {                
        setQuantites((prev) => ({...prev, [foodId]: (prev[foodId] || 0) + 1 }));
    }

    const decreaseQty = (foodId) => {
        setQuantites((prev) => ({...prev, [foodId]: prev[foodId] > 0 ? prev[foodId] - 1 : 0 }));
    }

    const removeFromCart = (foodId) => {
        setQuantites((prevQuantites) => {
            const updateQuantites = {...prevQuantites};
            delete updateQuantites[foodId]
            return updateQuantites;
        })
    }

    const contextValue = {
        foodList,
        increaseQty,
        decreaseQty,
        quantites,
        removeFromCart
    };

    useEffect(() => {
        async function loadData(){
            const data = await fetchFoodList();
            setFoodList(data);
        }
        loadData();
    }, []);

    return (
        <StoreContext.Provider value = {contextValue}>
        {
            props.children
        }
        </StoreContext.Provider>
    )
}