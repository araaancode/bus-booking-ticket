const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const catchAsync = require('../../middlewares/catchAsync');
const AppError = require('../../middlewares/appError');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode,msg, req, res) => {
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
  if(req.body.password !== req.body.passwordConfirm){
    return res.status(400).json({
      status:"failure",
      msg:"پسوردها مطابقت ندارند !"
    })
  }
    const newUser = await User.create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    createSendToken(newUser, 201,'با موفقیت ثبت نام شدید!', req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  // 1) Check if phone and password exist
  if (!req.body.password) {
    return res.status(400).json({
      status:"failure",
      msg:"پسورد را باید وارد کنید!"
    })
  }

  if (!req.body.phone && !req.body.email) {
    return res.status(400).json({
      status:"failure",
      msg:" همه فیلدها را باید وارد کنید!"
    })
  }

  if(req.body.email){
      // 2) Check if user exists && password is correct
      const user = await User.findOne({ email:req.body.email }).select('+password');
      createSendToken(user, 200,"با موفقیت وارد سایت شدید!", req, res);
  }else if(req.body.phone){
      // 2) Check if user exists && password is correct
      const user = await User.findOne({ phone:req.body.phone }).select('+password');
      createSendToken(user, 200,"با موفقیت وارد سایت شدید!", req, res);
  }

});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};
