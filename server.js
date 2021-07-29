require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const validUrl = require("valid-url");
const app = express();

const { connectDb, models } = require("./models/index");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", async function (req, res) {
  let { url } = req.body;
  const { Url } = models;
  try {
    if (validUrl.isUri(url)) {
      let item = await Url.findOne({
        original_url: url,
      });
      if (item) {
        return res.status(201).json({
          original_url: item.original_url,
          short_url: item.short_url,
        });
      } else {
        let item = await Url.create({
          original_url: url,
          short_url: Math.ceil(Math.random() * 100000),
        });
        return res.status(201).json({
          original_url: item.original_url,
          short_url: item.short_url,
        });
      }
    } else {
      res.json({ error: "invalid url" });
    }
  } catch (error) {
    console.log(error);
    res.status(error.status || 400).json({ error: error.message });
  }
});

app.get("/api/shorturl", async (req, res) => {
  try {
    const { Url } = models;
    let items = await Url.find();
    console.log("🚀 ~ file: server.js ~ line 65 ~ app.get ~ items", items);
    return res.status(200).json({ data: items });
  } catch (error) {
    console.log(error);
    res.status(error.status || 400).json({ error: error.message });
  }
});

app.get("/api/shorturl/:short_url", async (req, res) => {
  try {
    let { short_url } = req.params;
    const { Url } = models;
    let item = await Url.findOne({ short_url: short_url || "-1" });
    if (!item) {
      throw { message: "No valid resource found with this uri", status: 404 };
    }
    return res.redirect(item.original_url);
  } catch (error) {
    console.log(error);
    res.status(error.status || 400).json({ error: error.message });
  }
});

console.log("Connecting with MongoDb");

connectDb()
  .then(() => {
    app.listen(port, function () {
      console.log("Connection established");
      console.log(`Listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
