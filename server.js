// load env vars
require("dotenv").config()

// ext libs
const express = require("express")
const colors = require("colors")
const path = require("path")
const cookieParser = require('cookie-parser')

// app init
const app = express()

// connect to database
const connection = require("./config/db")
connection()

// routes
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(cookieParser())


// mount users routes
app.use('/api/v1/users/auth',authRoutes)
app.use('/api/v1/users',userRoutes)

app.get('/', (req, res) => {
    res.render('index')
})


// error middleware

// server setup
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is up and running -> listening at PORT ${PORT}`.bgBlue);
})