const User = require('../models/User')
const Driver = require('../models/Driver')
const Admin = require('../models/Admin')
const jwt = require('jsonwebtoken')


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


// auth user
exports.authUser = async (req, res, next) => {
  let token = req.cookies.jwt

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      let user = await User.findById(decoded.id).select('-password')
      if (user.role === 'user') {
        req.user = user
        res.locals.user = user
        next()
      }
    } catch (error) {
      res.status(403).json({
        msg: 'authorized has error',
        error,
      })
    }
  }

  if (!token) {
    res.status(403).json({
      msg: 'no token provided',
    })
  }
}

// user pages

exports.setHomeJwt = async (req, res, next) => {
  let token = req.cookies.jwt

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      let user = await User.findById(decoded.id).select('-password')
      req.user = user
      res.locals.user = user
      next()
    } catch (error) {
      res.redirect('/')
    }
  }

  if (!token) {
    res.render('users/index')
  }
}


exports.isLogin = async (req, res, next) => {
  let token = req.cookies.jwt

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      let user = await User.findById(decoded.id).select('-password')
      req.user = user
      res.locals.user = user
      next()
    } catch (error) {
      res.redirect('/login')
    }
  }

  if (!token) {
    res.redirect('/login')
  }
}

exports.forwardAuth = async (req, res, next) => {
  const token = req.cookies.jwt

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        next()
      } else {
        let user = await User.findById(decoded.id).select('-password')
        req.user = user
        res.locals.user = user
        res.redirect('/profile')
      }
    })
  } else {
    next()
  }
}

// ***** driver *****
// auth driver
exports.authDriver = async (req, res, next) => {
  let token = req.cookies.jwt

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      main().then(async (drivers) => {
        let findDriver = drivers.find((driver) => driver._id == decoded.id)
        if (findDriver && findDriver.role === 'driver') {
          req.driver = findDriver
          res.locals.driver = findDriver
          next()
        } else {
          res.status(403).json({ msg: "دسترسی غیرمجاز" })
        }
      }).catch((error) => {
        res.send(error)
      })

      // if (driver.role === 'driver') {
      //   req.driver = driver
      //   res.locals.driver = driver
      //   next()
      // }
    } catch (error) {
      console.log(error);
      res.status(403).json({
        msg: 'authorized has error',
        error,
      })
    }
  }

  if (!token) {
    res.status(403).json({
      msg: 'no token provided',
    })
  }
}

// driver pages
exports.isLoginDriver = async (req, res, next) => {
  let token = req.cookies.jwt

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      let driver = await Driver.findById(decoded.id).select('-password')
      req.driver = driver
      res.locals.driver = driver
      next()
    } catch (error) {
      res.redirect('/login')
    }
  }

  if (!token) {
    res.redirect('/login')
  }
}

exports.forwardAuthDriver = async (req, res, next) => {
  const token = req.cookies.jwt

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        next()
      } else {
        let driver = await Driver.findById(decoded.id).select('-password')
        req.driver = driver
        res.locals.driver = driver
        res.redirect('/profile')
      }
    })
  } else {
    next()
  }
}

// ***** driver end *****


// auth admin
exports.authAdmin = async (req, res, next) => {
  let token = req.cookies.jwt

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      let admin = await Admin.findById(decoded.id).select('-password')
      if (admin.role === 'admin' || admin.role === 'assistant') {
        req.admin = admin
        res.locals.admin = admin
        next()
      }
    } catch (error) {
      res.status(403).json({
        msg: 'authorized has error',
        error,
      })
    }
  }

  if (!token) {
    res.status(403).json({
      msg: 'no token provided',
    })
  }
}

// admin pages
exports.isLoginAdmin = async (req, res, next) => {
  let token = req.cookies.jwt

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      let user = await User.findById(decoded.id).select('-password')
      if (user.isAdmin) {
        req.user = user
        res.locals.user = user
        next()
      } else {
        res.render('admin/admin403')
      }
    } catch (error) {
      res.send({
        msg: 'خطایی وجود دارد',
        error
      })
    }
  }

  if (!token) {
    res.send('توکنی وجود ندارد')
  }
}

exports.forwardAuthAdmin = async (req, res, next) => {
  const token = req.cookies.jwt

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        next()
      } else {
        let user = await User.findById(decoded.id).select('-password')
        if (user.isAdmin) {
          req.user = user
          res.locals.user = user
          res.redirect('/admin')
        } else {
          res.render('admin/admin403')
        }
      }
    })
  } else {
    next()
  }
}

