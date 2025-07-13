import { useContext } from "react";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

const PlaceOrder = () => {

    const {foodList, quantites, setQuantites} = useContext(StoreContext);

    // Cart Items

    const cartItems = foodList.filter(food => quantites[food.id] > 0)

    // Calculations

    const subTotal = cartItems.reduce((acc, food) => acc + food.price * quantites[food.id], 0);
    const shipping = subTotal === 0 ? 0.0 : 10;
    const tax = subTotal * 0.1;
    const total = subTotal + shipping + tax

    return (
        <div className="container">
            <main>

                <div className=" text-center"> <img className="d-block mx-auto " src={assets.checkout} alt="" width="98" height="98" /> </div>

                <div className="row g-5"> <div className="col-md-5 col-lg-4 order-md-last"> <h4 className="d-flex justify-content-between align-items-center mb-3"> <span className="text-primary">Your cart</span> <span className="badge bg-primary rounded-pill">{cartItems.length}</span> </h4> <ul className="list-group mb-3"> 
                    {
                        cartItems.map(item => (
                            <li className="list-group-item d-flex justify-content-between lh-sm"> <div> <h6 className="my-0">{item.name}</h6> <small className="text-body-secondary">Qty: {quantites[item.id]}</small> </div> <span className="text-body-secondary">&#8377; {item.price * quantites[item.id]} </span> </li>
                        ))
                    } <li className="list-group-item d-flex justify-content-between"> <div> <span>Shipping </span> </div> <span className="text-body-secondary">&#8377; {shipping}</span> </li> <li className="list-group-item d-flex justify-content-between "> <div>  <span >Tax</span> </div> <span className="text-body-secondary">&#8377; {tax}</span> </li> <li className="list-group-item d-flex justify-content-between"> <span>Total (INR)</span> <strong>&#8377; {total}</strong> </li> </ul>  </div> <div className="col-md-7 col-lg-8"> <h4 className="mb-3">Billing address</h4> <form className="needs-validation" noValidate> <div className="row g-3"> <div className="col-sm-6"> <label htmlFor="firstName" className="form-label" >First name</label> <input type="text" className="form-control" id="firstName" placeholder="John" required /> </div> <div className="col-sm-6"> <label htmlFor="lastName" className="form-label" >Last name</label> <input type="text" className="form-control" id="lastName" placeholder="Doe" required /> </div> <div className="col-12"> <label htmlFor="username" className="form-label">Email</label> <div className="input-group has-validation"> <span className="input-group-text">@</span> <input type="email" className="form-control" id="email" placeholder="Email" required />  </div> </div>  <div className="col-12"> <label htmlFor="address" className="form-label">Address</label> <input type="text" className="form-control" id="address" placeholder="1234 Main St" required /> </div>
                    <div className="col-12"> <label htmlFor="phone" className="form-label">Phone Number</label> <input type="number" className="form-control" id="phone" placeholder="8723767378" required /> </div>  <div className="col-md-5"> <label htmlFor="country" className="form-label">Country</label> <select className="form-select" id="country" required> <option >Choose...</option> <option>India</option> </select> </div> <div className="col-md-4"> <label htmlFor="state" className="form-label">State</label> <select className="form-select" id="state" required> <option >Choose...</option> <option>Karnataka</option>
                    <option>Haryana</option>
                    <option>Punjab</option>
                    <option>Himachal Pradesh</option> </select> </div> <div className="col-md-3"> <label htmlFor="zip" className="form-label">Zip</label> <input type="number" className="form-control" id="zip" placeholder="763812" required /> </div> </div> <hr className="my-4" /> <button className="w-100 btn btn-primary btn-lg" type="submit" >Continue to checkout</button> </form> </div>
                </div>
            </main>
        </div>
    )
}

export default PlaceOrder;