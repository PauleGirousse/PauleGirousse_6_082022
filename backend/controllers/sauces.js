// Pour la suppression de fichiers
const fs = require("fs");

// Modèle de sauce
const Sauce = require("../models/Sauce");

// Regex pour les champs de type "chaines de caractères"
const regexp = /^[a-zA-Zàâäéèêëïîôöùûüç0-9'\-,&!.\s]+$/;

// Création d'une sauce (suppression de l'indentifiant pour en générer un à partir du token)
exports.createSauce = (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);

  delete sauceObject.id;
  delete sauceObject.userId;

  if (
    regexp.test(sauceObject.name) &&
    regexp.test(sauceObject.manufacturer) &&
    regexp.test(sauceObject.description) &&
    regexp.test(sauceObject.mainPepper)
  ) {
    const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    });

    sauce
      .save()
      .then(() => {
        res.status(201).json({ message: "Sauce enregistrée" });
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  } else {
    return res.status(400).json({
      error: "Champs invalides",
    });
  }
};

// Récupération d'une seule sauce de l'API
exports.getOneSauce = (req, res) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};

// Modification d'une sauce
exports.modifySauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Si l'utilisateur n'est pas le créateur de la sauce
      if (sauce.userId !== req.auth.userId) {
        res.status(403).json({ message: "Non autorisé" });
        // L'utilisateur est le créateur de la sauce
      } else {
        // Si la requête contient une image
        if (req.file) {
          // Suppression du fichier image
          const filename = sauce.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            // Création du nouvel objet avec la nouvelle image
            const sauceObject = {
              ...req.body,
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
              }`,
            };
            delete sauceObject.userId;
            // Mise à jour de la sauce
            Sauce.updateOne(
              { _id: req.params.id },
              { ...sauceObject, _id: req.params.id }
            )
              .then(() => {
                res.status(200).json({ message: "image et sauce modifiées" });
              })
              .catch((error) => {
                console.log(error);
                res.status(401).json({ error });
              });
          });
          // Si la requête ne contient pas d'image
        } else {
          const sauceObject = {
            ...req.body,
          };
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "sauce modifiée" }))
            .catch((error) => {
              console.log(error);
              res.status(401).json({ error });
            });
        }
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};

// Suppression d'une sauce
exports.deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Si l'utilisateur n'est pas le créateur de la sauce
      if (sauce.userId !== req.auth.userId) {
        res.status(403).json({ message: "Non autorisé" });
      } else {
        // Suppression de l'image
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Sauce supprimée" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// Récupération de toutes les sauces de l'API
exports.getAllSauces = (req, res) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
