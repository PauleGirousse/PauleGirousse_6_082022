const express = require("express");

// Utilisation de framework
const app = express();

// Sécurisation des en-têtes HTTP
const helmet = require("helmet");

const mongoose = require("mongoose");

const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauces");
const path = require("path");

// Package pour pouvoir utiliser les variables d'environnement
require("dotenv").config();

// Utilisation d'helmet et configuration pour le chargement des images
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Connexion à la base de données
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Autorisation d'accès de différentes origines avec les méthodes suivantes
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

// Pour avoir accès au contenu de la requête (req.body)
app.use(express.json());

// Routes vers l'API
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
