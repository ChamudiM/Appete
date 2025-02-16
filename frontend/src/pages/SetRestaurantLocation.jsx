import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useJsApiLoader, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import { updateStart, updateSuccess, updateFailure } from '../redux/user/restaurantSlice';
import {toast} from 'react-toastify';
const backendurl = import.meta.env.VITE_BACKEND_URL
const SetRestaurantLocation = () => {
  const { currentRestaurant } = useSelector((state) => state.restaurant);
  const dispatch = useDispatch();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAP_API_KEY ,
    libraries: ["places"],
  });

  console.log( import.meta.env.VITE_MAP_API_KEY )

  const [center, setCenter] = useState({ lat: 6.0329, lng: 80.2168 });
  const originRef = useRef();
  const [markerPosition, setMarkerPosition] = useState(center);

  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    console.log('Current Location:', `Lat: ${markerPosition.lat}, Lng: ${markerPosition.lng}`);
  }, [markerPosition]);

  // Handle marker drag end
  const handleMarkerDragEnd = (event) => {
    setMarkerPosition({ lat: event.latLng.lat(), lng: event.latLng.lng() });
  };

  // Handle search function
  const search = () => {
    if (!originRef.current || !originRef.current.value) {
      return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: originRef.current.value }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        setMarkerPosition({ lat, lng });
        setCenter({ lat, lng });

      } else {
        console.error(`Geocode was not successful for the following reason: ${status}`);
        toast.error('Location not found!');

      }
    });
  };

  // Handle submit function
  const handleSubmit = async () => {
    dispatch(updateStart());

    try {
      const res = await fetch(`${backendurl}/restaurant/${currentRestaurant._id}/update-location`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ latitude: markerPosition.lat, longitude: markerPosition.lng }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || 'An error occurred while updating location');
        throw new Error(errorData.message || 'An error occurred while updating location');
      }

      const data = await res.json();
      if (data.success === false) {
        setMessage({ type: 'error', text: data.message });
        dispatch(updateFailure({ message: data.message }));
        toast.error(data.message);
      } else {
        setMessage({ type: 'success', text: 'Location updated successfully!' });
        dispatch(updateSuccess(data));
        toast.success('Location updated successfully!');
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'An unexpected error occurred' });
      dispatch(updateFailure({ message: error.message || 'An unexpected error occurred' }));
    }
  };

  if (!isLoaded) {
    return <div className="skeleton h-128 w-128"></div>
  }

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      {/* {message.text && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          padding: '10px',
          borderRadius: '4px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          width: 'auto',
          maxWidth: '300px',
          textAlign: 'center',
          fontWeight: 'bold',
        }}>
          {message.text}
        </div>
      )} */}
      <div style={{
        position: 'absolute',
        top: '50px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        margin: '0 10px',
        zIndex: 1000,
        width: 'auto',
        maxWidth: '600px',
      }}>
        <Autocomplete>
          <input
            type="text"
            placeholder="Search here"
            ref={originRef}
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginRight: '10px',
              flex: 1,
            }}
          />
        </Autocomplete>
        <button
          className="flex justify-center rounded-md bg-neutral-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-neutral-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-700"
          style={{ marginRight: '10px' }}
          onClick={search}
        >
          Search Location
        </button>
        <button
          className="flex justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
          onClick={handleSubmit}
        >
          Set Location
        </button>
      </div>
      <div style={{ height: '100%', width: '100%' }}>
        <GoogleMap
          zoom={15}
          center={center}
          mapContainerStyle={{ width: '100%', height: '100%' }}
        >
          <Marker
            position={markerPosition}
            draggable
            onDragEnd={handleMarkerDragEnd}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
              scaledSize: new window.google.maps.Size(32, 32)
            }}
          />
        </GoogleMap>
      </div>
    </div>
  );
}

export default SetRestaurantLocation;
