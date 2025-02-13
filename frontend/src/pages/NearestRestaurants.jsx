import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaEye,
  FaRegStar,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaStar,
  FaStarHalfAlt,
  FaSearch,
  FaChevronDown,
  FaExpand,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Spinner from "../components/Spinner";

const NearestRestaurants = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [message, setMessage] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [distance, setDistance] = useState(5000);
  const [loading, setLoading] = useState(false);
  const backendurl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (currentUser) {
      fetchNearestRestaurants();
    }
  }, [distance, currentUser]);

  const fetchNearestRestaurants = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${backendurl}/user/${currentUser._id}/nearest-restaurant?distance=${distance}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error(
          `Failed to fetch nearest restaurants: ${res.statusText}`
        );
      }
      const data = await res.json();
      if (data.message) {
        setMessage(data.message);
        setRestaurants([]);
      } else {
        setMessage("");
        setRestaurants(data);
      }
    } catch (error) {
      setMessage("An error occurred while fetching restaurants.");
    } finally {
      setLoading(false);
    }
  };

  const handleExpandSearch = () => {
    setDistance((prevDistance) => prevDistance + 5000);
  };

  const handleViewDetails = (id) => {
    navigate(`/restaurant/${id}`);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100vh">
        <div className="container mx-auto p-6">
          <div className="text-center mt-10 mb-6">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Your Nearest Eateries!
            </h2>
          </div>
          <div className="lg:flex lg:items-center lg:justify-between mb-6">
            <div className="mt-5 flex lg:ml-4 lg:mt-0 space-x-3">
              <button
                onClick={() => navigate("/user/current-location")}
                type="button"
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50"
              >
                <FaMapMarkerAlt className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" />
                Change Location
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-yellow-500 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-yellow-400"
                onClick={handleExpandSearch}
              >
                <FaSearch className="-ml-0.5 mr-1.5 h-5 w-5" />
                See More
              </button>
            </div>
          </div>

          {loading && (
            <p className="text-center text-gray-500">
              <Spinner />
            </p>
          )}

          {restaurants.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {restaurants.map((restaurant) => {
                const fullStars = Math.floor(restaurant.averageRating);
                const hasHalfStar = restaurant.averageRating % 1 >= 0.5;
                const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
                const formattedRating = restaurant.averageRating.toFixed(1);

                return (
                  <div
                    key={restaurant._id}
                    className="relative bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
                  >
                    
                    <div className="relative">
                      {/* Cover Photo */}
                      <img
                        src={restaurant.coverPhoto}
                        alt="Cover Photo"
                        className="w-full h-40 object-cover"
                      />
                      {restaurant.specialDeals.length > 0 && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-gray-900 text-xs font-semibold px-2 py-1 rounded-lg shadow-md">
                        Special Offers Available
                      </div>
                    )}

                      {/* Profile Photo - Positioned to Overlap */}
                      {/* <img
                        src={restaurant?.profilePicture}
                        alt="Profile Photo"
                        className="h-20 w-20 rounded-full border-4 border-gray-700 shadow-lg object-cover absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      /> */}
                    </div>

                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100">
                      <button
                        className="text-white text-sm font-semibold flex items-center bg-yellow-500 px-3 py-1 rounded"
                        onClick={() => handleViewDetails(restaurant._id)}
                      >
                        <FaExpand className="mr-2" /> View Details
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {restaurant.title}
                      </h3>
                      <div className="flex items-center mb-2">
                        {[...Array(fullStars)].map((_, index) => (
                          <FaStar
                            key={index}
                            className="h-5 w-5 text-yellow-400"
                          />
                        ))}
                        {hasHalfStar && (
                          <FaStarHalfAlt className="h-5 w-5 text-yellow-400" />
                        )}
                        {[...Array(emptyStars)].map((_, index) => (
                          <FaRegStar
                            key={index}
                            className="h-5 w-5 text-gray-300"
                          />
                        ))}
                        <span className="ml-2 text-gray-700">
                          {formattedRating}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-2">
                        {restaurant.about}
                      </p>
                      <p className="text-gray-600 text-sm mb-2">
                        <FaPhoneAlt className="inline mr-1" />
                        {restaurant.hotline}
                      </p>
                      <p className="text-gray-600 text-sm">
                        <FaEnvelope className="inline mr-1" />
                        {restaurant.officialEmail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {restaurants.length === 0 ? (
            <p className="text-center text-gray-500">
              No restaurants found. Click See more to expand your search.
            </p>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default NearestRestaurants;
