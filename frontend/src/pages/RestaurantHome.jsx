import React from "react";
import RestaurantHeader from "../components/RestaurantHeader";
import { useRef, useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import {
  updateStart,
  updateSuccess,
  updateFailure,
} from "../redux/user/restaurantSlice";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify components
import { FaUser } from "react-icons/fa";

const backendurl = import.meta.env.VITE_BACKEND_URL;

const RestaurantHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const filePickerRef = useRef(null);
  const coverPickerRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [cover, setCover] = useState(undefined);
  console.log(image);
  const { currentRestaurant, loading, error } = useSelector(
    (state) => state.restaurant
  );
  const [imagePercent, setImagePercent] = useState(0);
  const [coverPercent, setCoverPercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  console.log(formData);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  useEffect(() => {
    if (cover) {
      handleCoverUpload(cover);
    }
  }, [cover]);

  const handleCoverUpload = async (cover) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + cover.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, cover);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setCoverPercent(Math.round(progress));
        console.log("Upload is " + coverPercent + "% done");
      },
      (error) => {
        console.log(error);
        setCoverError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setFormData({ ...formData, coverPhoto: downloadURL });
        });
      }
    );
  };

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));

        console.log("Upload is " + imagePercent + "% done");
      },
      (error) => {
        console.log(error);
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateStart());
      const res = await fetch(
        ` ${backendurl}/restaurant/update/${currentRestaurant._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateFailure(data));

        return;
      }
      dispatch(updateSuccess(data));
      toast.success("Updated Successfully");
      setIsSuccess(true);
    } catch (error) {
      dispatch(updateFailure(error));
      toast.error("Update Failed");
    }
  };

  return (
    <>
      <RestaurantHeader />
      <div className="flex flex-col items-center justify-center ">
        <div className="bg-gray-100 border-2 border-yellow-500 shadow-md rounded-lg p-8 w-full max-w-2xl mt-10 mb-10 ml-40">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col items-center justify-center">
              <h1 className="pb-5 text-2xl font-semibold leading-7 text-gray-900">
                Refresh Your Restaurant's Image
              </h1>

              <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
                Enhance your restaurant's presence by updating your profile with
                the latest details and make a lasting impression on your
                customers
              </p>

              <p className="text-center text-lg font-medium">
                Edit Your Profile
              </p>
              <div className="w-full">
                <div className="border-b border-gray-900/10 pb-12">
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"> 
                    <div className="col-span-full">
                      <label
                        htmlFor="photo"
                        className="block text-sm font-medium leading-6 text-gray-900 hidden"
                      >
                        Photo
                      </label>
                      <div className="mt-2 gap-x-3 mx-auto ">
                        <div className="mx-auto">
                          <img
                            src={
                              formData.profilePicture ||
                              currentRestaurant.profilePicture
                            }
                            alt="profile"
                            className="h-24 w-24 self-center rounded-full object-cover mx-auto"
                          />
                          {imageError ? (
                            toast.error("Error Uploading Image")
                          ) : imagePercent > 0 && imagePercent < 100 ? (
                            <progress
                              className="progress progress-warning w-56"
                              value={imagePercent}
                              max="100"
                            >
                              <span className="text-sm font-medium leading-6 text-yellow-500">
                                {imagePercent}
                              </span>
                            </progress>
                          ) : imagePercent === 100 ? (
                            toast.success("Image Uploaded Successfully")
                          ) : (
                            ""
                          )}
                        </div>
                        <input
                          type="file"
                          ref={filePickerRef}
                          hidden
                          accept="image/*"
                          onChange={(e) => setImage(e.target.files[0])}
                        />
                        <button
                          type="button"
                          className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 items-center justify-center"
                          onClick={() => filePickerRef.current.click()}
                        >
                          Change Photo
                        </button>
                      </div>
                    </div>
                    <div className="sm:col-span-4">
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Restaurant Name
                      </label>
                      <div className="mt-2">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-500 sm:max-w-md">
                          <input
                            defaultValue={currentRestaurant.title}
                            type="text"
                            name="title"
                            id="title"
                            autoComplete="username"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6"
                            placeholder="janesmith"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label
                        htmlFor="about"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        About
                      </label>
                      <div className="mt-2">
                        <textarea
                          defaultValue={currentRestaurant.about}
                          id="about"
                          name="about"
                          rows="3"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6"
                          onChange={handleChange}
                        />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        About your restaurant.
                      </p>
                    </div>

                    <div className="sm:col-span-4">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Email address
                      </label>
                      <div className="mt-2">
                        <input
                          defaultValue={currentRestaurant.officialEmail}
                          id="officialEmail"
                          name="officialEmail"
                          type="email"
                          autoComplete="email"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:max-w-md"
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Phone number
                      </label>
                      <div className="mt-2">
                        <input
                          defaultValue={currentRestaurant.hotline}
                          id="hotline"
                          name="hotline"
                          type="text"
                          autoComplete="phone"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:max-w-md"
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Password
                      </label>
                      <div className="mt-2">
                        <input
                          // defaultValue={currentRestaurant.password}
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="password"
                          onChange={handleChange}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:max-w-md"
                        />
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="cover-photo"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Cover photo
                      </label>
                      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="text-center">
                          {formData.coverPhoto && (
                            <img
                              src={
                                formData.coverPhoto ||
                                currentRestaurant.coverPhoto
                              }
                              alt="cover"
                              className="h-60 w-full self-center rounded-lg object-cover"
                            />
                          )}
                          {coverError ? (
                            toast.error("Error Uploading Image")
                          ) : coverPercent > 0 && coverPercent < 100 ? (
                            <progress
                              className="progress progress-warning w-56"
                              value={coverPercent}
                              max="100"
                            >
                              <span className="text-sm font-medium leading-6 text-yellow-500">
                                {coverPercent}
                              </span>
                            </progress>
                          ) : coverPercent === 100 ? (
                            toast.success("Cover Uploaded Successfully")
                          ) : (
                            ""
                          )}

                          <div className="mt-4 flex text-sm leading-6 text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded-md bg-white font-semibold text-yellow-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-yellow-500 focus-within:ring-offset-2 hover:text-yellow-500"
                            >
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                ref={coverPickerRef}
                                hidden
                                onChange={(e) => setCover(e.target.files[0])}
                              />
                              <button
                                type="button"
                                color="yellow"
                                onClick={() => coverPickerRef.current.click()}
                              >
                                {" "}
                                Upload Cover
                              </button>
                            </label>
                          </div>
                          <p className="text-xs leading-5 text-gray-600">
                            PNG, JPG, up to 2MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-900/10 pb-12">
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Location
                  </h2>

                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="col-span-full">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Address
                      </label>
                      <div className="mt-2">
                        <input
                          defaultValue={currentRestaurant.address}
                          onChange={handleChange}
                          type="text"
                          name="address"
                          id="address"
                          autoComplete="street-address"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="region"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Your Location
                      </label>
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() => navigate("/restaurant/set-location")}
                          className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 leading-6"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* {error && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  Update Failed!!
                </div>
              )}
              {loading && (
                <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                  Loading..
                </div>
              )}
              {isSuccess && (
                <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                  Updated successfully!!
                </div>
              )} */}
              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-yellow-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RestaurantHome;
