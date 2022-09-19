const PasswordValidator = require("password-validator");

// Création d'un schéma de validation du mot de passe utilisateur
const passwordSchema = new PasswordValidator();
passwordSchema
  .is()
  .min(8) // longueur minimale de 8
  .is()
  .max(20) // longueur maximale de 10
  .has()
  .uppercase() // majuscule obligatoire
  .has()
  .lowercase() // minuscule obligatoire
  .has()
  //   .not()
  //   .spaces() // ne contient pas d'espace
  .not(/[<>(),;:\s]/);

// Validation du mot de passe avant qu'il ne soit crypté
module.exports = (req, res, next) => {
  if (passwordSchema.validate(req.body.password)) {
    next();
  } else {
    return res.status(400).json({
      error:
        "Le mot de passe doit contenir entre 8 et 20 caractères, au moins une majuscule et une minuscule, sans certains caractères spéciaux <>(),;: ni espace",
    });
  }
};
