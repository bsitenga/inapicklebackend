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
    Rooms.find(function (err, room) {
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
    const query = Rooms.findOne(function (err, allRooms) {
        if (err) return handleError(err);
        if (allRooms) {
            Rooms.findOneAndUpdate({ roomCode: roomCode }, {
                joiner: joiner
            }, function () {
                return res.json("Room updated");
            })
        }
    })
})

app.post('/restaurants', function (req, res) {
    const restaurants = req.body.restaurants;
    const roomCode = req.body.roomCode;
    const query = Rooms.findOne(function (err, allRooms) {
        if (err) return handleError(err);
        if (allRooms) {
            Rooms.findOneAndUpdate({ roomCode: roomCode }, {
                restaurants: restaurants
            }, function () {
                return res.json("Restaurants added");
            })
        }
    })
})

app.post('/preferences', function (req, res) {
    const roomCode = req.body.roomCode;
    const restaurantName = req.body.restaurantName;
    const userType = req.body.userType;
    console.log(req.body);
    if (userType === "creator") {
        Rooms.findOneAndUpdate({ roomCode: roomCode },
            { $push: { creatorPreferences: restaurantName } },
            function (error, success) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(success);
                }
            })
    } else if (userType === "joiner") {
        Rooms.findOneAndUpdate({ roomCode: roomCode },
            { $push: { joinerPreferences: restaurantName } },
            function (error, success) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(success);
                }
            })
    }

})

// Catchall for any request that doesn't
// match one above: sends back error message
app.get('*', (req, res) => {
    res.send("CATCHALL ERROR: UNKNOWN ROUTE");
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`In a Pickle listening on ${port}`);