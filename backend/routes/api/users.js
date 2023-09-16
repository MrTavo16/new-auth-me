const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Invalid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('username')
      .exists()
      .withMessage("Username is required"),
    check('firstName')
      .exists()
      .withMessage("First Name is required"),
    check('lastName')
      .exists()
      .withMessage("Last Name is required"),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { email, lastName ,firstName, password, username } = req.body;
      const hashedPasswordTest = bcrypt.hashSync(password);
      const usernameSearch = await User.unscoped().findOne({
        where:{
          username : req.body.username,
          hashedPassword:hashedPasswordTest
        }
      })
      const emailSearch = await User.unscoped().findOne({
        where:{
          email : req.body.email,
          hashedPassword:hashedPasswordTest
        }
      })
      if(usernameSearch){
        return res.status(500).json({
          "message": "User already exists",
          "errors": {
            "email": "User with that user already exists"
          }
        })
      }
      if(emailSearch){
        return res.status(500).json({
          "message": "User already exists",
          "errors": {
            "email": "User with that email already exists"
          }
        })
      }
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ firstName, lastName, email, username, hashedPassword });
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
  
      await setTokenCookie(res, safeUser);
  
      return res.json({
        user: safeUser
      });
    }
);




module.exports = router;