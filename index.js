// Code  for mongoose config in backend
// Filename - backend/index.js

// To connect with your mongoDB database
require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI, {
  dbName: "superheroes",
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// Define a schema for the collection
const heroSchema = new mongoose.Schema({
  Name: String,
  FirstName: String,
  LastName: String,
  Place: String,
  imgSrc: String,
});

// Create a model based on the schema
const Hero = mongoose.model("heroes", heroSchema);

// For backend and express
const express = require("express");
const app = express();
const cors = require("cors");
console.log("App listen at port 5000");
app.use(express.json());
app.use(cors());

// CRUD operations

//GET ALL HEROES
app.get("/", async (req, resp) => {
  const fetchAllUsers = async () => {
    try {
      const heroes = await Hero.find();
      return heroes;
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      // Close the connection after the operation
      //mongoose.connection.close();
    }
  };

  try {
    const heroes = await fetchAllUsers();
    resp.send(heroes);
  } catch (error) {
    resp.status(500).send({ message: "Error fetching users" });
  }
});

// ================================================

// GET HERO BY ID
app.get("/api/SuperHero/:id", async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) {
      return res.status(404).send({ message: "Hero not found" });
    }
    res.send(hero);
  } catch (error) {
    console.error("Error fetching hero:", error);
    res.status(500).send({ message: "Error fetching hero" });
  }
});

// ================================================

// CREATE A NEW HERO

app.post("/api/SuperHero", async (req, res) => {
  try {
    const hero = new Hero({
      Name: req.body.Name,
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Place: req.body.Place,
      imgSrc: req.body.imgSrc,
    });
    const newHero = await hero.save();
    res.send(newHero);
  } catch (error) {
    console.error("Error creating hero:", error);
    res.status(400).send({ message: "Invalid hero data" });
  }
});

// ================================================

// UPDATE A HERO

app.put("/api/SuperHero/:id", async (req, res) => {
  try {
    const hero = await Hero.findByIdAndUpdate(
      req.params.id,
      {
        Name: req.body.Name,
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Place: req.body.Place,
        imgSrc: req.body.imgSrc,
      },
      { new: true }
    );
    if (!hero) {
      return res.status(404).send({ message: "Hero not found" });
    }
    res.send(hero);
  } catch (error) {
    console.error("Error updating hero:", error);
    res.status(500).send({ message: "Error updating hero" });
  }
});

// ================================================
// DELETE A HERO

app.delete("/api/SuperHero/:id", async (req, res) => {
  try {
    const hero = await Hero.findByIdAndDelete(req.params.id);
    if (!hero) {
      return res.status(404).send({ message: "Hero not found" });
    }
    res.send(hero);
  } catch (error) {
    console.error("Error deleting hero:", error);
    res.status(500).send({ message: "Error deleting hero" });
  }
});

const shutdown = () => {
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

const PORT = process.env.PORT || 3000;
app.listen(PORT);
