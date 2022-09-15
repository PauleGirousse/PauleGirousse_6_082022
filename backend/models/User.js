const mongoose = require("mongoose");

// L'adresse mail doit être unique
const uniqueValidator = require("mongoose-unique-validator");

// Schéma d'un compte utilisateur et exportation
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
