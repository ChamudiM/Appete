import {GoogleAuthProvider, signInWithPopup, getAuth} from "firebase/auth";
import {app} from '../firebase';
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import {useNavigate} from "react-router-dom";

const backendurl = import.meta.env.VITE_BACKEND_URL


const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async() => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const res = await fetch (`${backendurl}/auth/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: result.user.displayName,
            email: result.user.email,
            photo: result.user.photoURL,
          }),
          credentials: "include",
        });
          const data = await res.json();
          dispatch(signInSuccess(data));
          navigate("/welcome");
    } catch (error) {
      console.log("could not login with google", error);
    }
  }
  return (
    <button className="flex items-center justify-center w-full mt-4 rounded-md bg-white border border-gray-300 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600" type="button" onClick={handleGoogleClick}>
      <img
        className="w-6 h-6 mr-2"
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        loading="lazy"
        alt="google logo"
      />
      <span>Continue with Google</span>
    </button>
  );
};

export default OAuth;
