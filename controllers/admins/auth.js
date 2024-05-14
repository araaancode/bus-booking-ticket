const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Admin = require('../../models/Admin');
const catchAsync = require('../../middlewares/catchAsync');
const AppError = require('../../middlewares/appError');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (admin, statusCode, req, res) => {
    const token = signToken(admin._id);

    console.log(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000);

    res.cookie('jwt', token, {
        expires: new Date(
            Date.now() + 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });

    // Remove password from output
    admin.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            admin
        }
    });
};

exports.register = catchAsync(async (req, res, next) => {
    const newAdmin = await Admin.create({
        name: req.body.name,
        phone: req.body.phone,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    createSendToken(newAdmin, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { phone, password } = req.body;

  // 1) Check if phone and password exist
  if (!phone || !password) {
    return next(new AppError('Please provide phone and password!', 400));
  }
  // 2) Check if admin exists && password is correct
  const admin = await Admin.findOne({ phone }).select('+password');

  if (!admin || !(await admin.correctPassword(password, admin.password))) {
    return next(new AppError('Incorrect phone or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(admin, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};
