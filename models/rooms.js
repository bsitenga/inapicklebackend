const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomSchema = new Schema({
    roomCode: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true,
    },
    joiner: {
        type: String,
        required: true,
    },
    creatorPreferences: {
        type: String,
        required: true,
    },
    joinerPreferences: {
        type: Array,
        required: true,
    },
    restaurants: {
        type: Array,
        required: true,
    },
    start: {
        type: Boolean,
        required: true
    }
});

const Rooms = mongoose.model('Rooms', roomSchema);

module.exports = Rooms;