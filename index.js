const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const app = express();
let Rooms = require('./models/rooms');

require('dotenv').config();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }
);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

//ALL API ENDPOINTS BELOW 
//test endpoint for heroku
app.get('/', function (req, res) {
    res.send("Hello Heroku");
})

//Get all summary data
app.get('/rooms', function (req, res) {
    Rooms.find(function(err, room) {
        if (err) return handleError(err);
        res.json(room);
    })
    .catch(err => console.log(err))
})

//Adds one user's preferences to the db
app.post('/roomcreator', function (req, res) {
    const roomCode = req.body.roomCode;
    const creator = req.body.creator;
    const joiner = "NOJOIN";
    const creatorPreferences = [];
    const joinerPreferences = [];
    const restaurants = [];
    const start = false;
    const newRoom = new Rooms({
        roomCode,
        creator,
        joiner,
        creatorPreferences,
        joinerPreferences,
        restaurants,
        start
    })

    newRoom.save()
        .then(() => res.json('Room created!'))
        .catch(err => res.status(400).json('Error: ' + err));
})

//Updates the average of user preferences
app.post('/roomjoiner', function (req, res) {
    const joiner = req.body.joiner;
    const roomCode = req.body.roomCode;

    const query = Rooms.where({ roomCode: roomCode });
    query.findOne(function (err, joinedRoom) {
        if (err) return handleError(err);
        if (joinedRoom) {
            Rooms.findOneAndUpdate({ roomCode: roomCode }, {
                roomCode: roomCode,
                creator: joinedRoom.creator,
                joiner: joiner,
                creatorPreferences: joinedRoom.creatorPreferences,
                joinerPreferences: joinedRoom.joinerPreferences,
                restaurants: joinedRoom.restaurants,
                start: joinedRoom.start
            })
        }
    }, function() {
        return res.json("Joiner is in!")
    })
})

// Catchall for any request that doesn't
// match one above: sends back error message
app.get('*', (req, res) => {
    res.send("CATCHALL ERROR: UNKNOWN ROUTE");
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`In a Pickle listening on ${port}`);