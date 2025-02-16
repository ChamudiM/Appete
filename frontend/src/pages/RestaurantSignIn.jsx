import React, { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify components
import "react-toastify/dist/ReactToastify.css";
import { signInFailure, signInStart, signInSuccess } from "../redux/user/restaurantSlice";
const backendurl = import.meta.env.VITE_BACKEND_URL
console.log(backendurl)
const RestaurantSignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.restaurant);
  const [success, setSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 3000); // Hide error message after 3 seconds
      return () => clearTimeout(timer); // Cleanup the timer if component unmounts
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const res = await fetch(`${backendurl}/restaurant/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSuccess(data));
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/restaurant/dashboard");
      }, 500); // Hide success message after 0.5 seconds
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div>
      {/*
  Heads up! 👋

  Plugins:
    - @tailwindcss/forms
*/}

<section className="relative flex flex-wrap lg:h-screen lg:items-center">
  <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24">
    <div className="mx-auto max-w-lg text-center">
      <h1 className="text-2xl font-bold sm:text-3xl">Sign In to Elevate Your Restaurant!</h1>

      <p className="mt-4 text-gray-500">
      Sign in now to streamline your operations and connect with more customers. Your next step towards growing your business starts here!
      </p>
    </div>
    <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-8">
          <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="officialEmail" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
              <div className="mt-2">
                <input id="officialEmail" 
                  name="officialEmail" 
                  type="email" 
                  autoComplete="email" 
                  required 
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6"
                  onChange={handleChange} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
               
              </div>
              <div className="mt-2">
                <input id="password" 
                  name="password" 
                  type="password" 
                  autoComplete="current-password" 
                  required 
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6"
                  onChange={handleChange} />
              </div>
            </div>

            <div>
              <button type="submit" className="flex w-full justify-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500">Sign in</button>
            </div>
          </form>
          {success && (
            toast.success("Sign in successful!", { autoClose: 3000 })
          )}

          {showError && (
            toast.error(error, { autoClose: 3000 })
          )}
          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?
            <Link to="/restaurant/sign-up" className="font-semibold leading-6 text-yellow-500 hover:text-yellow-400">Sign up now</Link>
          </p>
        </div>

    
  </div>

  <div className="relative h-64 w-full sm:h-96 lg:h-full lg:w-1/2">
    <img
      alt=""
      src="https://img.freepik.com/free-photo/happy-waiter-serving-food-group-cheerful-friends-pub_637285-12525.jpg?t=st=1722688466~exp=1722692066~hmac=62f2b895b6a24afaf92ea5362e0f93b5c488b8641d23ddbdaa8766f6a8f610c0&w=996"
      className="absolute inset-0 h-full w-full object-cover"
    />
  </div>
</section>
    </div>
  );
};

export default RestaurantSignIn;
