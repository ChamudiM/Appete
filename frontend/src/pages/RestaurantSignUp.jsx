import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signUpFailure,
  signUpSuccess,
  signUpStart,
} from "../redux/user/restaurantSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
const backendurl = import.meta.env.VITE_BACKEND_URL

const RestaurantSignUp = () => {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.restaurant);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //setError(null);

    try {
      dispatch(signUpStart());
      const res = await fetch(`${backendurl}/restaurant/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(signUpFailure(data.message));
        toast.error(data.message);
        return;
      }

      dispatch(signUpSuccess(data));
      toast.success("Account created successfully!");
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/restaurant/sign-in");
      }, 500); // Hide success message after 0.5 seconds
    } catch (error) {
      toast.error(error.message);
      dispatch(signUpFailure(error.message));
    }
  };

  return (
    <>
      <section className="relative flex  flex-wrap lg:h-screen lg:items-center">
        <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-2xl font-bold sm:text-3xl">
              Get started today!
            </h1>

            <p className="mt-4 text-gray-500">
              Join our network of top restaurants and showcase your menu,
              special offers, and more. Sign up now to start attracting new
              customers and growing your business!
            </p>
          </div>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6 " onSubmit={handleSubmit} method="POST">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Restaurant Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="title"
                      name="title"
                      type="text"
                      autoComplete="off"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="officialEmail"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="officialEmail"
                      name="officialEmail"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
                  >
                    Sign Up
                  </button>
                </div>
              </form>

              {/* {success && (
                <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                  Account created successfully!
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )} */}
              <p className="mt-10 text-center text-sm text-gray-500 gap-4">
                Have an account?
                
                <Link
                  to="/restaurant/sign-in"
                  className="font-semibold leading-6 text-yellow-500 hover:text-yellow-400"
                >

                  Sign in now
                </Link>
              </p>
          </div>
        </div>

        <div className="relative w-full sm:h-96 lg:h-full lg:w-1/2">
          <img
            alt=""
            src="https://img.freepik.com/free-photo/happy-waiter-serving-food-group-cheerful-friends-pub_637285-12525.jpg?t=st=1722688466~exp=1722692066~hmac=62f2b895b6a24afaf92ea5362e0f93b5c488b8641d23ddbdaa8766f6a8f610c0&w=996"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </section>
    </>
  );
};

export default RestaurantSignUp;
