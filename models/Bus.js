const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const { deflate } = require('zlib');

const busSchema = new mongoose.Schema({
    driver: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please tell bus name!'],
        trim: true,
        maxlength: [25, 'A bus name must have less or equal then 25 characters'],
        minlength: [6, 'A bus name must have more or equal then 6 characters']
    },
    model: {
        type: String,
        required: [true, 'Please provide bus model'],
        trim: true,
    },
    color: {
        type: String,
        trim: true,
    },
    seats: [
        {
            type: Number,
        }
    ],
    cover: String,
    pictures: [{ type: String }],
    isActive: {
        type: Boolean,
        default: true,
        required: true
    },
    features: [
        { type: String }
    ]
});


const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus;