import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
  DirectionsService,
} from "@react-google-maps/api";
import { FaCar, FaWalking, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaMap } from 'react-icons/fa'; // Added FaMap
import { BiSolidCar } from 'react-icons/bi';

const backendurl = import.meta.env.VITE_BACKEND_URL

const ViewDirections = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAP_API_KEY, // Replace with your API key
  });

  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [directionResponse, setDirectionResponse] = useState(null);
  const [shouldCalculateRoute, setShouldCalculateRoute] = useState(false);
  const currentLocation = currentUser.currentLocation;
  const { id } = useParams();

  const center = {
    lat: currentLocation.coordinates[1],
    lng: currentLocation.coordinates[0],
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
        setRestaurant(data);
        setShouldCalculateRoute(true); // Set flag to calculate route once data is fetched
      } catch (error) {
        setError("An error occurred while fetching restaurant details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [id]);

  const handleDirectionsCallback = useCallback((response, status) => {
    if (status === "OK") {
      setDirectionResponse(response);
    } else {
      setDirectionResponse(null);
      console.error(`Directions request failed due to ${status}`);
    }
  }, []);

  useEffect(() => {
    if (shouldCalculateRoute && restaurant) {
      setShouldCalculateRoute(false); // Reset flag to avoid repeated calculations
    }
  }, [shouldCalculateRoute, restaurant]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="flex h-screen font-sans">
      <div className="w-2/3 h-full">
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
        >
          {/* <Marker position={center}   /> */}
          {/* {restaurant && (
            <Marker
              position={{
                lat: restaurant.location.coordinates[1],
                lng: restaurant.location.coordinates[0],
              }}
 
            />
          )} */}
          {restaurant && shouldCalculateRoute && (
            <DirectionsService
              options={{
                origin: center,
                destination: {
                  lat: restaurant.location.coordinates[1],
                  lng: restaurant.location.coordinates[0],
                },
                travelMode: google.maps.TravelMode.DRIVING,
              }}
              callback={handleDirectionsCallback}
            />
          )}
          {directionResponse && (
            <DirectionsRenderer
              directions={directionResponse}
              options={{
                polylineOptions: { strokeColor: "black", strokeWeight: 5 },
              }}
            />
          )}
        </GoogleMap>
      </div>
      <div className="w-1/3 flex flex-col justify-center p-6 bg-white shadow-md rounded-lg">
        <div className="flex flex-col items-center mb-6">
          <FaMap className="text-4xl text-gray-600 mb-2" />
          <h1 className="text-2xl font-bold text-gray-600 text-center mb-4">Locate Your Favorite Restaurant</h1>
        </div>
        <div className="bg-gray-100 p-4 shadow-md rounded-lg mb-6">
          <h2 className="text-lg text-gray-900 font-semibold mb-2">{restaurant?.title}</h2>
          <div className="flex items-center mb-4">
            <FaMapMarkerAlt className="text-gray-600 text-lg mr-2" />
            <div>
              <h3 className="text-sm font-medium">Address</h3>
              <p className="text-sm text-gray-600">{restaurant?.address || "Not available"}</p>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <FaPhoneAlt className="text-gray-600 text-lg mr-2" />
            <div>
              <h3 className="text-sm font-medium">Hotline</h3>
              <p className="text-sm text-gray-600">{restaurant?.hotline || "Not available"}</p>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <FaEnvelope className="text-gray-600 text-lg mr-2" />
            <div>
              <h3 className="text-sm font-medium">Email</h3>
              <p className="text-sm text-gray-600">{restaurant?.officialEmail || "Not available"}</p>
            </div>
          </div>
        </div>
        {directionResponse && (
          <div className="bg-gray-100 p-4 shadow-md rounded-lg">
            <h2 className="text-lg text-gray-900 font-semibold mb-2">Route Details</h2>
            <div className="flex items-center mb-2">
              <BiSolidCar className="text-gray-600 text-lg mr-2" />
              <div>
                <span className="text-sm font-medium">Duration:</span>
                <span className="text-sm text-gray-600"> {directionResponse.routes[0].legs[0].duration.text}</span>
              </div>
            </div>
            <div className="flex items-center">
              <FaClock className="text-gray-600 text-lg mr-2" />
              <div>
                <span className="text-sm font-medium">Distance:</span>
                <span className="text-sm text-gray-600"> {directionResponse.routes[0].legs[0].distance.text}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDirections;
