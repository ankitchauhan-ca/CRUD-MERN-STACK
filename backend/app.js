const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb+srv://ankit:ankit-ca@opreson.0tefo.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoConnect"))
  .catch((err) => console.log("mongo is not yet connect of some error"));

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
});

const Item = mongoose.model("Item", ItemSchema);

app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/items", async (req, res) => {
  try {
    const newItem = new Item({
      name: req.body.name,
      description: req.body.description,
    });

    const savedItem = await newItem.save(); // Save the item to MongoDB
    res.status(201).json(savedItem); // Respond with the saved item
  } catch (error) {
    console.error("Error saving item:", error);
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/items/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    const deletedItem = await Item.findByIdAndDelete(itemId);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(deletedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/items/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    const updatedItem = await Item.findByIdAndUpdate(itemId, req.body, {
      new: true,
    });
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});
