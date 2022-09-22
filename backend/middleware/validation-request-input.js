// Regex pour les champs de type "chaines de caractères"
const regexp = /^[a-zA-Zàâäéèêëïîôöùüç0-9'\-,&!.\s]+$/;

// Pour valider les champs des inputs de la sauce à modifier selon la regexp
module.exports = (req, res, next) => {
  if (
    regexp.test(req.body.name) &&
    regexp.test(req.body.manufacturer) &&
    regexp.test(req.body.description) &&
    regexp.test(req.body.mainPepper)
  ) {
    next();
  } else {
    return res.status(400).json({
      error: "Champs invalides",
    });
  }
};
