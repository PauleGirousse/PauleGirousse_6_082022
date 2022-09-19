const Sauce = require("../models/Sauce");

// l'identifiant de l'utilisateur n'est pas dans le tableau et le like = 1
function likeSauce(sauce, userId) {
  if (!sauce.usersLiked.includes(userId)) {
    return Sauce.updateOne(
      { _id: sauce.id },
      {
        $inc: { likes: 1 },
        $push: { usersLiked: userId },
      }
    );
  }
  throw new Error(Error.message);
}

// L'identifiant de l'utilisateur n'est pas dans le tableau et le like = -1
function dislikeSauce(sauce, userId) {
  if (!sauce.usersDisliked.includes(userId)) {
    return Sauce.updateOne(
      { _id: sauce.id },
      {
        $inc: { dislikes: +1 },
        $push: { usersDisliked: userId },
      }
    );
  }
  throw new Error(Error.message);
}

// le like = 0
function resetSauce(sauce, userId) {
  // Si l'identifiant de l'utilisateur est déjà dans le tableau des "likes"
  if (sauce.usersLiked.includes(userId)) {
    return Sauce.updateOne(
      { _id: sauce.id },
      {
        $inc: { likes: -1 },
        $pull: { usersLiked: userId },
      }
    );
  }
  // Si l'identifiant de l'utilisateur est déjà dans le tableau des "dislikes"
  if (sauce.usersDisliked.includes(userId)) {
    return Sauce.updateOne(
      { _id: sauce.id },
      {
        $inc: { dislikes: -1 },
        $pull: { usersDisliked: userId },
      }
    );
  }
  throw new Error(Error.message);
}

exports.likeSauce = (req, res) => {
  const { like } = req.body;

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      switch (like) {
        case 1:
          likeSauce(sauce, req.body.userId)
            .then(() => {
              res.status(201).send({ message: "Choix enregistré" });
            })
            .catch((error) => {
              res.status(500).send({ error });
            });

          break;

        case -1:
          dislikeSauce(sauce, req.body.userId)
            .then(() => {
              res.status(201).send({ message: "Choix enregistré" });
            })
            .catch((error) => {
              res.status(500).send({ error });
            });

          break;

        case 0:
          resetSauce(sauce, req.body.userId)
            .then(() => {
              res.status(201).send({ message: "Choix enregistré" });
            })
            .catch((error) => {
              res.status(500).send({ error });
            });

          break;

        default:
          res.status(400).send({ message: "erreur dans la requête" });
      }
    })
    .catch((error) => res.status(404).json({ error }));
};
