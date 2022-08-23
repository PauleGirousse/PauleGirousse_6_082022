// const express = require("express");

// const router = express.Router();

// router.post("/api/sauces", (req, res, next) => {
//   delete req.body._id;
//   const sauce = new Sauce({
//     ...req.body,
//   });
//   sauce
//     .save()
//     .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
//     .catch((error) => res.status(400).json({ error }));
// });

// router.put("/api/sauces/:id", (req, res, next) => {
//   Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
//     .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
//     .catch((error) => res.status(400).json({ error }));
// });

// router.delete("/api/sauces/:id", (req, res, next) => {
//   Sauce.deleteOne({ _id: req.params.id })
//     .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
//     .catch((error) => res.status(400).json({ error }));
// });

// router.get("/api/sauces/:id", (req, res, next) => {
//   Sauce.findOne({ _id: req.params.id })
//     .then((sauce) => res.status(200).json(sauce))
//     .catch((error) => res.status(404).json({ error }));
// });

// router.get("/api/sauces", (req, res, next) => {
//   Sauce.find()
//     .then((sauces) => res.status(200).json(sauces))
//     .catch((error) => res.status(400).json({ error }));
// });

// module.exports = router;

const express = require("express");
const router = express.Router();

const Sauce = require("../models/sauces");
const saucesCtrl = require("../controllers/sauces");

router.post("/", saucesCtrl.createSauce);
router.get("/", saucesCtrl, getAllSauce);

router.get("/:id", saucesCtrl, getOneSauce);

router.put("/:id", saucesCtrl, saucesCtrl.modifySauce);

router.delete("/:id", saucesCtrl, deleteSauce);

module.exports = router;
