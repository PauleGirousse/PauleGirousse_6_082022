// Pour la suppression de fichiers
const fs = require("fs");

// Modèle de sauce
const Sauce = require("../models/Sauce");

// Création d'une sauce (suppression de l'indentifiant pour en générer un à partir du token)
exports.createSauce = (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);

  delete sauceObject.id;
  delete sauceObject.userId;

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

// Modification d'une sauce (avant changement, vérification que l'utilisateur soit le créateur de la sauce et création du nouvel objet sauce).
exports.modifySauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId !== req.auth.userId) {
        res.status(403).json({ message: "Non autorisé" });
      } else {
        if (req.file) {
          const filename = sauce.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            const sauceObject = {
              ...req.body,
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
              }`,
            };
            delete sauceObject.userId;
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

// Suppression d'une sauce (avant suppression, vérification que l'utilisateur soit le créateur de la sauce et de l'image).
exports.deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId !== req.auth.userId) {
        res.status(403).json({ message: "Non autorisé" });
      } else {
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
