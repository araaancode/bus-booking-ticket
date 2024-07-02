const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const driverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!'],
        maxlength: [30, 'driver name must have less or equal then 30 characters'],
        minlength: [6, 'driver name must have more or equal then 6 characters']
    },
    phone: {
        type: String,
        validate: {
            validator: function (v) {
                return /09\d{9}/.test(v);
            },
            message: (props) => `${props.value} is not a valid phone number!`,
        },
        required: [true, "User phone number required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },

    bus: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bus',
    },

    passwordConfirm: {
        type: String,
        // required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        },
        select: false
    },
    active: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        default: 'driver',
        required: true
    },
    arrival: {
        type: String,
        default: false
    },
    isArrived: {
        type: Boolean,
        default: false
    },
    cities: [{
        type: String,
    }],
    movingDate: {
        type: Date,
        default: Date.now()
    },
    hour: {
        type: Date,
        default: Date.now()
    },
    price: {
        type: Number,
    },

}, { timestamps: true, collection: 'drivers' });

driverSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

driverSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

driverSchema.pre(/^find/, function (next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
});

driverSchema.methods.correctPassword = async function (
    candidatePassword,
    diverPassword
) {
    return await bcrypt.compare(candidatePassword, diverPassword);
};


const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;