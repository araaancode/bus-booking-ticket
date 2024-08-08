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


const sendOTPCode = async (phone, admin, req, res) => {
  const code = randKey.generateDigits(5);
  let otp = await OTP.findOne({ phone })

  if (otp) {
    otp.code = code;
    otp.save().then((data) => {
      if (data) {
        res.status(StatusCodes.CREATED).json({
          msg: "کد تایید ارسال شد",
          data
        })
      }

    }).catch((error) => {
      res.status(StatusCodes.BAD_REQUEST).json({
        msg: "کد تایید ارسال نشد",
        error
      })
    })
  } else {
    let newOtp = await OTP.create({
      phone: phone,
      code
    })

    if (newOtp) {
      res.status(StatusCodes.CREATED).json({
        msg: "کد تایید جدید ساخته شد",
        code: newOtp
      })
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        msg: "کد تایید ساخته نشد"
      })
    }

  }

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
        res.status(StatusCodes.CREATED).json({
          status: 'success',
          msg: "ادمین با موفقیت ثبت نام شد",
          newAdmin
        })
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
      res.status(StatusCodes.OK).json({
        status: 'success',
        msg: "با موفقیت وارد سایت شدید",
        admin
      });
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


exports.sendOtp = async (req, res) => {
  try {
    let { phone } = req.body
    let admin = await Admin.findOne({ phone })

    if (admin) {
      await sendOTPCode(phone, admin, req, res)

    } else {
      res.status(StatusCodes.NOT_FOUND).json({
        msg: "ادمین یافت نشد",
      })
    }
  } catch (error) {
    console.error(error.message);
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //   status: 'failure',
    //   msg: "خطای داخلی سرور",
    //   error
    // });
  }
}

exports.verifyOtp = async (req, res) => {
  try {
    let { phone, code } = req.body

    let adminOtp = await OTP.findOne({ phone })
    let admin = await Admin.findOne({ phone })

    if (adminOtp.code === code) {
      createSendToken(admin, StatusCodes.OK, 'success', 'کد تایید با موفقیت ارسال شد', req, res)
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
}
