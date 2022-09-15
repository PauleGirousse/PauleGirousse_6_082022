const validator = require("email-validator");

// Pour valider le format d'email avant le cryptage
module.exports = (req, res, next) => {
  if (validator.validate(req.body.email)) {
    next();
  } else {
    return res.status(400).json({
      error: "L'email n'est pas valide",
    });
  }
};
