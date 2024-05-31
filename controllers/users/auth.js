const crypto = require('crypto');
const { promisify } = require('util');
var randKey = require("random-key");
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const catchAsync = require('../../middlewares/catchAsync');
const AppError = require('../../middlewares/appError');
const OTP = require("../../models/OTP")

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};


const sendOTP = async (phone, req, res) => {
  const code = randKey.generateDigits(5);
  let otp = await OTP.findOne({ phone })

  if (otp) {
    otp.code = code;
    otp.save().then((data) => {
      res.status(200).send(data)
    }).catch((error) => {
      res.status(400).send(error)
    })
  }

};

const createSendToken = (user, statusCode, msg, req, res) => {
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
    status: 'success',
    msg,
    token,
    data: {
      user
    }
  });
};

exports.register = catchAsync(async (req, res, next) => {
  if (req.body.password !== req.body.passwordConfirm) {
    return res.status(400).json({
      status: "failure",
      msg: "پسوردها مطابقت ندارند !"
    })
  }

  let findUser= await User.findOne({phone:req.body.phone})

  if(!findUser){
    const newUser = await User.create({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });
  
    // createSendToken(newUser, 201, 'با موفقیت ثبت نام شدید!', req, res);
  
    if(newUser){
      res.status(200).json({
        status: 'success',
        msg: "با موفقیت ثبت نام شدید!",
        newUser
      })
    }else{
      res.status(404).json({
        status: 'failure',
        msg: "کاربر ثبت نام نشد!",
      })
    }
  }else{
    res.status(400).json({
      status: 'failure',
      msg: "کاربر وجود دارد! باید وارد سایت شوید",
    })
  }

});

exports.login = catchAsync(async (req, res, next) => {
  // 1) Check if phone and password exist
  if (!req.body.password) {
    return res.status(400).json({
      status: "failure",
      msg: "پسورد را باید وارد کنید!"
    })
  }

  if (!req.body.phone && !req.body.email) {
    return res.status(400).json({
      status: "failure",
      msg: " همه فیلدها را باید وارد کنید!"
    })
  }

  if (req.body.email) {
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email: req.body.email }).select('+password');
    // createSendToken(user, 200, "با موفقیت وارد سایت شدید!", req, res);
    if (user) {
      res.status(200).json({
        status: 'success',
        msg: "با موفقیت وارد سایت شدید!",
        user
      })
    } else {
      res.status(404).json({
        status: 'failure',
        msg: "کاربری با چنین مشخصاتی وجود ندارد!",
      })
    }

  } else if (req.body.phone) {
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ phone: req.body.phone }).select('+password');
    // createSendToken(user, 200, "با موفقیت وارد سایت شدید!", req, res);
    if (user) {
      res.status(200).json({
        status: 'success',
        msg: "با موفقیت وارد سایت شدید!",
        user
      })
    } else {
      res.status(404).json({
        status: 'failure',
        msg: "کاربری با چنین مشخصاتی وجود ندارد!",
      })
    }
  }

});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};


exports.sendOtp = catchAsync(async (req, res) => {
  let { phone } = req.body
  let user = await User.findOne({ phone })

  if (user) {
    sendOTP(phone, req, res)
  } else {
    res.status(404).json({
      msg: "user not found",
    })
  }
})

exports.verifyOtp = catchAsync(async (req, res) => {
  let { phone, code } = req.body

  let userOtp = await OTP.findOne({ phone })
  let user = await User.findOne({phone})
  if (userOtp.code === code) {
    createSendToken(user,200,"کد تایید شد",req,res)
    // res.status(200).json({
    //   status: 'success',
    //   msg: "کد وارد شده درست است!",
    //   otp:userOtp,
    //   user:user
    // })
  } else {
    res.status(404).json({
      msg: "کد وارد شده اشتباه است!"
    })
  }
})