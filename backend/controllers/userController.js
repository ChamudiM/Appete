import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/userModel.js";
import Restaurant from "../models/restaurantModel.js";
import e from "express";
export const test = (request, response) => {
    response.json({
        message: 'API is working',
    });
};

//update user
export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can update only your account!"));
    }
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    profilePicture: req.body.profilePicture,
                }

            },
            { new: true }
        );
        const {password, ...rest} = updatedUser._doc;

        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};


export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can delete only your account!"));
    }

    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted");
    } catch (error) {
        next(error);
    }

};

export const addCurrentLocation = async (req, res, next) => {
    const userId = req.params.id;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      const {latitude, longitude} = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            currentLocation: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
          },
        },
        { new: true }
      ) 
      return res.status(200).send(updatedUser);

    } catch (error) {
      next(error);
    }
  };

export const showNearestRestaurant = async (req, res, next) => {
  const userId = req.params.id;
  const maxDistance = parseInt(req.query.distance,10) || 5000;

  try {
    const user = await User.findById(userId);
    if (!user || !user.currentLocation) {
      return res.status(404).send({ message: 'Add Location first' });
    }
    const userLocation = user.currentLocation.coordinates;
    const nearestRestaurant = await Restaurant.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: userLocation
          },
          $maxDistance: maxDistance,
        },
      },
    }).limit(10);
    if (!nearestRestaurant) {
      return res.status(404).send({ message: 'No restaurant nearby' });
    }
    return res.status(200).send(nearestRestaurant);
  } catch (error) {
    next(error);
        }
      };
    
