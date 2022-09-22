const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const validationRequestInput = require("../middleware/validation-request-input");
const validationObjectInput = require("../middleware/validation-object-input");

const saucesCtrl = require("../controllers/sauces");
const likeCtrl = require("../controllers/like");

router.get("/", auth, saucesCtrl.getAllSauces);
router.post("/", auth, validationObjectInput, multer, saucesCtrl.createSauce);
router.post("/:id/like", auth, likeCtrl.likeSauce);

router.get("/:id", auth, saucesCtrl.getOneSauce);

router.put(
  "/:id",
  auth,
  validationRequestInput,
  multer,
  saucesCtrl.modifySauce
);

router.delete("/:id", auth, saucesCtrl.deleteSauce);

module.exports = router;
