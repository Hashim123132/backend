const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');

const JWT_SECRET = 'abc3477@!23';

// Route1: Create a user using POST "/api/auth/createuser" .No login required


router.post('/createuser', [
  body('name', 'Name must be at least 3 characters long').isLength({ min: 3 }),
  body('email', 'Invalid email').isEmail(),

  body('password', 'Password must be at least 5 characters long').isLength({ min: 5 }),
], 
  async (req, res) => {

    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //check whether the user with this email exists already
    
    try{
      let user = await User.findOne({email: req.body.email})
      
      if(user){
        return res.status(400).json({error: 'Sorry a user with this email already exists'})
    }

    // storing the password in hashed form
   
    const salt = await bcrypt.genSalt(10);
    const secPassword = await bcrypt.hash(req.body.password, salt);
  
    //create a new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPassword,
      })
      
      
      const data = {
        user: {
          id: user.id
        }
      }
      
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({authToken})
    }
    
    catch(error){
      console.log(error)
      res.status(500).send("internal server error")
    }
  });
    // WE HAVE CREATED THE USER, NOW WE NEED TO LOGIN



    //Route2: Authenticate a user using POST "/api/auth/login" .No login required
    
    router.post('/login', [
      body('email', 'Invalid email').isEmail(),
      body('password', 'Password cannot be blank').exists(),
    ],
      async (req, res) => {

        
        //if error return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }
      const {email, password} = req.body;
      try{
        let user = await User.findOne({email});
        if(!user){
          return res.status(400).json({error: 'Try logging with correct credential(s)'})
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
          return res.status(400).json({error: 'Try logging with correct credential(s)'})
        }
        const data = {
          user: {
            id: user.id
          }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({authToken})
      
      }
      catch(error){
        console.log(error)
        res.status(500).send("internal server error")
      }
    });
   

module.exports = router;