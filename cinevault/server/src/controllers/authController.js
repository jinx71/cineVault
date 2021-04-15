const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const sanitize = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const ensureValid = (req) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const err = new Error('Validation failed');
    err.statusCode = 400;
    err.errors = result.array().map((e) => e.msg);
    throw err;
  }
};

const register = asyncHandler(async (req, res) => {
  ensureValid(req);
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);
  success(res, { user: sanitize(user), token }, 'Registration successful', 201);
});

const login = asyncHandler(async (req, res) => {
  ensureValid(req);
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id);
  success(res, { user: sanitize(user), token }, 'Login successful');
});

const getMe = asyncHandler(async (req, res) => {
  success(res, { user: sanitize(req.user) }, 'Current user');
});

module.exports = { register, login, getMe };
