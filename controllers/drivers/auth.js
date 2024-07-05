const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Driver = require('../../models/Driver');
const catchAsync = require('../../middlewares/catchAsync');
const AppError = require('../../middlewares/appError');
const bcrypt = require("bcryptjs")

const { MongoClient } = require('mongodb');

async function main() {
  const uri = process.env.MONGO_URI;

  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Specify the database and collection
    const database = client.db('bus_db');
    const collection = database.collection('drivers');

    // Query the collection (fetch data)
    const query = {}; // Define your query here
    const options = {
      // Optionally, you can add options like sort, limit, etc.
    };

    const results = await collection.find(query, options).toArray();

    return results
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    await client.close();
  }
}



const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (driver, statusCode, msg, req, res) => {
  const token = signToken(driver._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });

  // Remove password from output
  driver.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    msg,
    token,
    data: {
      driver
    }
  });
};

exports.register = catchAsync(async (req, res, next) => {
  const { name, phone, password, passwordConfirm } = req.body


  if (!name || !phone || !password || !passwordConfirm) {
    res.status(401).json({ msg: "همه فیلدها باید وارد شوند!" })
  } else {
    main().then(async (drivers) => {
      let findDriver = drivers.find((driver) => driver.phone === phone)
      if (findDriver) {
        res.status(401).json({ msg: "راننده وجود دارد باید وارد سایت شوید!" })
      } else {
        const newDriver = await Driver.create({
          name: req.body.name,
          phone: req.body.phone,
          password: req.body.password,
          passwordConfirm: req.body.passwordConfirm
        });
        if (newDriver) {
          createSendToken(newDriver, 201, 'راننده با موفقیت ثبت نام شد', req, res);
        } else {
          res.status(401).json({ msg: "راننده ثبت نام نشد" })
        }
      }
    }).catch((error) => {
      res.send(error)
    })
  }

});

exports.login = catchAsync(async (req, res, next) => {
  const { phone, password } = req.body;

  // 1) Check if phone and password exist
  if (!phone || !password) {
    res.status(401).json({ msg: "همه فیلدها باید وارد شوند!" })
  } else {
    main().then(async (drivers) => {
      console.log(drivers);
      let findDriver = drivers.find((driver) => driver.phone === phone)
      if (!findDriver) {
        res.status(401).json({ msg: "راننده با چنین مشخصاتی پیدا نشد. باید ثبت نام کنید" })
      } else {
        let findDriverPassword = findDriver.password
        if (await bcrypt.compare(password, findDriverPassword)) {
          createSendToken(findDriver, 200, 'راننده با موفقیت وارد سایت شد', req, res);
        } else {
          res.status(401).json({ msg: "پسورد اشتباه است" })
        }

      }
    }).catch((error) => {
      res.send(error)
    })
  }


  // // 2) Check if driver exists && password is correct
  // const driver = await Driver.findOne({ phone }).select('+password');

  // if (!driver || !(await driver.correctPassword(password, driver.password))) {
  //   return res.status(401).json({ msg: 'Incorrect phone or password' });
  // }

  // // 3) If everything ok, send token to client
  // createSendToken(driver, 200, req, res);



});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.redirect('/login')
};
