import { useState } from 'react'
import './Register.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { toast } from 'react-toastify';
import { registerUser } from '../../service/authService';


const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({
      ...data, [name]: value
    }));
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await registerUser(data);
      if (response.status === 201) {
        toast.success("Registration completed. Please login.")
        navigate('/login')
      }
      else {
        toast.error("Unable to register. Please try again");
      }
    } catch (error) {
      toast.error("Unable to register. Please try again");
    }
  }

  return (
    <div className="register-container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
              <h5 className="card-title text-center mb-5 fw-light fs-5">Sign Up</h5>
              <form onSubmit={onSubmitHandler}>
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="floatingName" placeholder="John Doe"
                    name='name'
                    onChange={onChangeHandler}
                    value={data.name} required />
                  <label htmlFor="floatingName">Full Name</label>
                </div>
                <div className="form-floating mb-3">
                  <input type="email" className="form-control" id="floatingEmail" placeholder="john.doe@example.com"
                    name='email'
                    onChange={onChangeHandler}
                    value={data.email} required />
                  <label htmlFor="floatingEmail">Email</label>
                </div>
                <div className="form-floating mb-3">
                  <input type="password" className="form-control" id="floatingPassword" placeholder="Password"
                    name='password'
                    onChange={onChangeHandler}
                    value={data.password} required />
                  <label htmlFor="floatingPassword">Password</label>
                </div>
                <div className="d-grid">
                  <button className="btn btn-outline-primary btn-login text-uppercase" type="submit">Register</button>
                  <button className="btn btn-outline-danger btn-login text-uppercase mt-2" type="reset">Reset</button>
                </div>
                <div className="mt-4">
                  Already have an account? <Link to={'/login'} >Sign in</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register;