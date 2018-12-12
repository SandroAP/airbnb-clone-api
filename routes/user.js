const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated');

// GET /
router.get('/', isAuthenticated, (req, res, next) => {
  return res.json({
    data: [],
  });
});

// GET /:id
router.get('/:id', isAuthenticated, (req, res, next) => {
  const user = {};
  return res.status(200).json({
    user,
  });
});

// PUT /:id
router.put('/:id', (req, res, next) => {
  const user = {};
  return res.status(200).json({
    user,
  });
});

// DELETE /:id
router.delete('/:id', (req, res, next) => {
  return res.status(204).json();
});

module.exports = router;