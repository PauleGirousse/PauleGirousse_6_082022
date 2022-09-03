const express = require("express");

// utilisation de framework
const app = express();

const mongoose = require("mongoose");

const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauces");
const path = require("path");
// const likeRoutes = require("./routes/sauces");

mongoose
  .connect(
    "mongodb+srv://Paule:Projet6@cluster0.xo6qjby.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Format JSON pour avoir accès au contenu de la requête
app.use(express.json());

// Routes vers l'API
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
// app.use("/api/sauces", likeRoutes);

module.exports = app;
