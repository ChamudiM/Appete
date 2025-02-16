import React, { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { signOut } from "../redux/user/restaurantSlice";
import restaurantCover from "../assets/restaurant-cover.jpg";import {
  FaBars,
  FaArrowRight,
  FaHome,
  FaUserEdit,
  FaUtensils,
  FaTag,
  FaMapMarkerAlt,
  FaEdit,
  FaTrash,
  FaSadTear,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaTags,
  FaListAlt,
  FaHamburger,
  FaSignOutAlt,
  FaInfo,
  FaInfoCircle,
} from "react-icons/fa";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteRestaurantFailure,
  deleteRestaurantSuccess,
  deleteRestaurantStart,
} from "../redux/user/restaurantSlice";
import { toast } from "react-toastify";

const backendurl = import.meta.env.VITE_BACKEND_URL;

const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState(null);
  const { currentRestaurant } = useSelector((state) => state.restaurant);
  console.log(currentRestaurant);
  //console.log(currentRestaurant.menu);
  const menuItems = currentRestaurant.menu;
  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const fullStars = Math.floor(currentRestaurant.averageRating);
  const hasHalfStar = currentRestaurant.averageRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const formattedRating = currentRestaurant.averageRating.toFixed(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  // Example profile photo URL
  const profilePhotoUrl = currentRestaurant.profilePicture;
  // Example cover photo URL
  const coverPhotoUrl = currentRestaurant.coverPhoto;

  const handleSignout = async () => {
    try {
      await fetch(`${backendurl}/restaurant/signout`);
      dispatch(signOut());
      navigate("/restaurant/sign-in");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteMenuItem = async (id, menuid) => {
    try {
      dispatch(updateStart());
      const response = await fetch(
        `${backendurl}/restaurant/${id}/menu/delete/${menuid}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        // If the response is not ok, throw an error
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete menu item");
        throw new Error(errorData.message || "Failed to delete menu item");
      }

      const data = await response.json();
      console.log(data);

      dispatch(updateSuccess(data));

      toast.success("Menu item deleted successfully");

      // Update UI state to reflect the deletion (instead of reloading the page)
      // For example, you might want to call a function to refresh the menu list or remove the item from state
      // refreshMenuList(); // Example function, implement as needed
    } catch (error) {
      console.error("Error deleting menu item:", error.message);
      toast.error("Failed to delete menu item");
      dispatch(updateFailure());
    }
  };

  const handleDeleteOffer = async (id, offerid) => {
    try {
      dispatch(updateStart());
      const response = await fetch(
        `${backendurl}/restaurant/${id}/offers/delete/${offerid}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        // If the response is not ok, throw an error
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete offer");
        throw new Error(errorData.message || "Failed to delete offer");
      }

      const data = await response.json();
      console.log(data);

      dispatch(updateSuccess(data));

      console.log("Offer deleted successfully:", data);
      toast.success("Offer deleted successfully");
    } catch (error) {
      console.error("Error deleting offer:", error.message);
      toast.error("Failed to delete offer");
      dispatch(updateFailure());
    }
  };

  const handleDeleteRestaurant = async () => {
    try {
      dispatch(deleteRestaurantStart());
      const res = await fetch(
        `${backendurl}/restaurant/delete/${currentRestaurant._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteRestaurantFailure(data));
        return;
      }

      dispatch(deleteRestaurantSuccess(data));
      navigate("/restaurant/sign-in");
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      toast.error("Failed to delete restaurant");
      dispatch(deleteRestaurantFailure());
    }
  };

  useEffect(() => {
    const handleFill = async () => {
      try {
        const res = await fetch(
          `${backendurl}/restaurant/myprofile/${currentRestaurant._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await res.json();
        if (data.success === false) {
          return;
        }
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to fetch profile data");
      }
    };

    handleFill();
  }, [currentRestaurant._id]);

  if (!profileData) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      {/* Sidebar */}
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col justify-center w-full pl-8 pr-8">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden"
          >
            <FaBars />
          </label>
          <div w-full>
            <div className="relative w-full">
              {/* Cover Photo */}
              <div
                className="bg-gray-300 h-40 w-100"
                style={{
                  backgroundImage: `url(${currentRestaurant.coverPhoto})`,
                  backgroundSize: "cover",
                  backgroundPosition: "fixed",
                }}
              ></div>

              {/* Profile Photo - Overlapping Bottom-Left */}
              <img
                src={profilePhotoUrl}
                className="h-48 w-48 rounded-full bg-white border-4 border-white shadow-lg object-cover absolute bottom-0 right-16 transform translate-y-1/2"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-5xl font-extrabold text-gray-900 mt-4">
                  {currentRestaurant.title}
                </h1>

                <p className="text-lg text-gray-700 mt-2">
                  {currentRestaurant.about}
                </p>
                <div className="flex items-center mb-2">
                  {[...Array(fullStars)].map((_, index) => (
                    <FaStar key={index} className="h-6 w-6 text-yellow-400" />
                  ))}
                  {hasHalfStar && (
                    <FaStarHalfAlt className="h-6 w-6 text-yellow-400" />
                  )}
                  {[...Array(emptyStars)].map((_, index) => (
                    <FaRegStar key={index} className="h-6 w-6 text-gray-300" />
                  ))}
                  <span className="ml-2 text-gray-700">{formattedRating}</span>
                </div>
              </div>
            </div>
            <dt className="text-3xl font-bold text-neutral-700 leading-tight items-center flex gap-4 mt-16">
              <FaInfoCircle className="ml-2" />
              About {currentRestaurant.title}
            </dt>
            <div className="mt-6 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-md font-medium leading-6 text-gray-900">
                    Address
                  </dt>
                  <dd className="mt-1 text-md leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {currentRestaurant.address}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-md font-medium leading-6 text-gray-900">
                    Email address
                  </dt>
                  <dd className="mt-1 text-md leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {profileData.officialEmail}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-md font-medium leading-6 text-gray-900">
                    Hotline
                  </dt>
                  <dd className="mt-1 text-md leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {profileData.hotline}
                  </dd>
                </div>

                <div className="mt-8 bg-yellow-50  p-8 border-2 border-black rounded   mb-8">
                  <dt className="text-3xl font-bold text-neutral-700 leading-tight items-center flex gap-4   mb-4 ">
                    <FaTags className="ml-2" />
                    Manage Offers
                  </dt>
                  <div className="flex flex-row  justify-center  gap-8">
                    <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0"></dd>
                    {currentRestaurant.specialDeals.map((deal, index) => (
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
                            {deal.price_discount}
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
                        <div className="flex items-center justify-between px-5 py-4 border-t">
                          <button
                            className="flex items-center gap-2 text-red-500 hover:text-red-700 transition"
                            onClick={() => setSelectedOffer(deal)}
                          >
                            <FaTrash />
                            <span className="text-sm font-medium">Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto mt-6 mx-auto items-center justify-center">
                  <dt className="text-3xl font-bold text-neutral-700 leading-tight items-center flex gap-4 mt-8">
                    <FaHamburger className="ml-2" />
                    Manage Menu
                  </dt>
                </div>
              </dl>
            </div>

            <div className="overflow-x-auto mt-6 w-full">
              <table className="table mt-6 border-4 border-black rounded-lg mb-8 w-full">
                <tbody>
                  {Object.keys(groupedMenuItems).length === 0 && (
                    <tr>
                      <td colSpan="3" className="  text-lg text-gray-400 bg-gray-100 rounded-md py-2 px-4 mb-4 w-200 items-center justify-center">
                        No menu items found. Add some to get started.
                      </td>
                    </tr>
                  )}
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
                            <div className="flex items-center gap-12">
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
                              <div className="flex flex-col">
                                <div className=" font-bold text-gray-900 text-lg">
                                  {item.itemName}
                                </div>
                                <div>{item.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="font-bold text-lg text-gray-900">
                            {item.price}
                          </td>
                          <td className="font-bold text-md">
                            <div className="flex items-center gap-4">
                              <button className="btn btn-outline">
                                <Link
                                  to={`/restaurant/${currentRestaurant._id}/menu/edit/${item._id}`}
                                >
                                  <FaEdit />
                                </Link>
                              </button>

                              <button
                                className="btn btn-outline btn-error"
                                onClick={() => setSelectedItem(item)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              {selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold">Confirm Delete</h3>
                    <p>
                      Are you sure you want to delete{" "}
                      <strong>{selectedItem.itemName}</strong>?
                    </p>
                    <div className="flex justify-end mt-4">
                      <button
                        className="btn btn-outline mr-2"
                        onClick={() => setSelectedItem(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-error"
                        onClick={() => {
                          handleDeleteMenuItem(
                            currentRestaurant._id,
                            selectedItem._id
                          );
                          setSelectedItem(null);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {selectedOffer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold">Confirm Delete</h3>
                    <p>
                      Are you sure you want to delete this offer{" "}?
                       
                    </p>
                    <div className="flex justify-end mt-4">
                      <button
                        className="btn btn-outline mr-2"
                        onClick={() => setSelectedOffer(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-error"
                        onClick={() => {
                          handleDeleteOffer(
                            currentRestaurant._id,
                            selectedOffer._id
                          );
                          setSelectedOffer(null);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-gray-300 text-gray-900 min-h-full w-80 p-4 justify-center flex flex-col">
            {/* Sidebar content here */}

            <div className=" items-center justify-center flex flex-col mb-8 ">
              <img
                src={profilePhotoUrl}
                className="h-32 w-32 bg-gray-300 rounded-full border-4 border-white shadow-lg object-cover"
              />{" "}
              {/* Profile Photo */}
              <div>
                <h1 className="text-3xl font-bold">
                  {currentRestaurant.title}
                </h1>{" "}
                {/* Profile Name */}
                <p className="text-sm text-gray-700">
                  {currentRestaurant.description}
                </p>{" "}
                {/* Additional Info */}
              </div>
            </div>

            <li className="mb-2">
              <a
                className="flex items-center p-2  hover:bg-gray-200"
                href="/restaurant/dashboard"
              >
                <FaHome className="mr-2" /> Home
              </a>
            </li>
            <li className="mb-2">
              <a
                className="flex items-center p-2  hover:bg-gray-200"
                href="/restaurant/home"
              >
                <FaUserEdit className="mr-2" /> Update Profile
              </a>
            </li>
            <li className="mb-2">
              <a
                className="flex items-center p-2 rounded-lg hover:bg-gray-200"
                href="/restaurant/menu"
              >
                <FaUtensils className="mr-2" /> Add Menu Items
              </a>
            </li>
            <li className="mb-2">
              <a
                className="flex items-center p-2 rounded-lg hover:bg-gray-200"
                href="/restaurant/add-offers"
              >
                <FaTag className="mr-2" /> Add Offers
              </a>
            </li>
            <li className="mb-2">
              <a
                className="flex items-center p-2 rounded-lg hover:bg-gray-200"
                href="/restaurant/set-location"
              >
                <FaMapMarkerAlt className="mr-2" /> Location
              </a>
            </li>
            <li className="mb-2">
              <a
                className="flex items-center p-2 rounded-lg hover:bg-gray-200"
                onClick={() =>
                  document.getElementById("my_modal_3").showModal()
                }
              >
                <FaTrash className="mr-2" /> Delete Account
              </a>
              <dialog
                id="my_modal_3"
                className="modal items-center justify-center flex flex-col"
              >
                <div className="modal-box bg-white p-4 rounded items-center justify-center flex flex-col">
                  <h3 className="font-bold text-lg">
                    Are You sure you want to delete your restaurant?
                  </h3>
                  <div className="modal-action">
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button
                        className="btn btn-error mr-2"
                        onClick={() =>
                          handleDeleteRestaurant(currentRestaurant._id)
                        }
                        aria-label="Close modal"
                      >
                        Yes,Delete
                      </button>

                      <button className="btn">Close</button>
                    </form>
                  </div>
                </div>
              </dialog>
            </li>
            <li className="mb-2">
              <a
                className="flex items-center p-2 rounded-lg hover:bg-gray-200"
                onClick={() => handleSignout()}
              >
                <FaSignOutAlt className="mr-2" /> Sign out
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
