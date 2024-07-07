import Restaurant from "../models/restaurantModel.js";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';

export const signuprestaurant = async (req, res) => {
    const { title, officialEmail, password } = req.body;
  
    try {
      // Check if username or email already exists
      const existingRestaurant = await Restaurant.findOne({officialEmail});
  
      if (existingRestaurant) {
      return res.status(400).json({ message: 'email already exists' });
      }
  
      // Hash the password
      const hashedPassword = bcryptjs.hashSync(password, 10);
  
      // Create a new user
      const newRestaurant = new Restaurant({ title, officialEmail, password: hashedPassword });
      await newRestaurant.save();
  
      // Send success response
      res.status(200).json({ message: 'Restaurant created successfully' });
    } catch (error) {
      // Handle server errors
      res.status(500).json({ message: error.message });
    }
  };

  export const signinrestaurant = async (req, res) => {
    const { officialEmail, password } = req.body;
  
    try {
      const validUser = await Restaurant.findOne({officialEmail});
      if (!validUser) return res.status(404).json({ message: 'Restaurant not found' });
  
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });
  
      const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
      const { password: hashedPassword, ...rest } = validUser._doc; 
      const expiryDate = new Date(Date.now()+ 3600000);
      res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
        .status(200)
        .json(rest); 
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };