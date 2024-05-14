// load env vars
require("dotenv").config()

// ext libs
const express = require("express")
const colors = require("colors")
const path = require("path")
const cookieParser = require('cookie-parser')

// app init
const app = express()

// internal libs
const errorMiddleware=require("./middlewares/errors")
const mongoErrorMiddleware=require("./middlewares/mongo_error")

// connect to database
const connection = require("./config/db")
connection()

// routes
const authUsersRoutes = require("./routes/users/auth")
const userRoutes = require("./routes/users/users")

const authDriversRoutes = require("./routes/drivers/auth")
const driverRoutes = require("./routes/drivers/drivers")

const busRoutes = require("./routes/buses/buses")


// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(cookieParser())



// mount users routes
app.use('/api/v1/users/auth',authUsersRoutes)
app.use('/api/v1/users',userRoutes)

// mount drivers and bus routes
app.use('/api/v1/drivers/auth',authDriversRoutes)
app.use('/api/v1/drivers',driverRoutes)
app.use('/api/v1/buses',busRoutes)


// pages routes
app.get('/', (req, res) => {
    res.render('index')
})

// error middlewares
app.use(errorMiddleware.handler404)
app.use(errorMiddleware.handlerServerErrors)
app.use(mongoErrorMiddleware)

// server setup
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is up and running -> listening at PORT ${PORT}`.bgBlue);
})