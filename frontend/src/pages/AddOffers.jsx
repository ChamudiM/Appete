import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateSuccess } from "../redux/user/restaurantSlice";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import RestaurantHeader from "../components/RestaurantHeader";
import { toast } from "react-toastify";
import { FaUpload } from "react-icons/fa";

const backendurl = import.meta.env.VITE_BACKEND_URL

const AddOffers = () => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);
  const { currentRestaurant } = useSelector((state) => state.restaurant);
  const offers = currentRestaurant.SpecialDeals;
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

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
      },
      (error) => {
        setImageError(true);
        console.log(error);
        toast.error("Image upload failed");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          toast.success("Image uploaded successfully");
          setFormData({ ...formData, photo: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(
        `${backendurl}/restaurant/${currentRestaurant._id}/specialdeals`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message);
        throw new Error(
          errorData.message || `HTTP error! status: ${res.status}`
        );
      }

      const data = await res.json();
      console.log(data);
      setSuccess(true);
      setError(null);
      dispatch(updateSuccess(data));
      toast.success("Special offer added successfully");
      setTimeout(() => {
        setSuccess(false);
        setSubmitDone(true);
        window.location.reload();
      }, 500); // Hide success message after 3 seconds
    } catch (error) {
      console.error("Error adding offers:", error);
      toast.error(error.message);
      setError(error.message);
      setSubmitError(true);
    }
  };

  return (
    <div className="min-h-screen ">
      <RestaurantHeader />
      {/*
  Heads up! 👋

  Plugins:
    - @tailwindcss/forms
*/}

      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <h1 className="text-center text-2xl font-bold text-neutral-500 sm:text-3xl">
            What are Special Offers?
          </h1>

          <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
            Promotions like discounts or limited-time deals attract more
            customers and boost sales. Create exciting offers to draw in new
            patrons and encourage repeat visits.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8 border-2 border-yellow-500"
          >
            <div>
              <p className="text-center text-lg font-medium">
                Add Special Offers
              </p>
              <div>
                <div className="flex items-center justify-between  mt-4 mx-auto">
                  <label
                    htmlFor="photo"
                    className="block text-sm font-medium leading-6 text-gray-900 hidden"
                  >
                    Photo
                  </label>
                </div>
                <div className="mt-2 mx-auto">
                  <div className="mask mask-squircle h-24 w-24 object-fill mx-auto">
                    <img
                      src={
                        (formData.photo && formData.photo) ||
                        "data:image/jpeg;base64,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"
                      }
                      alt="Avatar Tailwind CSS Component"
                    />
                  </div>
                  {/* {imageError ? (
                    <progress
                      className="progress progress-error w-56"
                      value="100"
                      max="100"
                    >
                      Error Uploading Image
                    </progress>
                  ) : imagePercent > 0 && imagePercent < 100 ? (
                    <progress
                      className="progress progress-warning w-56 mt-2"
                      value={imagePercent}
                      max="100"
                    >
                      <span className="text-sm font-medium leading-6 text-yellow-500 mt-2">
                        {imagePercent}
                      </span>
                    </progress>
                  ) : imagePercent === 100 ? (
                    <span className="text-sm font-medium leading-6 text-yellow-500 mt-2">
                      Image Uploaded Successfully!
                    </span>
                  ) : (
                    ""
                  )} */}
                  <input
                    id="photo"
                    type="file"
                    ref={fileInputRef}
                    name="photo"
                    hidden
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                  <button
                    type="button"
                    className="btn btn-neutral btn-sm mt-2"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <FaUpload />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-8">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Offer Name
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="dealDescription"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="dealDescription"
                  name="dealDescription"
                  type="text"
                  required
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="price_discount"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Price/ Discount
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="price_discount"
                  name="price_discount"
                  type="text"
                  required
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {submitError && (
              toast.error(submitError + " Please try again")
            )}
            {submitDone && (
              toast.success("Offer added successfully")
            )}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
              >
                Save Offer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOffers;
