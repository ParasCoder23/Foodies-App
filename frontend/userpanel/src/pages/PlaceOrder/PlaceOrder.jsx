import { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { calculateCartTotals } from "../../util/cartUtils";
import axios from "axios";
import { RAZORPAY_KEY } from "../../util/constants";
import {toast} from 'react-toastify'

const PlaceOrder = () => {

    const { foodList, quantites, setQuantites, token } = useContext(StoreContext);

    const navigate = useNavigate();

    const [data, setData] = useState(
        {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            address: '',
            state: '',
            city: '',
            zip: ''
        }
    );

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const orderData = {
            userAddress: `${data.firstName} ${data.lastName}, ${data.address}, ${data.city}, ${data.state}, ${data.zip}`,
            phoneNumber: data.phoneNumber,
            email: data.email,
            orderedItems: cartItems.map(item => (
                {
                    foodId: item.foodId,
                    quantity: quantites[item.id],
                    price: item.price * quantites[item.id],
                    category: item.category,
                    imageUrl: item.imageUrl,
                    description: item.description,
                    name: item.name
                }
            )),
            amount: total.toFixed(2),
            orderStatus: "Preparing"
        };

        try {
            const response = await axios.post("http://localhost:8080/api/orders/create", orderData, { headers: { 'Authorization': `Bearer ${token}` } });
            if (response.status === 201 && response.data.razorpayOrderId) {
                // Initiate the Payment
                initiateRazorpayPayment(response.data);
            }
            else {
                toast.error("Unable to place order. Please try again.")
            }
        } catch (error) {
            toast.error("Unable to place order. Please try again.")
        }
    }

    const initiateRazorpayPayment = (order) => {
        const options = {
            key: RAZORPAY_KEY,
            amount: order.amount, // Convert to paise
            currency: "INR",
            name: "Food Land",
            description: "Food order payment",
            order_id: order.razorpayOrderId,
            handler: async function (razorpayResponse) {
                await verifyPayment(razorpayResponse);
            },
            prefill: {
                name: `${data.firstName} ${data.lastName}`,
                email: data.email,
                contact: data.phoneNumber
            },
            theme: { color: "#3399cc" },
            modal: {
                ondismiss: async function () {
                    toast.error("Payment Cancelled.");
                    await deleteOrder(order.id);
                },
            },
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();
    };

    const verifyPayment = async (razorpayResponse) => {
        const paymentData = {
            razorpay_payment_id: razorpayResponse.razorpay_payment_id,
            razorpay_order_id: razorpayResponse.razorpay_order_id,
            razorpay_signature: razorpayResponse.razorpay_signature
        }

        try {
            const response = await axios.post("http://localhost:8080/api/orders/verify", paymentData, { headers: { 'Authorization': `Bearer ${token}` } });
            if (response.status === 200) {
                toast.success("Payment successful.");
                await clearCart();
                navigate("/myorders");
            }
            else {
                toast.error("Payment failed. Please try again.");
                navigate('/');
            }
        } catch (error) {
            toast.error("Payment failed. Please try again.");
        }
    }

    const deleteOrder = async (orderId) => {
        try {
            await axios.delete("http://localhost:8080/api/orders/" + orderId, { headers: { 'Authorization': `Bearer ${token}` } });
        } catch (error) {
            toast.error("Something went wrong. Contact support.");
        }
    }

    const clearCart = async () => {
        try {
            await axios.delete("http://localhost:8080/api/cart" , { headers: { 'Authorization': `Bearer ${token}` } });
            setQuantites({});
        } catch (error) {
            toast.error("Error while clearing the cart.");
        }
    }


    // Cart Items

    const cartItems = foodList.filter(food => quantites[food.id] > 0)

    // Calculations

    const { subTotal, shipping, tax, total } = calculateCartTotals(cartItems, quantites);

    return (
        <div className="container">
            <main>

                <div className=" text-center"> <img className="d-block mx-auto " src={assets.checkout} alt="" width="98" height="98" /> </div>

                <div className="row g-5"> <div className="col-md-5 col-lg-4 order-md-last"> <h4 className="d-flex justify-content-between align-items-center mb-3"> <span className="text-primary">Your cart</span> <span className="badge bg-primary rounded-pill">{cartItems.length}</span> </h4> <ul className="list-group mb-3">
                    {
                        cartItems.map((item, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between lh-sm"> <div> <h6 className="my-0">{item.name}</h6> <small className="text-body-secondary">Qty: {quantites[item.id]}</small> </div> <span className="text-body-secondary">&#8377; {item.price * quantites[item.id]} </span> </li>
                        ))
                    } <li className="list-group-item d-flex justify-content-between"> <div> <span>Shipping </span> </div> <span className="text-body-secondary">&#8377; {subTotal === 0 ? 0.0 : shipping.toFixed(2)}</span> </li> <li className="list-group-item d-flex justify-content-between "> <div>  <span >Tax</span> </div> <span className="text-body-secondary">&#8377; {tax.toFixed(2)}</span> </li> <li className="list-group-item d-flex justify-content-between"> <span>Total (INR)</span> <strong>&#8377; {subTotal === 0 ? 0.0 : total.toFixed(2)}</strong> </li> </ul>  </div> <div className="col-md-7 col-lg-8"> <h4 className="mb-3">Billing address</h4> <form className="needs-validation" onSubmit={onSubmitHandler}> <div className="row g-3"> <div className="col-sm-6"> <label htmlFor="firstName" className="form-label" >First name</label> <input type="text" className="form-control" id="firstName" placeholder="John" required
                        name="firstName" onChange={onChangeHandler} value={data.firstName} /> </div> <div className="col-sm-6"> <label htmlFor="lastName" className="form-label" >Last name</label> <input type="text" className="form-control" id="lastName" placeholder="Doe" required name="lastName" onChange={onChangeHandler} value={data.lastName} /> </div> <div className="col-12"> <label htmlFor="username" className="form-label">Email</label> <div className="input-group has-validation"> <span className="input-group-text">@</span> <input type="email" className="form-control" id="email" placeholder="Email" required name="email" onChange={onChangeHandler} value={data.email} />  </div> </div>
                        <div className="col-12"> <label htmlFor="phone" className="form-label">Phone Number</label> <input type="number" className="form-control" id="phone" placeholder="8723767378" required name="phoneNumber" onChange={onChangeHandler} value={data.phoneNumber} /> </div>
                        <div className="col-12"> <label htmlFor="address" className="form-label">Address</label> <input type="text" className="form-control" id="address" placeholder="1234 Main St" required name="address" value={data.address} onChange={onChangeHandler} /> </div> <div className="col-md-5"> <label htmlFor="state" className="form-label">State</label> <select className="form-select" id="state" required name="state" value={data.state} onChange={onChangeHandler}> <option >Choose...</option> <option>Haryana</option> <option>Delhi</option>
                            <option>Punjab</option>
                            <option>Himachal Pradesh</option> </select> </div> <div className="col-md-4"> <label htmlFor="city" className="form-label">City</label> <select className="form-select" id="city" required name="city" value={data.city} onChange={onChangeHandler}> <option >Choose...</option> <option>Ambala</option>
                                <option>Amritsar</option>
                                <option>Bengaluru</option>
                                <option>Shimla</option>
                                <option>Solan</option>
                                <option>Patiala</option>
                                <option>Ludhiana</option>
                                <option>Yamunanagar</option> </select> </div> <div className="col-md-3"> <label htmlFor="zip" className="form-label">Zip</label> <input type="number" className="form-control" id="zip" placeholder="763812" required name="zip" value={data.zip} onChange={onChangeHandler} /> </div> </div> <hr className="my-4" /> <button className="w-100 btn btn-primary btn-lg" type="submit" disabled={cartItems.length === 0}>Continue to checkout</button> </form> </div>
                </div>
            </main>
        </div>
    )
}

export default PlaceOrder;