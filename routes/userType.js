const express = require('express');
const router = express.Router();
const Validator = require('validatorjs');
const {UserTypeModel} = require('../models/userType');
const isAuthenticated = require('../middlewares/isAuthenticated');

// GET /
router.get('/', isAuthenticated, (req, res, next) => {
  UserTypeModel.find({})
  .then(doc => {
    res.json(doc)
  }).catch(err => {
    res.status(500).json({
      code: 500,
      err,
    });
  });
});

// GET /:id
router.get('/:id', isAuthenticated, (req, res, next) => {
  UserTypeModel.findOne({
    _id: req.params.id
  }).then(doc => {
    res.json(doc)
  }).catch(err => {
    res.status(500).json({
      code: 500,
      err,
    });
  });
});

// POST /
router.post('/', isAuthenticated, (req, res, next) => {
  const { body } = req;
  const userTypeRules = {
    name: 'required|string',
    type: 'required|string',
  };
  const validation = new Validator(body, userTypeRules);
  if (validation.fails()) {
    const { errors } = validation.errors;
    return res.status(400).json({
      code: 400,
      errors,
    });
  }
  const { name, type } = body;

  const userType = new UserTypeModel({
      name,
      type,
    });

  userType.save();
  return res.status(201).json();
});


// PUT /:id
router.put('/:id', isAuthenticated, (req, res, next) => {
  UserTypeModel.findOneAndUpdate({
    _id: req.params.id
  }, req.body, {
      new: true
  }).then(doc => {
    res.json(doc)
  }).catch(err => {
    res.status(500).json({
      code: 500,
      err,
    });
  });
});

// DELETE /:id
router.delete('/:id', isAuthenticated, (req, res, next) => {
  UserTypeModel.findOneAndDelete({
    _id: req.params.id
  }).then(doc => {
    return res.status(204).json();
  }).catch(err => {
    res.status(500).json({
      code: 500,
      errors,
    });
  });
});

module.exports = router;