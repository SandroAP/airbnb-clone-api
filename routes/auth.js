const express = require('express');
const router = express.Router();
const Validator = require('validatorjs');
const firebase = require('firebase');
const {UserModel} = require('../models/user');
const jwt = require('jsonwebtoken');

//POST /login
router.post('/login', (req, res, next) => {
	const { body } = req;
	const userRules = {
	    email: 'required|string|email',
	    password: 'required',
	};
	const validation = new Validator(body, userRules);
	if (validation.fails()) {
		const { errors } = validation.errors;
		return res.status(400).json({
		  code: 400,
		  errors
		});
	}

	const {email, password} = body;
	firebase.auth().signInWithEmailAndPassword(email, password).then(async auth => {
		const user = await UserModel.findOne({email}).exec();
		if(!user){
			return res.json({
				code: 401,
				message: 'Unauthorized'
			});
		}

		const token = jwt.sign({user}, process.env.JWT_SECRETKEY, {
			expiresIn: process.env.JWT_EXPIRESIN
		});

		const refreshToken = jwt.sign({user}, process.env.JWT_SECRETKEY, {
			expiresIn: process.env.JWT_REFRESHTOKEN_EXPIRESIN
		});

		return res.status(200).json({
			code: 200,
			token,
			refreshToken,
		});
	}).catch(err => {
		return res.json({
			code: 401,
			message: 'Unauthorized'
		});
	});
});

// POST signup/
router.post('/signup', (req, res, next) => {
  const { body } = req;
  const userRules = {
    name: 'required|string',
    lastName: 'required|string',
    email: 'required|string|email',
    userType: 'required|string',
    password: 'required|string|confirmed',
    password_confirmation: 'required|string',
  };
  const validation = new Validator(body, userRules);
  if (validation.fails()) {
    const { errors } = validation.errors;
    return res.status(400).json({
      code: 400,
      errors,
    });
  }
  const { name, lastName, email, userType, password } = body;
  firebase.auth().createUserWithEmailAndPassword(email, password).then(account => {
    const user = new UserModel({
      name,
      lastName,
      email,
      userType,
      providerId: account.user.uid,
    });
    user.save();
    return res.status(201).json();
  }).catch(err => {
    return res.status(400).json({
      code: 400,
      message: err.message,
    });
  });
});


module.exports = router;