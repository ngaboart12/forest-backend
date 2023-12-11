const route = require('express').Router();
const bcrypt = require('bcrypt')
const User = require('../models/User')

route.post('/register', async (req, res) => {
    try {
      const { fullname, email, password, location, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        fullname,
        email,
        password: hashedPassword,
        location,
        role,
      });
  
      await newUser.save();
      res.status(201).json({
        message: 'User registered successfully',
        user: {
            fullname: newUser.fullname,
            email: newUser.email,
            location: newUser.location,
            role: newUser.role,
            // Add any other user data you want to include
        }
    });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });


  route.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find the user by email (replace this with your actual user retrieval logic)
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.json({ message: 'Invalid credentials' });
      }
  
      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.json({ message: 'Invalid credentials' });
      }
  
      // Successful login
      res.status(200).json({ message: 'Login successful', data:{user} });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

module.exports = route;