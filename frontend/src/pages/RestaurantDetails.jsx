import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaMapSigns,
  FaStar,
  FaStarHalfAlt,
  FaStarHalf,
  FaRegStar,
  FaSalesforce,
  FaTags,
  FaHamburger,
  FaWineBottle,
  FaWineGlass,
  FaLocationArrow,
} from "react-icons/fa";
import StarRating from "../components/StarRating";
import { toast } from "react-toastify";

const backendurl = import.meta.env.VITE_BACKEND_URL;

const RestaurantDetails = () => {
  const { id } = useParams(); // Get the restaurant ID from the URL
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stars, setStars] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fullStars, setFullStars] = useState(null);
  const [hasHalfStar, setHasHalfStar] = useState(null);
  const [emptyStars, setEmptyStars] = useState(null);
  const [formattedRating, setFormattedRating] = useState(null);

  const navigate = useNavigate();

  const handleRating = async () => {
    console.log("Submitting rating:", stars);
    const id = restaurant._id;
    const rating = stars;
    try {
      const res = await fetch(`${backendurl}/restaurant/${id}/addrating`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ rating }),
      });
      if (!res.ok) {
        toast.error("Failed to submit rating");
        throw new Error(`Failed to submit rating: ${res.statusText}`);
      }
      const data = await res.json();
      console.log("Rating submission response:", data); // Log the response
      setSuccess(true);
      toast.success("Rating submitted successfully!");
      // Optionally: close the modal or show a success message
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const res = await fetch(`${backendurl}/restaurant/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(
            `Failed to fetch restaurant details: ${res.statusText}`
          );
        }
        const data = await res.json();
        console.log("Fetched data:", data); // Log the fetched data
        setRestaurant(data);
        setFullStars(Math.floor(data.averageRating));
        setHasHalfStar(data.averageRating % 1 >= 0.5);
        setEmptyStars(5 - fullStars - (hasHalfStar ? 1 : 0));
        setFormattedRating(data.averageRating.toFixed(1));
        console.log(emptyStars);
        console.log(restaurant);
      } catch (error) {
        setError("An error occurred while fetching restaurant details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [id]);

  useEffect(() => {
    console.log("Restaurant state:", restaurant); // Log the state whenever it updates
  }, [restaurant]);

  const handleViewDirections = (id) => {
    navigate(`/user/view-directions/${id}`);
  };

  const groupedMenuItems = (restaurant?.menu || []).reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="p-4">
      <div className="h-100vh">
        {/* Cover Photo Section */}
        <div className="relative w-full">
          {/* Cover Photo */}
          <div
            className="bg-gray-300 h-40 w-full"
            style={{
              backgroundImage: `url(${restaurant?.coverPhoto})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          {/* Profile Photo - Overlapping Bottom-Left */}
          <img
            src={restaurant?.profilePicture}
            alt="Profile Photo"
            className="h-48 w-48 rounded-full border-4 border-white shadow-lg object-cover absolute bottom-0 right-16 transform translate-y-1/2"
          />
        </div>

        {/* Profile Section */}
        <div className="flex-col items-center space-x-4 mb-4 ml-8 mt-8">
          <div>
            
            <h1 className="text-5xl font-extrabold text-gray-900">
              {restaurant?.title}
              
            </h1>
            
            <button
              className="mt-4 bg-yellow-500 text-gray-900 py-1 px-3 rounded flex items-center"
              onClick={() => handleViewDirections(restaurant?._id)}
            >
              <FaLocationArrow className="mr-2" /> View Directions
            </button>
            <p className="text-lg text-gray-700 mt-2">{restaurant?.about}</p>
            <div className="flex items-center mb-2">
              {[...Array(fullStars)].map((_, index) => (
                <FaStar key={index} className="h-6 w-6 text-yellow-400" />
              ))}
              {hasHalfStar && (
                <FaStarHalfAlt className="h-6 w-6 text-yellow-400" />
              )}

              {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map(
                (_, index) => (
                  <FaRegStar key={index} className="h-6 w-6 text-gray-300" />
                )
              )}

              <span className="text-gray-700 ml-2">{formattedRating}</span>
            </div>

            {/* <hr className="my-4 border-t-4 border-yellow-500 mt-8 rounded" /> */}
            <div className="flex items-center space-x-8 mb-4">
              <div className="flex items-center text-md text-gray-700">
                <FaMapMarkerAlt className="mr-2 text-gray-500" />{" "}
                {restaurant?.address}
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <FaEnvelope className="mr-2 text-gray-500" />{" "}
                {restaurant?.officialEmail}
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <FaPhoneAlt className="mr-2 text-gray-500" />{" "}
                {restaurant?.hotline}
              </div>
              <button
                className="  bg-black hover:bg-yellow-500 text-white py-1 px-3 rounded flex items-center text-sm"
                onClick={() =>
                  document.getElementById("my_modal_2").showModal()
                }
              >
                <FaStar className="mr-2" /> Rate Us
              </button>
              <dialog id="my_modal_2" className="modal">
                <div className="modal-box text-center text-gray-700 p-4 bg-white rounded shadow-lg">  
                  <h3 className="font-bold text-lg justify-center mb-4">Rate Us</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    How was your experience at {restaurant?.title}? Rate us below!
                  </p>
                  <div className="flex items-center justify-center gap-6">
                  <StarRating onRatingChange={(rating) => setStars(rating)}/>
                  </div>
                  <div className="modal-action justify-center">
                    <form method="dialog">
                      <button
                        type="button"
                        className="btn bg-yellow-500 text-white"
                        aria-label="Submit Rating"
                        onClick={handleRating}
                      >
                        Submit
                      </button>
                      <span> </span>
                      <button className="btn text-white bg-gray-700">Close</button>
                    </form>
                  </div>
                </div>
              </dialog>
            </div>
          </div>
        </div>
      </div>
      

      <div className="mt-12 bg-yellow-50  p-8 border-2 border-black rounded ml-16 mr-16 mb-12">
        
        <h3 className="text-3xl font-extrabold text-black leading-tight flex  gap-4">
          <span class="relative flex size-3">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-900 opacity-75"></span>
            <span class="relative inline-flex size-3 rounded-full bg-green-500"></span>
          </span>
          Special Offers
        </h3>

        <div className="flex flex-wrap gap-6 justify-center px-8">
          {restaurant?.specialDeals &&
            restaurant.specialDeals.map((deal, index) => (
              <div
                key={index}
                className="relative bg-white rounded-2xl shadow-lg overflow-hidden w-80 transform transition-all hover:scale-105"
              >
                {/* Deal Image */}
                <div className="relative">
                  <img
                    src={
                      deal.photo ||
                      "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
                    }
                    alt={deal.name}
                    className="w-full h-48 object-cover"
                  />
                  {/* Discount Badge */}
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-s font-semibold px-3 py-1 shadow-md">
                    {deal.price_discount} OFF
                  </span>
                </div>

                {/* Deal Info */}
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    {deal.name}
                  </h2>
                  <p className="text-gray-600 text-sm mt-2">
                    {deal.dealDescription}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      <hr className="my-4 border-t-2 border-gray-300 mt-12" />

      {/* Restaurant Information */}
      <div className="mt-4 ml-16 mr-16 bg-white p-4">
        {/* Menu */}
        <div className="overflow-x-auto mt-6 mx-auto w-3/4  ">
          <h3 className="text-3xl font-extrabold text-black  leading-tight  flex justify-center gap-4 ">
  
            Explore the Menu
          </h3>

          <table className="table mt-6 border-4 border-black rounded-lg">
            <thead>
              <tr>
                <th></th>
                {/* <th>Description</th> */}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedMenuItems).map((category, catIndex) => (
                <React.Fragment key={catIndex}>
                  <tr>
                    <td
                      colSpan="3"
                      className="font-bold text-lg text-gray-800 bg-gray-100 rounded-md py-2 px-4 mb-4"
                    >
                      {category}
                    </td>
                  </tr>
                  {groupedMenuItems[category].map((item, index) => (
                    <tr key={index} className="hover:cursor-pointer">
                      <td>
                        <div className="flex items-center gap-12 ">
                          <div className="avatar">
                            <div className="mask mask-squircle h-24 w-24">
                              <img
                                src={
                                  item.photo ||
                                  "https://img.daisyui.com/tailwind-css-component-profile-2@56w.png"
                                }
                                alt={item.itemName}
                              />
                            </div>
                          </div>
                          <div className=" flex flex-col">
                            <div className="font-bold text-gray-900 text-lg">
                              {item.itemName}
                            </div>
                            <div>{item.description}</div>
                          </div>
                        </div>
                      </td>
                      {/* <td>{item.description}</td> */}
                      <td className="font-bold text-gray-900 text-lg"> Rs. {item.price}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Special Deals */}
      </div>
    </div>
  );
};

export default RestaurantDetails;
