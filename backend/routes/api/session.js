const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateLogin = [

    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a password.'),
    check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Please provide a valid email or username.'),      
    handleValidationErrors
];
// validateLogin
router.post(
    '/',
    validateLogin,
    async (req, res, next) => {
      const { credential, password } = req.body;
  
      const user = await User.unscoped().findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });
      
      // if(!user){
      //   return res.status(400).json({
      //     message: "Bad Request",
      //     errors: {
      //       credential: "Email or username is required",
      //       password: "Password is required"
      //     }
      //   })
      // }
      if(!user||!bcrypt.compareSync(password, user.hashedPassword.toString())){
        return res.status(401).json({
          message:'Invalid credentials'
        })
      }
  
      // if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
      //   const err = new Error('Login failed');
      //   err.status = 401;
      //   err.title = 'Login failed';
      //   err.errors = { credential: 'The provided credentials were invalid.' };
      //   return next(err);
      // }
  
      const safeUser = {
        id: user.id,
        firstName:user.firstName,
        lastName:user.lastName,
        email: user.email,
        username: user.username,
      };
  
      await setTokenCookie(res, safeUser);
  
      return res.json({
        user: safeUser
      });
    }
);


router.delete(
    '/',
    (_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    }
);

router.get(
    '/',
    (req, res) => {
      // console.log(req)
      const { user } = req;
      if (user) {
        const safeUser = {
          id: user.id,
          email: user.email,
          username: user.username,
        };
        return res.json({
          user: safeUser
        });
      } else return res.json({ user: null });
    }
);


module.exports = router;