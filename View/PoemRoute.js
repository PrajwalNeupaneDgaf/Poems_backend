const express = require("express");
const router = express.Router();
const {
  addPoem,
  editPoem,
  deletePoem,
  getPoem,
  getAllPoem,
  createBook,
} = require("../Controller/Poems");

const authMiddleware = require("../Auth.middleware");

router.post("/add/", authMiddleware, addPoem);
router.put("/update/:id", authMiddleware, editPoem);
router.delete("/delete/:id", authMiddleware, deletePoem);
router.get("/get/:id", authMiddleware,getPoem);
router.get("/getall", authMiddleware,getAllPoem);
router.get("/book/:username",createBook);

module.exports = router;

