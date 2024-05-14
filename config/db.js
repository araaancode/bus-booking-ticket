const mongoose = require('mongoose')
const colors=require("colors")

mongoose.set("strictQuery",false)

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI)

  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold)
}

module.exports = connectDB