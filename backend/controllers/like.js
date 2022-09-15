const Sauce = require("../models/Sauce");

exports.likeSauce = (req, res, next) => {
  const like = req.body.like;

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      switch (like) {
        case 1:
          likeSauce(sauce, req.body.userId)
            .then(() => {
              res.status(201).send({ message: "Choix enregistré !" });
            })
            .catch((error) => {
              res.status(500).send({ error });
            });

          break;

        case -1:
          dislikeSauce(sauce, req.body.userId)
            .then(() => {
              res.status(201).send({ message: "Choix enregistré !" });
            })
            .catch((error) => {
              res.status(500).send({ error });
            });

          break;

        case 0:
          resetSauce(sauce, req.body.userId)
            .then(() => {
              res.status(201).send({ message: "Choix enregistré !" });
            })
            .catch((error) => {
              res.status(500).send({ error });
            });

          break;

        default:
          res.status(400).send({ error });
        // console.log(error);
      }
    })
    .catch((error) => res.status(404).json({ error }));
};

//l'identifiant de l'utilisateur n'est pas dans le tableau et le like = 1
function likeSauce(sauce, userId) {
  if (!sauce.usersLiked.includes(userId)) {
    return Sauce.updateOne(
      { _id: sauce._id },
      {
        $inc: { likes: 1 },
        $push: { usersLiked: userId },
      }
    );
  }
}

//L'identifiant de l'utilisateur n'est pas dans le tableau et le like = -1
function dislikeSauce(sauce, userId) {
  if (!sauce.usersDisliked.includes(userId)) {
    return Sauce.updateOne(
      { _id: sauce._id },
      {
        $inc: { dislikes: +1 },
        $push: { usersDisliked: userId },
      }
    );
  }
}
// le like = 0
function resetSauce(sauce, userId) {
  //Si l'identifiant de l'utilisateur est déjà dans le tableau des "likes"
  if (sauce.usersLiked.includes(userId)) {
    return Sauce.updateOne(
      { _id: sauce._id },
      {
        $inc: { likes: -1 },
        $pull: { usersLiked: userId },
      }
    );
  }
  //Si l'identifiant de l'utilisateur est déjà dans le tableau des "dislikes"
  if (sauce.usersDisliked.includes(userId)) {
    return Sauce.updateOne(
      { _id: sauce._id },
      {
        $inc: { dislikes: -1 },
        $pull: { usersDisliked: userId },
      }
    );
  }
}
