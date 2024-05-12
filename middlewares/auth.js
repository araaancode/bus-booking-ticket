const User = require('../models/User')
const jwt = require('jsonwebtoken')

// auth user
const authUser = async (req, res, next) => {
  let token = req.cookies.jwt

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      let user = await User.findById(decoded.id).select('-password')
      req.user = user
      res.locals.user = user
      next()
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
const isLogin = async (req, res, next) => {
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

const forwardAuth = async (req, res, next) => {
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

// auth admin
const authAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401).send('Not authorized as an admin')
  }
}

// admin pages
const isLoginAdmin = async (req, res, next) => {
  let token = req.cookies.jwt

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      let user = await User.findById(decoded.id).select('-password')
      if(user.isAdmin){
        req.user = user
        res.locals.user = user
        next()
      }else{
        res.render('admin/admin403')
      }
    } catch (error) {
      res.send({
        msg:'خطایی وجود دارد',
        error
      })
    }
  }

  if (!token) {
    res.send('توکنی وجود ندارد')
  }
}

const forwardAuthAdmin = async (req, res, next) => {
  const token = req.cookies.jwt

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        next()
      } else {
        let user = await User.findById(decoded.id).select('-password')
        if(user.isAdmin){
          req.user = user
          res.locals.user = user
          res.redirect('/admin')
        }else{
          res.render('admin/admin403')
        }
      }
    })
  } else {
    next()
  }
}

module.exports = {
  authUser,
  isLogin,
  forwardAuth,
  authAdmin,
  isLoginAdmin,
  forwardAuthAdmin
}