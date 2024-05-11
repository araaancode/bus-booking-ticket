const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');

const ticketSchema = new mongoose.Schema({
    driver: {
        type: mongoose.Schema.ObjectId,
        ref: 'Driver',
        required: true
    },
    passengers: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    bus:
    {
        type: mongoose.Schema.ObjectId,
        ref: 'Bus',
        required: true
    }
    ,
    movingDate: {
        type: Date,
        default: Date.now()
    },
    hour: {
        type: Date,
        default: Date.now()
    },
    firstCity:{
        type:String,
        required:true
    },
    lastCity:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    seatNumbers:[{
        type:Number
    }]
});


const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;