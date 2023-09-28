const express = require("express");
const app = express();
const mongoose = require("mongoose");
var cors = require("cors");
require("dotenv").config();

const apiData = require("./mongoDB/apiData");
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected!"))
  .catch((error) => {
    console.error("Connection error:", error);
    process.exit(1); // Exit the application on connection error
  });

app.get("/", async function (req, res) {
  try {
    const result = await apiData.find({});
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "An error occurred while fetching items" });
  }
});

app.post("/create", async (req, res) => {
  try {
    const { name, email, phone, company, website, address, avatar } = req.body;
    console.log(avatar);
    const newData = new apiData({
      name,
      email,
      phone,
      company,
      website,
      address,
      avatar,
    });
    const result = await newData.save();

    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating data:", error);
    res.status(500).json({ error: "An error occurred while creating data" });
  }
});

app.put("/update/:id", async (req, res) => {
  try {
    const { name, email, phone, company, website, address, avatar } = req.body;
    const updatedData = {
      name,
      email,
      phone,
      company,
      website,
      address,
      avatar,
    };
    const result = await apiData.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });
    if (!result) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "An error occurred while updating data" });
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const result = await apiData.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.status(204).end(); // Successfully deleted, no content to send
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: "An error occurred while deleting data" });
  }
});

app.get("/search/:name", async (req, res) => {
  try {
    const searchQuery = req.params.name; // Get the name from the URL parameter

    // Check if the search query is empty
    if (searchQuery) {
      // If the query is empty, return all data

      const result = await apiData.find({
        name: { $regex: searchQuery, $options: "i" },
      });
      res.status(200).json(result);
    } else {
      const allData = await apiData.find({});
      res.status(200).json(allData);
      // Use Mongoose to search for data by name
    }
  } catch (error) {
    console.error("Error searching items by name:", error);
    res
      .status(500)
      .json({ error: "An error occurred while searching items by name" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
