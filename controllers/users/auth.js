const crypto = require('crypto');
const { promisify } = require('util');
const randKey = require("random-key");
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const catchAsync = require('../../middlewares/catchAsync');
const AppError = require('../../middlewares/appError');
const OTP = require("../../models/OTP")
const { StatusCodes } = require("http-status-codes")

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};


const sendOTPCode = async (phone, req, res) => {
  const code = randKey.generateDigits(5);
  let otp = await OTP.findOne({ phone })


  if (otp) {
    otp.code = code;
    otp.save().then((data) => {
      res.status(200).json(data)
    }).catch((error) => {
      res.status(400).json(error)
    })
  } else {
    let newOtp = await OTP.create({
      phone: phone,
      code
    })

    if (newOtp) {
      res.status(201).json({
        msg: "otp code created",
        code: newOtp
      })
    } else {
      res.status(400).json({
        msg: "otp code not created"
      })
    }

  }

};

const createSendToken = (user, statusCode, statusMsg, msg, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: statusMsg,
    msg,
    token,
    data: {
      user
    }
  });
};

exports.register = async (req, res, next) => {

  try {
    let findUser = await User.findOne({ phone: req.body.phone })

    if (findUser) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: 'failure',
        msg: "کاربر وجود دارد. وارد سایت شوید!",
      })
    } else {
      let newUser = await User.create({
        phone: req.body.phone,
        password: req.body.password,
      })

      if (newUser) {
        createSendToken(newUser, StatusCodes.CREATED, 'success', 'کاربر با موفقیت ثبت نام شد', req, res)
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

exports.login = catchAsync(async (req, res, next) => {

  try {
    let { phone, password } = req.body
    if (!phone || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'failure',
        msg: "همه فیلدها باید وارد شوند!",
      });
    }
    let findUser = await User.findOne({ phone: req.body.phone })
    if (findUser) {
      createSendToken(findUser, StatusCodes.OK, 'success', 'کاربر با موفقیت وارد سایت شد', req, res)
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: 'failure',
        msg: "کاربر وجود ندارد. باید ثبت نام کنید",
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
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};


exports.sendOtp = async (req, res) => {
  try {
    let { phone } = req.body
    let user = await User.findOne({ phone })

    if (user) {
      await sendOTPCode(phone, req, res)
    } else {
      res.status(StatusCodes.NOT_FOUND).json({
        msg: "کاربر یافت نشد",
      })
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

exports.verifyOtp = catchAsync(async (req, res) => {
  try {
    let { phone, code } = req.body

    let userOtp = await OTP.findOne({ phone })
    let user = await User.findOne({ phone })

    if (userOtp.code === code) {
      createSendToken(user, StatusCodes.OK, 'success', "کد تایید شد", req, res)
    } else {
      res.status(StatusCodes.NOT_FOUND).json({
        msg: "کد وارد شده اشتباه است!"
      })
    }
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'failure',
      msg: "خطای داخلی سرور",
      error
    });
  }
})
