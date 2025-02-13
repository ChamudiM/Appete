import React from "react";
import {ToastContainer} from "react-toastify";
import { Routes, Route } from "react-router-dom";
import RestaurantSignUp from "./pages/RestaurantSignUp";
import LearnMore from "./pages/LearnMore";
import RestaurantHome from "./pages/RestaurantHome";
import RestaurantSignIn from "./pages/RestaurantSignIn";
import Home from "./pages/Home";
import UserSignIn from "./pages/UserSignIn";
import UserProfile from "./pages/UserProfile";
import UserSignUp from "./pages/UserSignUp";
import AddOffers from "./pages/AddOffers";
import SetRestaurantLocation from "./pages/SetRestaurantLocation";
import PrivateRoute from "./components/PrivateRoute";
import RestaurantPrivateRoute from "./components/RestaurantPrivateRoute";
import UserCurrentLocation from "./pages/UserCurrentLocation";
import CreateMenu from "./pages/CreateMenu";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import NearestRestaurants from "./pages/NearestRestaurants";
import RestaurantDetails from "./pages/RestaurantDetails";
import ViewDirections from "./pages/ViewDirections";
import Landing from "./pages/Landing";
import EditMenu from "./pages/EditMenu";

const App = () => {
  return (
    <>
    <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/info" element={<LearnMore />} />
        <Route element={<RestaurantPrivateRoute />}>
        <Route path="/restaurant/home" element={<RestaurantHome />} />
        </Route>
        <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
        <Route path="/restaurant/menu" element={<CreateMenu />}/>
        <Route path="/restaurant/sign-up" element={<RestaurantSignUp />} />
        <Route path="/restaurant/sign-in" element={<RestaurantSignIn />} />
        <Route path="/restaurant/add-offers" element={<AddOffers />} />
        <Route path="/restaurant/:id/menu/edit/:menuid" element={<EditMenu />}/>
        <Route path="/sign-in" element={<UserSignIn />} />
        <Route path="/sign-up" element={<UserSignUp />} />
        <Route element={<PrivateRoute />}>
                <Route path="/profile" element={<UserProfile />} />
        </Route>
        <Route path="/restaurant/set-location" element={<SetRestaurantLocation />} />
        <Route path="/user/current-location" element ={<UserCurrentLocation/>}/>
        <Route path="/user/nearest-restaurants" element={<NearestRestaurants/>}/>
        <Route path="/restaurant/:id" element={<RestaurantDetails/>}/>
        <Route path="/user/view-directions/:id" element={<ViewDirections/>}/>
        <Route path="/welcome" element={<Landing />} />
      </Routes>
    </>
  );
};

export default App;
