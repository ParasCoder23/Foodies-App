import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { fetchFoodList } from "../service/foodService";
import { addToCart, getCartData, removeQtyFromCart } from "../service/cartService";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {

    const [foodList, setFoodList] = useState([]);

    const [quantites, setQuantites] = useState({})

    const [token, setToken] = useState("");

    const increaseQty = async (foodId) => {                
        setQuantites((prev) => ({...prev, [foodId]: (prev[foodId] || 0) + 1 }));
        await addToCart(foodId, token)        
    }

    const decreaseQty = async (foodId) => {
        setQuantites((prev) => ({...prev, [foodId]: prev[foodId] > 0 ? prev[foodId] - 1 : 0 }));
        await removeQtyFromCart(foodId, token)        
    }

    const removeFromCart = (foodId) => {
        setQuantites((prevQuantites) => {
            const updateQuantites = {...prevQuantites};
            delete updateQuantites[foodId]
            return updateQuantites;
        })
    }

    const loadCartData = async (token) => {
        const items = await getCartData(token)
        setQuantites(items);
    }

    const contextValue = {
        foodList,
        increaseQty,
        decreaseQty,
        quantites,
        removeFromCart,
        token,
        setToken,
        setQuantites,
        loadCartData
    };

    useEffect(() => {
        async function loadData(){
            const data = await fetchFoodList();
            setFoodList(data);
            if(localStorage.getItem('token')){
                setToken(localStorage.getItem('token'));
                await loadCartData(localStorage.getItem('token'))
            }
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