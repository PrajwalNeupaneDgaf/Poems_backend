const express = require("express");
const { register, login, me ,searchUsers} = require("../Controller/Auth");
const authMiddleware = require("../Auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/search/:query", searchUsers);
router.get("/me", authMiddleware, me);

module.exports = router;
