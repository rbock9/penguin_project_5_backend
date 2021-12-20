///////////////////////////////
// DEPENDENCIES
////////////////////////////////
// get .env variables
require("dotenv").config();
// pull PORT from .env, give default value of 3000
// pull DATABASE_URL from .env
const { PORT = 3000, DATABASE_URL } = process.env;
// import express
const express = require("express");
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose");
// import middlware
const cors = require("cors");
const morgan = require("morgan");
// import file for seed data
const gamesSeed = require("./gamesseed")

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
mongoose.connect(DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
// Connection Events
mongoose.connection
  .on("open", () => console.log("You are connected to Mongoose"))
  .on("close", () => console.log("You are disconnected from Mongoose"))
  .on("error", (error) => console.log(error));

///////////////////////////////
// MODELS
////////////////////////////////
const GamesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imagelink: String,
  developer: String,
  publisher: String,
  platform: String,
  release: String,
  summary: String
},{timestamps: true})

const Games = mongoose.model("Games", GamesSchema);

///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

///////////////////////////////
// ROUTES
////////////////////////////////
// Test route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// SEED ROUTE - THIS WILL RESET DATABASE WITH SEED DATA
// THIS WILL DELETE AND REPLACE OF YOUR GAMES
// USE WITH CAUTION
app.get("/games/seed", (req, res) => {
    Games.deleteMany({})
      .then((data) => {
        Games.create(gamesSeed)
          .then((data) => {
            res.json(data)
          })
      })
  })

// All Games - Index Route
app.get("/games", async (req, res) => {
  try {
    // send all games
    res.json(await Games.find({}));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// Individual Game Create Route
app.post("/games", async (req, res) => {
  try {
    // send all games
    res.json(await Games.create(req.body));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// Individual Game Update Route
app.put("/games/:id", async (req, res) => {
  try {
    // send all games
    res.json(
      await Games.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// Individual Game Delete Route
app.delete("/games/:id", async (req, res) => {
  try {
    // send all games
    res.json(await Games.findByIdAndRemove(req.params.id));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});


// Individual Game Show Route
app.get("/games/:id", async (req, res) => {
    // get the id from params
    const id = req.params.id
    try {
      // send individual games
      res.json(await Games.findById(id));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
});


///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));