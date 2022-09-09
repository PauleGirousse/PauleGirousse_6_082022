const Sauce = require("../models/Sauce");

exports.likeSauce = (req, res, next) => {
  console.log("requete like", req.body);
  const like = req.body.like;
  // _id= req.params.id,
  (userId = req.body.userId),
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        console.log("sauce", sauce);

        switch (like) {
          case 1:
            //l'identifiant de l'utilisateur n'est pas dans le tableau
            if (!sauce.usersLiked.includes(req.body.userId)) {
              Sauce.updateOne(
                { _id: req.params.id },
                {
                  $inc: { likes: 1 },
                  $push: { usersLiked: req.body.userId },
                }
                // sauce.usersLiked.push(userId),
                // (sauce.likes += 1)
              );
              // console.log("+1", likes, usersLiked);
            }
            break;

          case -1:
            //L'identifiant de l'utilisateur n'est pas dans le tableau
            if (!sauce.usersDisliked.includes(req.body.userId)) {
              Sauce.updateOne(
                { _id: req.params.id },
                {
                  $inc: { dislikes: +1 },
                  $push: { usersDisliked: req.body.userId },
                }
              );
            }

            break;

          case 0:
            //Si l'identifiant de l'utilisateur est déjà dans le tableau
            if (sauce.usersLiked.includes(req.body.userId)) {
              Sauce.updateOne(
                { _id: req.params.id },
                {
                  $inc: { likes: -1 },
                  $pull: { usersLiked: req.body.userId },
                }
              );
              console.log("sauce_apres", sauce);

              //Si l'identifiant de l'utilisateur est déjà dans le tableau
              if (sauce.usersDisliked.includes(req.body.userId)) {
                Sauce.updateOne(
                  { _id: req.params.id },
                  {
                    $inc: { dislikes: -1 },
                    $pull: { usersDisliked: req.body.userId },
                  }
                );
                console.log("sauce_apres", sauce);
              }
            }
            break;

          default:
            console.log(error);
        }
      })
      .catch((error) => res.status(404).json({ error }));
};

// exports.likeSauce = (req, res, next) => {
//   console.log("la", req.body);

//   const likeObject = req.body;
//   console.log(likeObject);
//   // delete likeObject._id;
//   // const liked = new Like({
//   //   // _id: like_req.params.id,
//   //   userId: req.auth.userId,
//   //   like: req.body.like,
//   // });
//   // liked.save();
//   // console.log("ici", liked._id, liked.userId, liked.like);
//   // .then(() => {
//   //   res.status(201).json({ message: "Choix enregistré !" });
//   // })

//   // .catch((error) => {
//   //   console.log(error);
//   //   res.status(400).json({ error });
//   // });

//   Sauce.findOne({ _id: req.params.id })

//     .then((sauce) => {
//       console.log("etape1", sauce);
//       if (req.body.like === 1) {
//         if (sauce.usersLiked.includes(req.body.userId)) {
//           Sauce.updateOne(
//             { _id: req.params.id },
//             {
//               $pull: { usersLiked: req.body.userId },
//               $inc: { likes: -1 },
//             }
//           );

//           // throw new Exception("L'utilisateur aime déjà cette sauce");
//         }
//         console.log("etape+1=>0", sauce);

//         if (sauce.usersDisliked.includes(req.body.userId)) {
//           Sauce.updateOne(
//             { _id: req.params.id },
//             {
//               $pull: { usersDisliked: req.body.userId },
//               $inc: { dislikes: -1 },
//               $push: { usersLiked: req.body.userId },
//               $inc: { likes: +1 },
//             }
//           );
//           console.log("etape-1=>+1", sauce);
//           // .then(() =>
//           //   res.status(201).json({ message: "Tableaux mis à jour" })
//           // )
//           // .catch((error) => res.status(400).json({ error }));
//         } else {
//           Sauce.updateOne(
//             { _id: req.params.id },
//             {
//               $push: { usersLiked: req.body.userId },
//               $inc: { likes: +1 },
//             }
//           );
//           console.log("etape0=>+1", sauce);
//           // .catch((error) => {
//           //   res.status(400).json({ error });
//           //   console.log(error);
//           // }
//           // );

//           // .then(() => res.status(201).json({ message: "Tableau mis à jour" }))
//           // .catch((error) => res.status(400).json({ error }));
//         }
//       }
//       if (req.body.like === -1) {
//         if (sauce.usersDisliked.includes(req.body.userId)) {
//           Sauce.updateOne(
//             { _id: req.params.id },
//             {
//               $pull: { usersDisliked: req.body.userId },
//               $inc: { disliked: -1 },
//             }
//           );
//           // throw new Exception("L'utilisateur a déja fait ce choix");
//           // res

//           // .status(400)
//           // .json({ message: "L'utilisateur a  déjà fait ce choix !" });
//         }
//         console.log("etape-1=>0", sauce);
//         if (sauce.usersLiked.includes(req.body.userId)) {
//           Sauce.updateOne(
//             { _id: req.params.id },
//             {
//               $pull: { usersLiked: req.body.userId },
//               $inc: { likes: -1 },
//               $push: { usersDisliked: req.body.userId },
//               $inc: { dislikes: +1 },
//             }
//             // .then(() =>
//             //   res.status(201).json({ message: "Tableaux mis à jour" })
//             // )
//             // .catch((error) => res.status(400).json({ error }))
//           );
//           console.log("etape-1=>+1", sauce);
//         } else {
//           Sauce.updateOne(
//             { _id: req.params.id },
//             {
//               $push: { usersDisliked: req.body.userId },
//               $inc: { dislikes: +1 },
//             }
//             // .then(() =>
//             //   res.status(201).json({ message: "Tableaux mis à jour" })
//             // )
//             // .catch((error) => res.status(400).json({ error }))
//           );
//         }
//         console.log("etape0=>-1", sauce);
//         // } else {
//         //   if (sauce.usersLiked.includes(liked.userId)) {
//         //     Sauce.updateOne(
//         //       { _id: req.params.id },
//         //       { $pull: { usersLiked: liked.userId }, $inc: { likes: +1 } }

//         //       // .then(() =>
//         //       //   res.status(201).json({ message: "Tableau mis à jour" })
//         //       // )
//         //       // .catch((error) => res.status(400).json({ error }))
//         //     );
//         //   }
//         //   console.log("etape0=>+1", sauce);
//         // if (sauce.usersDisliked.includes(liked.userId)) {
//         //   Sauce.updateOne(
//         //     { _id: req.params.id },
//         //     { $pull: { usersDisliked: liked.userId }, $inc: { disliked: +1 } }

//         //     // .then(() =>
//         //     //   res.status(201).json({ message: "Tableau mis à jour" })
//         //     // )
//         //     // .catch((error) => res.status(400).json({ error }))
//         //   );console.log("etape0=>");
//         // }
//       }
//     })

//     .catch((error) => {
//       console.log(error, "ddfs");
//       res.status(400).json({ error });
//     });
// };
