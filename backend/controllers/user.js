// Pour sécuriser l'adresse mail et le mot de passe de l'utilisateur
const bcrypt = require("bcrypt");
const cryptojs = require("crypto-js");

// Pour utiliser les variables d'environnement
require("dotenv").config();

// Utilisation du token
const jwt = require("jsonwebtoken");

// Utilisation du schéma utilisateur
const User = require("../models/User");

// Fonction d'enregistrement d'un utilisateur avec cryptage de l'adresse mail et du mot de passe
exports.signup = (req, res) => {
  const cryptoEmail = cryptojs
    .HmacSHA256(req.body.email, process.env.CRYPTO_EMAIL)
    .toString();
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: cryptoEmail,
        password: hash,
      });

      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Fonction de connexion d'un utilisateur avec cryptage de l'adresse mail et comparaison du hash du mot de passe
exports.login = (req, res) => {
  const cryptoEmail = cryptojs
    .HmacSHA256(req.body.email, process.env.CRYPTO_EMAIL)
    .toString();
  User.findOne({ email: cryptoEmail })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Paire login/mot de passe incorrecte" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Paire login/mot de passe incorrecte" });
          }
          res.status(200).json({
            userId: user.id,
            token: jwt.sign(
              { userId: user.id },
              `${process.env.RANDOM_TOKEN_SECRET}`,
              {
                expiresIn: "24h",
              }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
