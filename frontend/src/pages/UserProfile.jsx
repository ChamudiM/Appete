import React, { useState } from "react";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import { useRef, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../redux/user/userSlice";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify components
import "react-toastify/dist/ReactToastify.css";
import { FaEdit,} from "react-icons/fa";
const backendurl = import.meta.env.VITE_BACKEND_URL;

const UserProfile = () => {
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const currentUser = useSelector((state) => state.user.currentUser);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
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
        toast.error("Error uploading image", {
          autoClose: 5000,

        });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
        toast.success("Image uploaded successfully", {

          autoClose: 5000,

        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent browser from refreshing
    try {
      dispatch(updateUserStart());
      const res = await fetch(`${backendurl}/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        toast.error("Profile update failed", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return;
      }
      dispatch(updateUserSuccess(data));
      setSuccess(true);
      toast.success("Profile updated successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      dispatch(updateUserFailure(error));
      setError(true);
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${backendurl}/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        toast.error("Profile deletion failed", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast.success("Profile deleted successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };
  return (
    <>
    <div className="h-screen">
      <Header />
      <div className="flex flex-col items-center justify-center">
        <div className="bg-gray-100 border-2 border-yellow-500 shadow-md rounded-lg p-8 w-full max-w-2xl mt-10 mb-10 ml-40">
          <form className="w-full " onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center">
              <h1 className="pb-5 text-2xl font-semibold leading-7 text-gray-900">
                Update Profile
              </h1>
              <div className="col-span-full">
                <div className="mt-2 flex-row items-center gap-x-2">
                  <div>
                    <div className="relative group w-24 h-24">
                      <img
                        src={
                          formData.profilePicture || currentUser.profilePicture
                        }
                        alt="Profile Picture"
                        className="h-24 w-24 rounded-full object-cover transition-opacity duration-300 group-hover:opacity-50"
                        
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm bg-black bg-opacity-60 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      onClick={() => fileRef.current.click()}>
                        <FaEdit />
                      </span>
                    </div>

                    {imageError ? (
                      <progress
                        className="progress progress-error w-56"
                        value="100"
                        max="100"
                      ></progress>
                    ) : imagePercent > 0 && imagePercent < 100 ? (
                      <progress
                        className="progress progress-warning w-56"
                        value={imagePercent}
                        max="100"
                      >
                        <span className="text-sm font-medium leading-6 text-yellow-600">
                          {imagePercent}
                        </span>
                      </progress>
                    ) : imagePercent === 100 ? (
                      <span className="text-sm font-medium leading-6 text-yellow-600"></span>
                    ) : (
                      ""
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileRef}
                    hidden
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  ></input>
                </div>
              </div>

              <div className="mt-6 flex-col items-center justify-start gap-x-4 w-full">
                 <div className="sm:col-span-4  ">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Username
                  </label>
                  <div className="mt-2">
                      <input
                        defaultValue={currentUser.username}
                        type="text"
                        name="username"
                        id="username"
                        autoComplete="username"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                        placeholder="username"
                        onChange={handleChange}
                      />
                  </div>
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
                      defaultValue={currentUser.email}
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Email"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
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
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Password"
                      autoComplete="current-password"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                      onChange={handleChange}
                    />
                  </div>
                </div>
               </div>
               <div className="mt-6 flex items-center justify-start gap-x-4">
              <button
                type="submit"
                className="rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
              >
                Update Profile
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Delete Account
              </button>
            </div>
            </div>

            
          </form>
        </div>
      </div>
      </div>
    </>
  );
};

export default UserProfile;
