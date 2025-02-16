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
import { FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";

const backendurl = import.meta.env.VITE_BACKEND_URL

const CreateMenu = () => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);
  console.log(image);
  const { currentRestaurant } = useSelector((state) => state.restaurant);
  const categoryList = currentRestaurant.categoryList;

  //console.log(currentRestaurant);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState({
    category: "", // Initialize category in formData
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [newCategory, setNewCategory] = useState(""); // State to store new category

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
        toast.error("Image upload failed!");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          toast.success("Image uploaded successfully!");
          setFormData({ ...formData, photo: downloadURL });
        });
      }
    );
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setFormData({ ...formData, category: e.target.value });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  const handleAddCategory = async () => {
    try {
      const res = await fetch(
        `${backendurl}/restaurant/${currentRestaurant._id}/category`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category: newCategory }),
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${res.status}`
        );
      }

      const data = await res.json();
      console.log(data);
      setNewCategory(""); // Clear newCategory state after successful addition
      closeModal(); // Close modal after adding category
      dispatch(updateSuccess(data));
      console.log("Category added successfully");
      console.log(categoryList);
    } catch (error) {
      console.error("Error adding category:", error);
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(
        `${backendurl}/restaurant/${currentRestaurant._id}/menu`,
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
        throw new Error(
          errorData.message || `HTTP error! status: ${res.status}`
        );
      }

      const data = await res.json();
      console.log(data);
      dispatch(updateSuccess(data));
      setSuccess(true);
      //setSubmitDone(true);
      setError(null);
      setTimeout(() => {
        setSuccess(false);
        setSubmitDone(true);
        window.location.reload();
        //navigate("/restaurant/home");
      }, 500); // Hide success message after 3 seconds
    } catch (error) {
      console.error("Error adding menu item:", error);
      setError(error.message);
      setSubmitError(true);
    }
  };

  return (
    <div>
      <RestaurantHeader />
      {/*
  Heads up! 👋

  Plugins:
    - @tailwindcss/forms
*/}

      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg ">
          <h1 className="text-center text-2xl font-bold text-neutral-500 sm:text-3xl">
            Keep Your Menu Exciting!
          </h1>

          <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
            Easily update your menu with new dishes, prices, and descriptions.
            Regularly refreshing your menu keeps it appealing and helps attract
            new customers while retaining the interest of your regulars.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8 border-2 border-yellow-500"
          >
            <p className="text-center text-lg font-medium">Add Menu Items</p>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium leading-6 text-gray-900 hidden"
                >
                  Photo
                </label>
              </div>
              <div className="mt-2 mx-auto">
                <div className="mask mask-squircle h-24 w-24 object-fill mx-auto ">
                  <img
                    src={
                      (formData.photo && formData.photo) ||
                      "https://i.pinimg.com/originals/61/0b/03/610b03fea307fb76f7186eeb817bffcb.jpg"
                    }
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
                    <span className="text-sm font-medium leading-6 text-yellow-600 mt-2">
                      {imagePercent}
                    </span>
                  </progress>
                ) : imagePercent === 100 ? (
                  <span className="text-sm font-medium leading-6 text-white mt-2">
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
                  className="btn btn-neutral btn-sm mt-2"
                  onClick={() => fileInputRef.current.click()}
                >
                  <FaUpload className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="label">
              <span className="label-text mt-8">Pick a category first!</span>
            </div>
            <label className="form-control w-full max-w-xs">
              <select
                className="select select-bordered"
                value={selectedCategory}
                id="category"
                onChange={handleCategoryChange}
              >
                <option disabled value="">
                  Pick one
                </option>
                {categoryList.map((category, index) => (
                  <option key={index}>{category}</option>
                ))}
              </select>
            </label>
            <button className="btn" onClick={openModal} type="button">
              Add New Category
            </button>
            {isModalOpen && (
              <dialog id="my_modal_1" className="modal" open>
                <div
                  className="modal-box"
                  style={{
                    maxWidth: "500px",
                    height: "auto",
                    padding: "20px",
                    borderRadius: "8px",
                  }}
                >
                  <h3 className="text-lg font-bold">Add new category</h3>
                  <div className="py-4">
                    <input
                      type="text"
                      id="newCategory" // Set id to differentiate from category select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)} // Update newCategory state
                      className="grow input input-bordered input-primary w-full rounded-md"
                      style={{
                        borderRadius: "8px",
                        padding: "10px",
                        width: "100%",
                      }}
                      placeholder="New Category"
                    />
                  </div>
                  <div
                    className="modal-action"
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <button
                      className="btn"
                      style={{
                        backgroundColor: "#f59e0b", // Yellow background color
                        color: "#ffffff", // White text color
                        padding: "0.5rem 1rem",
                        borderRadius: "0.25rem",
                      }}
                      onClick={handleAddCategory}
                    >
                      Save
                    </button>
                    <button
                      className="btn"
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "0.25rem",
                      }}
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </dialog>
            )}

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="itemName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Item Name
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="itemName"
                  name="itemName"
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
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="description"
                  name="description"
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
                  htmlFor="price"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Price
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="price"
                  name="price"
                  type="text"
                  required
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <p>
              {submitError ? (
                toast.error("Error saving menu item. Please try again.")
              ) : (
                ""
              )}
            </p>
            <p>
              {submitDone ? (
                 toast.success("Menu item saved successfully!")
              ) : (
                ""
              )}
            </p>

            <div>
              <button
                type="submit"
                onClick={handleSubmit}
                className="flex w-full justify-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
              >
                Save Menu Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMenu;
