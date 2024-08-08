const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    phone: {
        type: String,
        validate: {
            validator: function (v) {
                return /09\d{9}/.test(v);
            },
            message: (props) => `${props.value} is not a valid phone number!`,
        },
        required: [true, "admin phone number required"],
        unique: true,
    },
    email:{
        type: String,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    role:{
        type:String,
        enum: ['admin','assistant'],
        default:'assistant',
        required:true
    }
},{ timestamps: true });

adminSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

adminSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

adminSchema.pre(/^find/, function (next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
});

adminSchema.methods.correctPassword = async function (
    candidatePassword,
    adminPassword
) {
    return await bcrypt.compare(candidatePassword, adminPassword);
};



const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;