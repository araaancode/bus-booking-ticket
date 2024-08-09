const crypto = require('crypto');
const { promisify } = require('util');
const randKey = require("random-key");
const jwt = require('jsonwebtoken');
const Admin = require('../../models/Admin');
const catchAsync = require('../../middlewares/catchAsync');
const AppError = require('../../middlewares/appError');
const OTP = require("../../models/OTP")
const { StatusCodes } = require("http-status-codes")

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};


const createSendToken = (admin, statusCode, statusMsg, msg, req, res) => {
  const token = signToken(admin._id);

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
    status: statusMsg,
    msg,
    token,
    data: {
      admin
    }
  });
};

exports.register = async (req, res, next) => {

  try {
    let findAdmin = await Admin.findOne({ phone: req.body.phone })

    if (findAdmin) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: 'failure',
        msg: "ادمین وجود دارد. وارد سایت شوید!",
      })
    } else {

      let newAdmin = await Admin.create({
        phone: req.body.phone,
        password: req.body.password,
      })

      if (newAdmin) {
        console.log(newAdmin);
        createSendToken(newAdmin, StatusCodes.OK, 'success', ' با موفقیت ثبت نام شدید', req, res)
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'failure',
      msg: "خطای داخلی سرور",
      error
    });
  }

}

exports.login = async (req, res, next) => {

  try {
    const { phone, password } = req.body;

    // 1) Check if phone and password exist
    if (!phone || !password) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: 'failure',
        msg: "همه فیلدها باید وارد شوند!",
      });
    }


    // 2) Check if admin exists && password is correct
    const admin = await Admin.findOne({ phone }).select('+password');

    if (!admin || !(await admin.correctPassword(password, admin.password))) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: 'failure',
        msg: "پسورد نادرست است",
      });
    }

    // 3) If everything ok, send token to client
    // createSendToken(admin,StatusCodes.OK, 'success','با موفقیت وارد سایت شدید', req, res);
    if (admin) {
      createSendToken(admin, StatusCodes.OK, 'success', ' با موفقیت وارد سایت شدید', req, res)
    } else {
      res.status(StatusCodes.NOT_FOUND).json({
        status: 'failure',
        msg: "ادمین یافت نشد. باید ثبت نام کنید.",
      });
    }

  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'failure',
      msg: "خطای داخلی سرور",
      error
    });
  }
}

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

