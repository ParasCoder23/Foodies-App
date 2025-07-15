export const calculateCartTotals = (cartItems, quantites) => {
    const subTotal = cartItems.reduce((acc, food) => acc + food.price * quantites[food.id], 0);
    const shipping = subTotal === 0 ? 0.0 : 10;
    const tax = subTotal * 0.1;
    const total = subTotal + shipping + tax

    return {shipping, tax, subTotal, total}
}